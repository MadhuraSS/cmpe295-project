import json
import time

t0 = time.time()
DISEASES_DICT = {}
DISEASES_DESCRIPTION_DICT = {}

def processJson(jsonData):
	for x in jsonData["diseases"]:
		disease_name = str(x["disease"].encode('utf-8'))
		symptoms = x["symptoms"]
		description = x["description"]
		disease_set = set()
		for s in symptoms:
			sym = str(s.encode('utf-8'))
			disease_set.add(sym)
		if disease_name in DISEASES_DICT:
			DISEASES_DICT[disease_name] = DISEASES_DICT[disease_name].union(disease_set)
		else:
			DISEASES_DICT[disease_name] = disease_set
		DISEASES_DESCRIPTION_DICT[disease_name] = description
	return

def createJsonFile(outputObj):
	with open("../data/diseases_symptoms_new.json", "w") as outfile:
		json.dump(outputObj, outfile)
	return

def processDictAndCreateFile():
	diseasesOutput = {}
	diseasesOutput['diseases'] = []
	for key in DISEASES_DICT.keys():
		jsonObject = {
			'symptoms' : list(DISEASES_DICT[key]),
			'disease' : key,
			'description' : DISEASES_DESCRIPTION_DICT[key]
		}
		diseasesOutput['diseases'].append(jsonObject)
	createJsonFile(diseasesOutput)
	return

with open('../data/diseases_symptoms_medicinenet_new.json', 'r') as f:
     data_medicinenet = json.load(f)
with open('../data/diseases_symptoms_aarp_new.json', 'r') as f:
     data_aarp = json.load(f)

processJson(data_aarp)
processJson(data_medicinenet)

processDictAndCreateFile()
DISEASES_COUNT = len(DISEASES_DICT)
print "The total number of diseases are: " + str(DISEASES_COUNT)
t1 = time.time()
total = t1-t0
minutes, seconds = divmod(total, 60)
print "Time to process is %d minutes and %d seconds." % (minutes,seconds)