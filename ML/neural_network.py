from __future__ import print_function
import numpy as np
import pickle
import json
from keras.models import Model
from keras.layers import Input, TimeDistributed, Dense, Lambda, concatenate, Dropout, BatchNormalization
from keras.preprocessing.text import Tokenizer
from keras.layers.embeddings import Embedding
from keras import backend as K
import keras
from keras.preprocessing.sequence import pad_sequences

from ML.lsa import LSA

WORD_EMBEDDING_MATRIX_FILE = './data/word_embedding_matrix.npy'
NB_WORDS_DATA_FILE = './data/nb_words.json'
FIRST_MODEL_WEIGHTS_FILE = './data/question_pairs_weights_network1.h5'
SECOND_MODEL_WEIGHTS_FILE = './data/question_pairs_weights_network2.h5'
MAX_NB_WORDS = 200000
MAX_SEQUENCE_LENGTH = 25
EMBEDDING_DIM = 300
RNG_SEED = 13371447
NB_EPOCHS = 25
DROPOUT = 0.1
BATCH_SIZE = 32


class NeuralNetwork(object):
    first_model = None
    second_model = None
    word_indices = None
    word_embedding_matrix = None
    nb_words = None
    embedding_index = None

    def __init__(self, embedding_index):
        self.load_prerequisite()
        self.load_first_model()
        self.load_second_model()
        self.embedding_index = embedding_index

    def word2vec(self, question):
        word_seq = keras.preprocessing.text.text_to_word_sequence(question)
        vec_sequence = [self.word_indices[w] for w in word_seq]
        vec_sequence = pad_sequences([vec_sequence], maxlen=25)
        return vec_sequence

    def load_prerequisite(self):
        with open(NB_WORDS_DATA_FILE, 'r') as f:
            self.nb_words = json.load(f)['nb_words']

        self.word_embedding_matrix = np.load(open(WORD_EMBEDDING_MATRIX_FILE, 'rb'))

        with open('./data/word_index.pickle', 'rb') as handle:
            self.word_indices = pickle.load(handle)

    def convert_to_points(self, question):
        question_word_sequences = self.word2vec(question)
        print(question_word_sequences)
        lsa = LSA()

        return lsa.transform(question_word_sequences)

    def predict_with_first_model(self, q1, q2):
        return self.first_model.predict([self.word2vec(q1), self.word2vec(q2)], verbose=0)

    def predict_with_second_model(self, q1, q2):
        return self.second_model.predict([self.word2vec(q1), self.word2vec(q2)], verbose=0)

    def load_second_model(self):
        K.clear_session()
        question1 = Input(shape=(MAX_SEQUENCE_LENGTH,))
        question2 = Input(shape=(MAX_SEQUENCE_LENGTH,))

        # layer 1 for question 1 to convert the sequence of vectors into dense representation
        q1 = Embedding(self.nb_words + 1,
                       EMBEDDING_DIM,
                       weights=[self.word_embedding_matrix],
                       input_length=MAX_SEQUENCE_LENGTH,
                       trainable=False)(question1)
        # We use time distributed layer to formulate the sequential nature of our words in the question
        q1 = TimeDistributed(Dense(EMBEDDING_DIM, activation='relu'))(q1)
        q1 = Lambda(lambda x: K.max(x, axis=1), output_shape=(EMBEDDING_DIM,))(q1)

        # layer 1 for question 2 to convert the sequence of vectors into dense representation
        q2 = Embedding(self.nb_words + 1,
                       EMBEDDING_DIM,
                       weights=[self.word_embedding_matrix],
                       input_length=MAX_SEQUENCE_LENGTH,
                       trainable=False)(question2)
        # We use time distributed layer to formulate the sequential nature of our words in the question
        q2 = TimeDistributed(Dense(EMBEDDING_DIM, activation='relu'))(q2)
        q2 = Lambda(lambda x: K.max(x, axis=1), output_shape=(EMBEDDING_DIM,))(q2)

        # Concatenate the representations for question 1 and 2
        merged = concatenate([q1, q2])

        # dense layer 1
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # dense layer 2
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # dense layer 3
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # dense layer 4
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # dense layer 5
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # dense layer 6
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # final prediction using sigmoid activation
        is_duplicate = Dense(1, activation='sigmoid')(merged)

        self.second_model = Model(inputs=[question1, question2], outputs=is_duplicate)
        self.second_model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
        self.second_model.load_weights(SECOND_MODEL_WEIGHTS_FILE)

    def load_first_model(self):
        K.clear_session()

        question1 = Input(shape=(MAX_SEQUENCE_LENGTH,))
        question2 = Input(shape=(MAX_SEQUENCE_LENGTH,))

        # layer 1 for question 1 to convert the sequence of vectors into dense representation
        q1 = Embedding(self.nb_words + 1,
                       EMBEDDING_DIM,
                       weights=[self.word_embedding_matrix],
                       input_length=MAX_SEQUENCE_LENGTH,
                       trainable=False)(question1)

        # We use time distributed layer to formulate the sequential nature of our words in the question
        q1 = TimeDistributed(Dense(EMBEDDING_DIM, activation='relu'))(q1)
        q1 = Lambda(lambda x: K.max(x, axis=1), output_shape=(EMBEDDING_DIM,))(q1)

        # layer 1 for question 2 to convert the sequence of vectors into dense representation
        q2 = Embedding(self.nb_words + 1,
                       EMBEDDING_DIM,
                       weights=[self.word_embedding_matrix],
                       input_length=MAX_SEQUENCE_LENGTH,
                       trainable=False)(question2)
        # We use time distributed layer to formulate the sequential nature of our words in the question
        q2 = TimeDistributed(Dense(EMBEDDING_DIM, activation='relu'))(q2)
        q2 = Lambda(lambda x: K.max(x, axis=1), output_shape=(EMBEDDING_DIM,))(q2)

        # Concatenate the representations for question 1 and 2
        merged = concatenate([q1, q2])

        # dense layer 1
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # dense layer 2
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # dense layer 3
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # dense layer 4
        merged = Dense(200, activation='relu')(merged)
        # to avoid overfitting
        merged = Dropout(DROPOUT)(merged)
        merged = BatchNormalization()(merged)

        # final prediction using sigmoid activation
        is_duplicate = Dense(1, activation='sigmoid')(merged)
        self.first_model = Model(inputs=[question1, question2], outputs=is_duplicate)
        self.first_model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

        self.first_model.load_weights(FIRST_MODEL_WEIGHTS_FILE)
