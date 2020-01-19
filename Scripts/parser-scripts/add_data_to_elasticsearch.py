import requests
import json
import time

t0 = time.time()
ELASTIC_URL = "https://search-diseases-symptoms-pyhhcjkict7d5ksiazurzo4m2a.us-west-2.es.amazonaws.com/"
INDEX = "diseases"
TYPE = "api"
HEADERS = {'content-type': 'application/json'}

with open('../data/diseases_symptoms_new.json', 'r') as f:
     data = json.load(f)

for x in data["diseases"]:
	disease_name = str(x["disease"].encode('utf-8'))
	print "Processing disease: %s" % disease_name
	requestURL = ELASTIC_URL + INDEX + "/" + TYPE + "/"
	r = requests.post(requestURL, data=json.dumps(x), headers=HEADERS)

t1 = time.time()
total = t1-t0
minutes, seconds = divmod(total, 60)
print "Time to process is %d minutes and %d seconds." % (minutes,seconds)