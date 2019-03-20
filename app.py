from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS

from ML.sentences import Sentences
from ML.lsa import LSA

app = Flask(__name__)
api = Api(app)
CORS(app)

data = Sentences()


class ChartsAPI(Resource):
    def get(self):
        pass

    @app.route('/charts/scatterplot/', method=['GET'])
    def scatter_plot(self):
        return data.get_all_sentences()


class ClosestSentencesAPI(Resource):
    def get(self):
        pass

    @app.route('/closestsentences/<int:k>', method=['GET'])
    def closest(self, k):
        content = request.get_json()
        q1 = LSA.transform(content.get("q1"))
        q2 = LSA.transform(content.get("q2"))

        q1_closest = data.get_closest_sentences(q1, k=k)
        q2_closest = data.get_closest_sentences(q2, k=k)

        return q1_closest, q2_closest


api.add_resource(ChartsAPI, '/charts/scatterplot', endpoint='scatterplot')
api.add_resource(ClosestSentencesAPI, '/closestsentences/<int:k>', endpoint='closest')

if __name__ == '__main__':
    app.run()
