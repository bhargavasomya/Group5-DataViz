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

    def get_all_sentences(self):
        return self.data

    @classmethod
    def get_closest_sentences(cls, points, k):
        cls.data["distance"] = [distance.euclidean(points, [row["p1"], row["p2"]]) for index, row in cls.data.iterrows()]
        return cls.data.sort_values(by="distance")[:k]

    @classmethod
    def get_histogram(cls, q1, q2):
        print(cls.distance)
        closest_to_q1 = Sentences.get_closest_sentences(q1, 100)
        closest_to_q2 = Sentences.get_closest_sentences(q2, 100)

        # Somehow append this

        return np.histogram(cls.data["distance"]) if "distance" in cls.data.columns else []


