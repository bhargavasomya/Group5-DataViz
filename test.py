from ML.sentences import Sentences
from ML.lsa import LSA

s = Sentences()
print("hello")
# print(Sentences.get_histogram([0,0]))

points = Sentences.get_closest_sentences([0.1,0.1], 500)
out = points.to_json(orient='records')
with open("points.json", 'w') as p:
    p.write(out)
