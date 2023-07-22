import tensorflow as tf
import tensorflow_hub as hub
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
import re
import seaborn as sns
import math
from random import shuffle
import matplotlib.pyplot as plt
from sentence_transformers import SentenceTransformer


t5base = SentenceTransformer('sentence-transformers/sentence-t5-base')
t5large = SentenceTransformer('sentence-transformers/sentence-t5-large')
t5xl = SentenceTransformer('sentence-transformers/sentence-t5-xl')
t5xxl = SentenceTransformer('sentence-transformers/sentence-t5-xxl')

def encode_t5base(sent): return t5base.encode([sent])[0]
def encode_t5large(sent): return t5large.encode([sent])[0]
def encode_t5xl(sent): return t5xl.encode([sent])[0]
def encode_t5xxl(sent): return t5xxl.encode([sent])[0]

def cosine_similarity(x, y): 
    if len(x) != len(y): return None
    dot_product = np.dot(x, y)
    magnitude_x = np.sqrt(np.sum(x**2)) 
    magnitude_y = np.sqrt(np.sum(y**2))
    return dot_product / (magnitude_x * magnitude_y)

social = ["totalitarian", "authoritarian", "statist", "liberal", "libertarian", "anarchist"]
economic = ["communist", "socialist", "progressive", "regulated capitalist", "capitalist", "laissez-faire"]
compare_to = "A free economy is effective with strong guidance"

belief_feats = {
    'base': [],
    'large': [],
    'xl': [],
    'xxl': []
}

for a in social:
    base_arr, large_arr, xl_arr, xxl_arr = [], [], [], []
    for h in economic:
        belief = "The best economy is {0} and the best government is {1}".format(h,a)
        base_arr.append(encode_t5base(belief))
        large_arr.append(encode_t5large(belief))
        xl_arr.append(encode_t5xl(belief))
        xxl_arr.append(encode_t5xxl(belief))

    belief_feats['base'].append(base_arr)
    belief_feats['large'].append(large_arr)
    belief_feats['xl'].append(xl_arr)
    belief_feats['xxl'].append(xxl_arr)    

def hot_take_plot(statement, idx):
    def plot(model, embed_fn):
        feats = embed_fn(statement)
        max_sim = -2
        min_sim = 2
        arrs = []
        for x in belief_feats[model]:
            arr = []
            for y in x:
                score = cosine_similarity(feats, y)
                max_sim = max(max_sim, score)
                min_sim = min(min_sim, score)
                arr.append(score)
            arrs.append(arr)
        
        sns.set(font_scale=1.2)
        g = sns.heatmap(
            arrs,
            xticklabels=economic,
            yticklabels=social,
            vmin=min_sim,
            vmax=max_sim,
            cmap="YlOrRd")
        g.set_title("T5-{0}: \"{1}\"".format(model, statement))
        plt.savefig("./static/exports/t5-{0}-{1}.png".format(model, idx), bbox_inches = 'tight')
        plt.clf()
    
    plot('base', encode_t5base)
    plot('large', encode_t5large)
    plot('xl', encode_t5xl)
    plot('xxl', encode_t5xxl)
    
    outfile = open("./static/exports/runs.txt", "a")
    statement = statement.replace("\n"," ")
    outfile.write(str(idx)+": "+statement+"\n")
    outfile.close()


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
    global req_idx
    req_idx += 1
    
    args = request.args
    if 'statement' not in args:
        return json.dumps({'status':400, 'message':'No statement'})
    
    statement = args['statement']
    hot_take_plot(statement, req_idx)
    return json.dumps({'status':200, 'req_idx': req_idx})

@app.errorhandler(404)
def not_found_error(error):
    return "error 404"

if __name__ == '__main__':
    port = 9102
    app.run(host='0.0.0.0', port=port)