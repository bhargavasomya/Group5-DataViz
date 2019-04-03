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
        _points = pickle.load(open("./data/points.pkl", "rb"))
        _q1 = pickle.load(open("./data/question1.pkl", "rb"))
        _q2 = pickle.load(open("./data/question2.pkl", "rb"))
        q = _q1.append(_q2, ignore_index=True)

        # self.data["sentences"] = _sentences
        self.data["x"] = _points[:, 0]
        self.data["y"] = _points[:, 1]
        self.data["question"] = q
        self.nn = NeuralNetwork(embedding_index)

    def get_sentences(self, sentence1, sentence2, k=None):
        point1 = self.convert_to_points(sentence1)
        point2 = self.convert_to_points(sentence2)

        # Removing punctuations from strings
        sentence1 = sentence1.translate(str.maketrans('', '', string.punctuation))
        sentence2 = sentence2.translate(str.maketrans('', '', string.punctuation))

        self.data["distance1"] = [cosine_similarity([point1], [[row["x"], row["y"]]])[0][0] for index, row in
                                  self.data.iterrows()]
        self.data["distance2"] = [cosine_similarity([point2], [[row["x"], row["y"]]])[0][0] for index, row in
                                  self.data.iterrows()]

        self.data["model1_probs_1"] = [
            self.nn.predict_with_first_model(sentence1,
                                             row["question"].translate(str.maketrans('', '', string.punctuation)))
            for index, row in
            self.data.iterrows()]
        self.data["model1_probs_2"] = [
            self.nn.predict_with_first_model(sentence2,
                                             row["question"].translate(str.maketrans('', '', string.punctuation)))
            for index, row in
            self.data.iterrows()]
        self.data["model2_probs_1"] = [
            self.nn.predict_with_second_model(sentence1,
                                              row["question"].translate(str.maketrans('', '', string.punctuation)))
            for index, row in
            self.data.iterrows()]
        self.data["model2_probs_2"] = [
            self.nn.predict_with_second_model(sentence2,
                                              row["question"].translate(str.maketrans('', '', string.punctuation)))
            for index, row in
            self.data.iterrows()]

        return self.data[:k] if k is not None else self.data

    def convert_to_points(self, question):
        word_vec = np.array([0.0] * 5000)
        cleaned_question = Sentences.clean_data(question)

        offset = 0
        for w in self.create_word2vec(cleaned_question):
            for i, v in enumerate(w):
                word_vec[offset + i] = v
            offset += 50
        word_vec = sparse.csr_matrix(word_vec)

        lsa = LSA()

        return lsa.transform(word_vec)

    def create_word2vec(self, text):
        vector_list = [self.word2vec_model[word] for word in text if word in self.word2vec_model]
        return vector_list

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
