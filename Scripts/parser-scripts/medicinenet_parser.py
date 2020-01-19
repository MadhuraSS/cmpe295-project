import csv
import urllib2
from bs4 import BeautifulSoup
import re
import json
import time


t0 = time.time()
diseases_dict = {}

#html page name is the disease and the symptom
def getSymptomsFileTypeOne(htmlElements, diseaseName):
	symptoms = []
	for divHtmlElem in htmlElements:
		check_title = divHtmlElem.previous_sibling.previous_sibling.get_text()
		for li_tag in divHtmlElem.findAll("li"):
			text = li_tag.get_text()
			#print "Text is " + text
			clean_text = str(text.encode('utf-8')).replace("\n","").lower()
			clean_text = clean_text.replace('\r', '')
			symptoms.append(clean_text)
			#print clean_text
		#only the first div tags contain the symptoms
		break
	return symptoms

#html page name is the disease only
def getSymptomsFileTypeTwo():
	return 1

def createJsonFile(outputObj):
	with open("diseases_symptoms_medicinet.json", "w") as outfile:
		json.dump(outputObj, outfile)

f = open('../data/medicinet_urls.csv')
csv_f = csv.reader(f)

url = ""
disease_name = ""
html = ""

counter = 0
diseases = {}
diseases['diseases'] = []

for row in csv_f:
	if("_symptoms_and_signs" in row[0]):
		print "Disease Name: " + row[1]
		print "...Request URL: "+ row[0]
		disease_name = row[1]
		response = urllib2.urlopen(row[0])
		html = response.read()
		soup = BeautifulSoup(html, 'html.parser')
		divTags = soup.findAll("div", { "class" : "Tab_Items" })
		symptoms = getSymptomsFileTypeOne(divTags, disease_name)
		disease_name = row[1].replace(" Symptoms and Signs", "").lower()
		#print symptoms
		diseases_dict[disease_name] = symptoms
		jsonObject = {
			'symptoms': symptoms,
			'disease' : disease_name
		}
		diseases['diseases'].append(jsonObject)
		counter = counter + 1

createJsonFile(diseases)
DISEASES_COUNT = len(diseases['diseases'])
print "The total number of diseases are: " + str(DISEASES_COUNT)
t1 = time.time()
total = t1-t0
minutes, seconds = divmod(total, 60)
print "Time to process is %d minutes and %d seconds." % (minutes,seconds)
