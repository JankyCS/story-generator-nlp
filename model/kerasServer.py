import flask
from flask import request, jsonify
import model
from flask_cors import CORS
import requests

storyModel = None
app = flask.Flask(__name__)
CORS(app)

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

@app.route("/grammar", methods=["POST"])
def grammar():
    data = {"success": False}
    body = request.json
    
    if "inputText" not in body:
        data["message"] = "Must include inputText in request body"
        return jsonify(data)

    text = body["inputText"]
    
    r = requests.post("https://grammarbot.p.rapidapi.com/check",
        data = {'text': text, 'language': 'en-US'},
        headers={
            'x-rapidapi-host': "grammarbot.p.rapidapi.com",
            'x-rapidapi-key': "",
            'content-type': "application/x-www-form-urlencoded"
        })

    j = r.json()
    new_text = ''
    cursor = 0
    for match in j["matches"]:
        offset = match["offset"]
        length = match["length"]
        if cursor > offset:
            continue
        # build new_text from cursor to current offset
        new_text += text[cursor:offset]
        # next add first replacement
        repls = match["replacements"]
        if repls and len(repls) > 0:
            new_text += repls[0]["value"]
        # update cursor
        cursor = offset + length
       
    # if cursor < text length, then add remaining text to new_text
    if cursor < len(text):
        new_text += text[cursor:]

    data["newText"] = new_text
    return jsonify(data)

if __name__ == '__main__':
    storyModel = model.useModel()
    model.makePrediction("primer", storyModel, 1)
    app.run()
