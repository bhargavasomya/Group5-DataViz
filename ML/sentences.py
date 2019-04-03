import pickle
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

import pandas as pd

from ML.neural_network import NeuralNetwork


class Sentences(object):
    data = pd.DataFrame()

    def __init__(self, embedding_index):
        # _sentences = pickle.load(open("./data/words.p", "rb"))
        _points = pickle.load(open("./data/points.pkl", "rb"))
        _q1 = pickle.load(open("./data/question1.pkl", "rb"))
        _q2 = pickle.load(open("./data/question2.pkl", "rb"))
        q = _q1.append(_q2, ignore_index=True)

        # self.data["sentences"] = _sentences
        self.data["p1"] = _points[:, 0]
        self.data["p2"] = _points[:, 1]
        self.data["q"] = q
        self.nn = NeuralNetwork(embedding_index)

    def get_sentences(self, sentence1, sentence2, k=None):
        points1 = [100, 100]
        points2 = [99, 20]

        # self.data["distance1"] = [cosine_similarity([points1], [[row["p1"], row["p2"]]])[0][0] for index, row in
        #                           self.data.iterrows()]
        # self.data["distance2"] = [cosine_similarity([points2], [[row["p1"], row["p2"]]])[0][0] for index, row in
        #                           self.data.iterrows()]

        self.data["model1_probs_1"] = [self.nn.predict_with_first_model(sentence1, row["q"]) for index, row in
                                       self.data.iterrows()]
        self.data["model1_probs_2"] = [self.nn.predict_with_first_model(sentence2, row["q"]) for index, row in
                                       self.data.iterrows()]
        self.data["model2_probs_1"] = [self.nn.predict_with_second_model(sentence1, row["q"]) for index, row in
                                       self.data.iterrows()]
        self.data["model2_probs_2"] = [self.nn.predict_with_second_model(sentence2, row["q"]) for index, row in
                                       self.data.iterrows()]

        return self.data[:k] if k is not None else self.data
