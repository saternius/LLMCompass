#import tensorflow as tf
#import tensorflow_hub as hub

from flask import Flask, request
from flask_cors import CORS
import simplejson as json

with open("./static/exports/runs.txt") as f:
    req_idx = (len([x for x in f]))
    print("Reqs: ", req_idx)

app = Flask(__name__, static_url_path='/public')
CORS(app)
@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

@app.route("/calcHotTake")
def gd():
    return json.dumps({'status':200, 'req_idx':17})

@app.errorhandler(404)
def not_found_error(error):
    return "error 404"

if __name__ == '__main__':
    port = 9102
    app.run(host='0.0.0.0', port=port)
