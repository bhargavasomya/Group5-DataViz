from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from ML.sentences import Sentences
from ML.init_server import create_embedding_index
import boto3
from tqdm import tqdm
import os
from flask import jsonify
import pandas as pd

try:
    os.mkdir("data")
except OSError:
    print("Creation of the directory failed")
else:
    print("Successfully created the directory")


s3 = boto3.resource('s3')
bucket = s3.Bucket('ds5500')

with open("data.txt", "r") as f:
    data_requirements = f.read()
    data_requirements = data_requirements.split()

    for d in tqdm(data_requirements):
        with open("data/" + d, 'wb') as data:
            bucket.download_fileobj(d, data)

application = Flask(__name__)
application.debug = True
api = Api(application)
CORS(application)

embedding_index = create_embedding_index()
sentence = Sentences(embedding_index)


@application.route('/getdata', methods=['POST'])
@cross_origin(origin='*',headers=['access-control-allow-origin','Content-Type'])
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

@application.route('/predict-duplicate-with-first-model', methods=['POST'])
@cross_origin(origin='*',headers=['access-control-allow-origin','Content-Type'])
def predict_with_first_model():
    q1 = ''
    q2 = ''
    if request.method == 'POST':
        names = request.get_json()
        q1 = names['q1']
        q2 = names['q2']

    print(q1)
    return jsonify({"result": str(sentence.predict_with_first_model(q1, q2)[0][0])})

@application.route('/predict-duplicate-with-second-model', methods=['POST'])
@cross_origin(origin='*',headers=['access-control-allow-origin','Content-Type'])
def predict_with_second_model():
    q1 = ''
    q2 = ''
    if request.method == 'POST':
        names = request.get_json()
        q1 = names['q1']
        q2 = names['q2']

    return jsonify({"result": str(sentence.predict_with_second_model(q1, q2)[0][0])})

@application.route('/getmatrix', methods=['POST'])
@cross_origin(origin='*',headers=['access-control-allow-origin','Content-Type'])
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
