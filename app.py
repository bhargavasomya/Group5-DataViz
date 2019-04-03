from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from ML.sentences import Sentences
from ML.init_server import create_embedding_index

app = Flask(__name__)
api = Api(app)
CORS(app)

embedding_index = create_embedding_index()
sentence = Sentences(embedding_index)


@app.route('/getdata', methods=['POST'])
def get_data():
    q1 = ''
    q2 = ''
    if request.method == 'POST':
        names = request.get_json()
        q1 = names['q1']
        q2 = names['q2']
    return sentence.get_sentences(q1, q2).to_json()


if __name__ == '__main__':
    app.run()
