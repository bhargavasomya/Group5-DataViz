from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS

from sentences import Sentences

app = Flask(__name__)
api = Api(app)
CORS(app)

data = Sentences()


class ScatterPlot(Resource):
    def get(self):
        return data.get_all_sentences()


class ClosestSentences(Resource):
    def get(self, k):
        return data.get_closest_sentences(k)


api.add_resource(ScatterPlot, '/scatterplot/')
api.add_resource(ScatterPlot, '/closestsentences/<int:k>')

if __name__ == '__main__':
    app.run()
