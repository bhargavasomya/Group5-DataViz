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



