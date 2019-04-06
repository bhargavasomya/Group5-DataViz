from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from ML.sentences import Sentences
from ML.init_server import create_embedding_index

import pandas as pd

app = Flask(__name__)
api = Api(app)
CORS(app)

embedding_index = create_embedding_index()
sentence = Sentences(embedding_index)


@app.route('/getdata', methods=['POST'])
def get_data():
    q1 = ''
    q2 = ''
    k = 1000
    if request.method == 'POST':
        names = request.get_json()
        q1 = names['q1']
        q2 = names['q2']
        k = int(names['k'])
    return sentence.get_sentences(q1, q2, k=k).to_json(orient='records')

@app.route('/getmatrix', methods=['POST'])
def get_pairs():
    questions_array = None
    model = ''

    values = []

    if request.method == 'POST':
        json = request.get_json()
        questions_array = json['questions']
        model = json['model']

    for i in range(len(questions_array)):
        for j in range(len(questions_array)):
            q1 = questions_array[i]
            q2 = questions_array[j]
            val = sentence.predict_with_first_model(q1, q2) if model == "first" \
                    else sentence.predict_with_second_model(q1, q2)
            row = [q1, q2, val[0][0]]
            values.append(row)
    
    values = pd.DataFrame(values, columns=['x', 'y', 'values'])

    return values.to_json(orient='records')


if __name__ == '__main__':
    app.run()
