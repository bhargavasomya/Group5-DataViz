from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS

from ML.sentences import Sentences
from ML.lsa import LSA

app = Flask(__name__)
api = Api(app)
CORS(app)

data = Sentences()

@app.route('/parse_data', methods=['GET', 'POST'])
def parse_data(data):
    if request.method == "POST":
         #Call the run model class methods to get data
	 #return it and the ajax call will pick it up

class RunModel(Resource):
	def model(data):
		K.clear_session()
		def word2vec(question):
			word_seq = keras.preprocessing.text.text_to_word_sequence(question)
			vec_sequence = [word_indices[w] for w in word_seq]
			vec_sequence = pad_sequences([vec_sequence], maxlen= 25)
			return vec_sequence

		WORD_EMBEDDING_MATRIX_FILE = 'word_embedding_matrix.npy'
		NB_WORDS_DATA_FILE = 'nb_words.json'
		MODEL_WEIGHTS_FILE = 'question_pairs_weights_network1.h5'
		MAX_SEQUENCE_LENGTH = 25
		EMBEDDING_DIM = 300
		VALIDATION_SPLIT = 0.1
		TEST_SPLIT = 0.1
		RNG_SEED = 13371447
		NB_EPOCHS = 25
		DROPOUT = 0.1
		BATCH_SIZE = 32

		with open(NB_WORDS_DATA_FILE, 'r') as f:
			nb_words = json.load(f)['nb_words']
			    
		word_embedding_matrix = np.load(open(WORD_EMBEDDING_MATRIX_FILE, 'rb'))

		with open('word_index.pickle', 'rb') as handle:
			word_indices = pickle.load(handle)

		question1 = Input(shape=(MAX_SEQUENCE_LENGTH,))
		question2 = Input(shape=(MAX_SEQUENCE_LENGTH,))

		#layer 1 for question 1 to convert the sequence of vectors into dense representation
		q1 = Embedding(nb_words + 1, 
				 EMBEDDING_DIM, 
				 weights=[word_embedding_matrix], 
				 input_length=MAX_SEQUENCE_LENGTH, 
				 trainable=False)(question1)
		#We use time distributed layer to formulate the sequential nature of our words in the question
		q1 = TimeDistributed(Dense(EMBEDDING_DIM, activation='relu'))(q1)
		q1 = Lambda(lambda x: K.max(x, axis=1), output_shape=(EMBEDDING_DIM, ))(q1)

		#layer 1 for question 2 to convert the sequence of vectors into dense representation
		q2 = Embedding(nb_words + 1, 
				 EMBEDDING_DIM, 
				 weights=[word_embedding_matrix], 
				 input_length=MAX_SEQUENCE_LENGTH, 
				 trainable=False)(question2)
		#We use time distributed layer to formulate the sequential nature of our words in the question
		q2 = TimeDistributed(Dense(EMBEDDING_DIM, activation='relu'))(q2)
		q2 = Lambda(lambda x: K.max(x, axis=1), output_shape=(EMBEDDING_DIM, ))(q2)

		#Concatenate the representations for question 1 and 2
		merged = concatenate([q1,q2])

		#dense layer 1
		merged = Dense(200, activation='relu')(merged)
		#to avoid overfitting
		merged = Dropout(DROPOUT)(merged)
		merged = BatchNormalization()(merged)

		#dense layer 2
		merged = Dense(200, activation='relu')(merged)
		#to avoid overfitting
		merged = Dropout(DROPOUT)(merged)
		merged = BatchNormalization()(merged)

		#dense layer 3
		merged = Dense(200, activation='relu')(merged)
		#to avoid overfitting
		merged = Dropout(DROPOUT)(merged)
		merged = BatchNormalization()(merged)

		#dense layer 4
		merged = Dense(200, activation='relu')(merged)
		#to avoid overfitting
		merged = Dropout(DROPOUT)(merged)
		merged = BatchNormalization()(merged)

		#final prediction using sigmoid activation
		is_duplicate = Dense(1, activation='sigmoid')(merged)
		model = Model(inputs=[question1,question2], outputs=is_duplicate)
		model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
		
		model.load_weights(MODEL_WEIGHTS_FILE)
		#Yet to do something with the weights, create json and sent to front end
		#After creating json K.clear_session() again
		#Do the same as above for the other networks





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
        q1 = LSA.transform(content.get("q1"))
        q2 = LSA.transform(content.get("q2"))

        q1_closest = data.get_closest_sentences(q1, k=k)
        q2_closest = data.get_closest_sentences(q2, k=k)

        return q1_closest, q2_closest


api.add_resource(ChartsAPI, '/charts/scatterplot', endpoint='scatterplot')
api.add_resource(ClosestSentencesAPI, '/closestsentences/<int:k>', endpoint='closest')

if __name__ == '__main__':
    app.run()
