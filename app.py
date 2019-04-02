from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from flask import jsonify
from ML.sentences import Sentences
from ML.neural_network import NeuralNetwork

app = Flask(__name__)
api = Api(app)
CORS(app)

sentence = Sentences()
nn = NeuralNetwork()


@app.route('/getdata', methods=['POST'])
def get_data():
    q1 = ''
    q2 = ''
    if request.method == 'POST':
        names = request.get_json()
        q1 = names['q1']
        q2 = names['q2']

    return sentence.get_sentences(nn, q1, q2, k = 10)


if __name__ == '__main__':
    app.run()
