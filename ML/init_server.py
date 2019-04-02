import numpy as np

DATASETS_DIR = './data/'
GLOVE_FILE = 'glove.6B.300d.txt'


def create_embedding_index():
    embeddings_index = {}
    with open(DATASETS_DIR + GLOVE_FILE, encoding='utf-8') as f:
        for line in f:
            values = line.split(' ')
            word = values[0]
            embedding = np.asarray(values[1:], dtype='float32')
            embeddings_index[word] = embedding

    return embeddings_index
