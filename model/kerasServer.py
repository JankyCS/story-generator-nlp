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

    try:
        pred = model.makePrediction(inputText, storyModel, numWords)
        data["completedText"] = pred[0]
        data["addedText"] = pred[1]
        data["success"] = True
    except:
        data["message"] = "Invalid characters"

    
    
    
    return jsonify(data)

if __name__ == '__main__':
    storyModel = model.useModel()
    model.makePrediction("primer", storyModel, 1)
    app.run()
