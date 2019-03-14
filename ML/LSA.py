import pickle


class LSA(object):
    def __init__(self):
        self.model = pickle.load(open("./data/lsa_model.pkl", "rb"))

    def transform(self, sentence: str):
        return self.model.transform(sentence)
