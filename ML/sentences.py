import pickle
import numpy as np
import string
import re
import nltk
from nltk import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity

import pandas as pd

from ML.lsa import LSA
from ML.neural_network import NeuralNetwork


class Sentences(object):
    data = pd.DataFrame()

    def __init__(self, embedding_index):
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')

        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')

        self.word2vec_model = Sentences.load_glove_model('./data/glove.6B.50d.txt')

        # _sentences = pickle.load(open("./data/words.p", "rb"))
        points = pickle.load(open("./data/points.pkl", "rb"))
        questions = pickle.load(open("./data/questions.pkl", "rb"))
        extra_questions = pickle.load(open("./data/demo_sentences.pkl", "rb"))

        # self.data["sentences"] = _sentences
        self.data["x"] = points[:, 0]
        self.data["y"] = points[:, 1]
        self.data["question"] = questions

        self.data = extra_questions.append(self.data)
        self.nn = NeuralNetwork(embedding_index)
        self.lsa = LSA()

    def get_sentences(self, sentence1, sentence2, k=1000):
        point1 = self.convert_to_points(sentence1)
        point2 = self.convert_to_points(sentence2)

        # Append the question
        local_data = self.data[:k]
        local_data.append(pd.DataFrame([[point1[0], point1[1], sentence1], [point2[0], point2[1], sentence2]],
                                       columns=['x', 'y', 'question']))

        # Removing punctuations from strings
        sentence1 = sentence1.translate(str.maketrans('', '', string.punctuation))
        sentence2 = sentence2.translate(str.maketrans('', '', string.punctuation))

        local_data["distance1"] = [cosine_similarity([point1], [[row["x"], row["y"]]])[0][0] for index, row in
                                   self.data[:k].iterrows()]
        local_data["distance2"] = [cosine_similarity([point2], [[row["x"], row["y"]]])[0][0] for index, row in
                                   self.data[:k].iterrows()]

        local_data["model1_probs_1"] = [
            self.nn.predict_with_first_model(sentence1,
                                             row["question"].translate(str.maketrans('', '', string.punctuation)))[0][0]
            for index, row in
            self.data[:k].iterrows()]
        local_data["model1_probs_2"] = [
            self.nn.predict_with_first_model(sentence2,
                                             row["question"].translate(str.maketrans('', '', string.punctuation)))[0][0]
            for index, row in
            self.data[:k].iterrows()]
        local_data["model2_probs_1"] = [
            self.nn.predict_with_second_model(sentence1,
                                              row["question"].translate(str.maketrans('', '', string.punctuation)))[0][0]
            for index, row in
            self.data[:k].iterrows()]
        local_data["model2_probs_2"] = [
            self.nn.predict_with_second_model(sentence2,
                                              row["question"].translate(str.maketrans('', '', string.punctuation)))[0][0]
            for index, row in
            self.data[:k].iterrows()]

        return local_data

    def convert_to_points(self, question):
        word_vec = np.array([0.0] * 5000)
        cleaned_question = Sentences.clean_data(question)

        offset = 0
        for w in self.create_word2vec(cleaned_question):
            for i, v in enumerate(w):
                word_vec[offset + i] = v
            offset += 50
        word_vec = sparse.csr_matrix(word_vec)

        return self.lsa.transform(word_vec)[0]

    def create_word2vec(self, text):
        vector_list = [self.word2vec_model[word] for word in text if word in self.word2vec_model]
        return vector_list

    def predict_with_first_model(self, q1, q2):
        return self.nn.predict_with_first_model(q1, q2)

    def predict_with_second_model(self, q1, q2):
        return self.nn.predict_with_second_model(q1, q2)

    @staticmethod
    def clean_data(text):
        """
        Input: Text string to be cleaned
        Output: list of clean words
        Function: Cleans text string to output cleaned words
        """
        # punctuations = string.punctuation + '—' + '’' + '‘' + '–' + '”' + '“'+ '[' +']' + '{' + '}'
        # regex = re.compile('[%s]' % re.escape(punctuations))
        clean_text = ''
        for sentence in sent_tokenize(text):
            # sentence=regex.sub('', sentence)
            sentence = re.sub(r"\n", " ", sentence)
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
            sentence = re.sub(' +', ' ', sentence)
            sentence = re.sub(r"[^A-Za-z0-9(),!.?\'\`]", " ", sentence)
            sentence = re.sub(r"""
                   [,.;@#?!&$)(]+  # Accept one or more copies of punctuation
                   \ *           # plus zero or more copies of a space,
                   """,
                              " ",  # and replace it with a single space
                              sentence, flags=re.VERBOSE)
            clean_text = clean_text + ' ' + sentence
            clean_text = clean_text.lower()
        stop_words = set(stopwords.words('english'))
        word_tokens = word_tokenize(clean_text)
        filtered_sentence = [w for w in word_tokens if w not in stop_words]

        return filtered_sentence

    @staticmethod
    def load_glove_model(glove_file):
        print("Loading Glove Model")
        f = open(glove_file, 'r', encoding="utf8")
        model = {}
        for line in f:
            split_line = line.split()
            word = split_line[0]
            embedding = np.array([float(val) for val in split_line[1:]])
            model[word] = embedding
        print("Done.", len(model), " words loaded!")
        return model
