from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from flask import jsonify
import numpy as np
from nltk.tokenize import sent_tokenize, word_tokenize	
#from ML.sentences import Sentences
#from ML.lsa import LSA

import ML.init_server as init_server

app = Flask(__name__)
api = Api(app)
CORS(app)

#data = Sentences()
#embedding_index = {}

def loadGloveModel(gloveFile):
    '''
    Input: Name of the glove vector file downloaded from stanford website
    Output: Dictionary of words with corresponding vector values
    Function: Loads the word vector dictionary
    '''
    print("Loading Glove Model")
    f = open(gloveFile,'r',encoding="utf8")
    model = {}
    for line in f:
        
        splitLine = line.split()
        word = splitLine[0]
        embedding = np.array([float(val) for val in splitLine[1:]])
        model[word] = embedding
    print("Done.",len(model)," words loaded!")
    return model

glove_model = loadGloveModel('data/glove.6B.300d.txt')

def clean_data(body):
    """
    Input: Text string to be cleaned
    Output: list of clean words
    Function: Cleans text string to output cleaned words
    """
    #punctuations = string.punctuation + '—' + '’' + '‘' + '–' + '”' + '“'+ '[' +']' + '{' + '}'
    #regex = re.compile('[%s]' % re.escape(punctuations))
    clean_text=''
    for sentence in sent_tokenize(body):
        #sentence=regex.sub('', sentence)
        sentence=re.sub(r"\n", " ", sentence)
        sentence = re.sub(r"i'm", "i am", sentence)
        sentence = re.sub(r"he's", "he is", sentence)
        sentence = re.sub(r"she's", "she is", sentence)
        sentence = re.sub(r"it's", "it is", sentence)
        sentence = re.sub(r"that's", "that is", sentence)
        sentence = re.sub(r"what's", "what is", sentence)
        sentence = re.sub(r"where's", "where is", sentence)
        sentence = re.sub(r"how's", "how is", sentence)
        sentence = re.sub(r"\'ll", " will", sentence)
        sentence = re.sub(r"\'ve", " have", sentence)
        sentence = re.sub(r"\'re", " are", sentence)
        sentence = re.sub(r"\'d", " would", sentence)
        sentence = re.sub(r"\'re", " are", sentence)
        sentence = re.sub(r"won't", "will not", sentence)
        sentence = re.sub(r"can't", "cannot", sentence)
        sentence = re.sub(r"n't", " not", sentence)
        sentence = re.sub(r"n'", "ng", sentence)
        sentence = re.sub(r"'bout", "about", sentence)
        sentence = re.sub(r"'til", "until", sentence)
        sentence = re.sub(' +',' ',sentence)
        sentence = re.sub(r"[^A-Za-z0-9(),!.?\'\`]", " ", sentence)
        sentence = re.sub(r"""
               [,.;@#?!&$)(]+  # Accept one or more copies of punctuation
               \ *           # plus zero or more copies of a space,
               """,
               " ",          # and replace it with a single space
               sentence, flags=re.VERBOSE)
        clean_text=clean_text+' '+sentence
        clean_text = clean_text.lower()
    stop_words = set(stopwords.words('english')) 
    word_tokens = word_tokenize(clean_text) 
    filtered_sentence = [w for w in word_tokens if not w in stop_words] 
    
    return filtered_sentence

def create_word2vec(text):
    """
    Input: List of words
    Output: List of vectors
    Function: Converts list of words to list of vectors for each input sentence
    """
    vector_list = []
    for word in text:
      if word in model:
        #print(word, model[word])
        vector_list.append(model[word])
    return vector_list

@app.route('/getdata', methods=['POST'])
def get_data():
	q1 = ''
	q2 = ''
	if request.method == 'POST':
		names = request.get_json()
		q1 = names['q1']
		q2 = names['q2']	
	
	q1 = clean_data(q1)
	q1 = create_word2vec(q1)

	q2 = clean_data(q1)
	q2 = create_word2vec(q1)
	
	return jsonify(['test','123'])
    # Call the run model class methods to get data
    # return it and the ajax call will pick it up

'''
class RunModel(Resource):
    def model(data):
        """
		@Sriram: I moved this to another file - Bagus
		:return:
	"""
	pass

'''
class ChartsAPI(Resource):
    def get(self):
        pass

    @app.route('/charts/scatterplot/', method=['GET'])
    def scatter_plot(self):
        return data.get_all_sentences()


class ClosestSentencesAPI(Resource):
    def get(self):
        pass

    @app.route('/closestsentences/<int:k>', method=['GET'])
    def closest(self, k):
        content = request.get_json()
        print(content)
        q1 = LSA.transform(content.get("q1"))
        q2 = LSA.transform(content.get("q2"))

        q1_closest = data.get_closest_sentences(q1, k=k)
        q2_closest = data.get_closest_sentences(q2, k=k)

        return q1_closest, q2_closest


api.add_resource(ChartsAPI, '/charts/scatterplot', endpoint='scatterplot')
api.add_resource(ClosestSentencesAPI, '/closestsentences/<int:k>', endpoint='closest')

if __name__ == '__main__':
    global embedding_index

    embedding_index = init_server.create_embedding_index()
    app.run()
