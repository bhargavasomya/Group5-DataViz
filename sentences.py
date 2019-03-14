import pickle
import pandas as pd
import scipy.spatial.distance as distance


class Sentences(object):
    data = pd.DataFrame()

    def __init__(self):
        _sentences = pickle.load(open("./data/words.p", "rb"))
        _points = pickle.load(open("./data/points.p", "rb"))

        self.data["sentences"] = _sentences
        self.data["points"] = _points

    def get_all_sentences(self):
        return self.data

    def get_closest_sentences(self, points: list, k: int) -> list:
        _data = self.data.copy()
        _data["distance"] = [distance.cosine(points, row["points"]) for index, row in _data.iterrows()]
        _data.sort_values(by="distance")

        return _data[:k]






