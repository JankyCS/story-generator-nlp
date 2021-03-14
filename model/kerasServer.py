import flask
from flask import request, jsonify
import model

storyMod = None
app = flask.Flask(__name__)

if __name__ == '__main__':
    global storyModel
    storyModel = model.useModel()
    app.run()
