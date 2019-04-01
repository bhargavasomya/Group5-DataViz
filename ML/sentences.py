import pickle
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.utils.data_utils import get_file

import pandas as pd

DATASETS_DIR = '../data'
GLOVE_FILE = 'glove.6B.300d.txt'
WORD_EMBEDDING_MATRIX_FILE = 'word_embedding_matrix.npy'
NB_WORDS_DATA_FILE = 'nb_words.json'
MAX_NB_WORDS = 200000
MAX_SEQUENCE_LENGTH = 25
EMBEDDING_DIM = 300

class Sentences(object):
    data = pd.DataFrame()

    def __init__(self):
        # _sentences = pickle.load(open("./data/words.p", "rb"))
        _points = pickle.load(open("./data/points.pkl", "rb"))
        _q1 = pickle.load(open("./data/question1.pkl", "rb"))
        _q2 = pickle.load(open("./data/question2.pkl", "rb"))
        q = _q1.append(_q2, ignore_index=True)

        # self.data["sentences"] = _sentences
        self.data["p1"] = _points[:,0]
        self.data["p2"] = _points[:,1]
        self.data["q"] = q


    @classmethod
    def get_all_sentences(cls):
        return cls.data[:700]

    @classmethod
    def get_closest_sentences(cls, points, k = None):
        cls.data["distance"] = [cosine_similarity([points], [[row["p1"], row["p2"]]])[0][0] for index, row in cls.data.iterrows()]
        return cls.data.sort_values(by="distance")[:k] if k != None else cls.data.sort_values(by="distance")

    @classmethod
    def get_histogram(cls, q):
        closest_to_q = Sentences.get_closest_sentences(q, 100)
        return np.histogram(cls.data["distance"], bins=20)

    @staticmethod
    def clean_for_keras(q1, q2, embeddings_index):
        questions = q1 + q2
        tokenizer = Tokenizer(num_words = MAX_NB_WORDS)
        tokenizer.fit_on_texts(questions)

        question1_word_sequences = tokenizer.texts_to_sequences(q1)
        question2_word_sequences = tokenizer.texts_to_sequences(q2)
        word_index = tokenizer.word_index

        nb_words = min(MAX_NB_WORDS, len(word_index))
        word_embedding_matrix = np.zeros((nb_words + 1, EMBEDDING_DIM))
        for word, i in word_index.items():
            if i > MAX_NB_WORDS:
                continue
            embedding_vector = embeddings_index.get(word)
            if embedding_vector is not None:
                word_embedding_matrix[i] = embedding_vector

        q1_data = pad_sequences(question1_word_sequences, maxlen=MAX_SEQUENCE_LENGTH)
        q2_data = pad_sequences(question2_word_sequences, maxlen=MAX_SEQUENCE_LENGTH)

        return q1_data, q2_data


