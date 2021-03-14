import flask
from flask import request, jsonify
import model

storyModel = None
app = flask.Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = {"success": False}
    body = request.json
    
    numWords = 10
    if "inputText" not in body:
        data["message"] = "Must include inputText in request body"
        return jsonify(data)

    if "numWords" in body:
        numWords = body["numWords"]

    inputText = body["inputText"]

    pred = model.makePrediction(inputText, storyModel, numWords)

    
    data["stuff1"] = pred[0]
    data["stuff2"] = pred[1]
    
    return jsonify(data)

if __name__ == '__main__':
    storyModel = model.useModel()
    app.run()
