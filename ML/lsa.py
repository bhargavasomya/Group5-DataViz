import pickle


class LSA(object):
    def __init__(self):
        self.model = pickle.load(open("./data/lsa_model.pkl", "rb"))

    @classmethod
    def transform(cls, sentence: str):
        return cls.model.transform(sentence)
