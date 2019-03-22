import pickle
import pandas as pd
import numpy as np
import scipy.spatial.distance as distance


class Sentences(object):
    data = pd.DataFrame()

    def __init__(self):
        # _sentences = pickle.load(open("./data/words.p", "rb"))
        _points = pickle.load(open("./data/points.pkl", "rb"))

        # self.data["sentences"] = _sentences
        self.data["p1"] = _points[:,0]
        self.data["p2"] = _points[:,1]

    @classmethod
    def get_all_sentences(cls):
        return cls.data[:700]

    @classmethod
    def get_closest_sentences(cls, points, k = None):
        cls.data["distance"] = [distance.euclidean(points, [row["p1"], row["p2"]]) for index, row in cls.data.iterrows()]
        return cls.data.sort_values(by="distance")[:k] if k != None else cls.data.sort_values(by="distance")

    @classmethod
    def get_histogram(cls, q):
        closest_to_q = Sentences.get_closest_sentences(q, 100)
        return np.histogram(cls.data["distance"], bins=20)


