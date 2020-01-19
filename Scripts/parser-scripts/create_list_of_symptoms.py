import json
import time

t0 = time.time()

with open('../data/diseases_symptoms.json', 'r') as f:
     data = json.load(f)

symptoms_set = set()
for x in data["diseases"]:
	disease_name = str(x["disease"].encode('utf-8'))
	print "Processing disease: %s" % disease_name
	symptoms = x["symptoms"]
	#print symptoms
	for s in symptoms:
		sym = str(s.encode('utf-8'))
		symptoms_set.add(sym)

with open('../data/list_symptoms.txt', 'w') as file:
     for symptom in list(symptoms_set):
     	file.write(symptom + "\n")

t1 = time.time()
total = t1-t0
minutes, seconds = divmod(total, 60)
print "The total number of symptoms is: %d." % len(list(symptoms_set))
print "Time to process is %d minutes and %d seconds." % (minutes,seconds)