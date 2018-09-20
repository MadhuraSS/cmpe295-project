import csv
import urllib2
from bs4 import BeautifulSoup
import re
import json
import time
from types import NoneType


t0 = time.time()
diseases_dict = {}

#html page name is the disease and the symptom
def getSymptomsFileTypeSymptoms(htmlElements, diseaseName):
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


def getSymptomsFileTypeOneData(htmlElements):
	h4TagSiblingText = ""
	h4TagSibling = None
	for divHtmlElem in htmlElements:
		divTag = divHtmlElem.find("div", { "itemtype" : "http://schema.org/WebPage" })
		check_tag = divHtmlElem.find("div", { "class" : "aia_rdr" })
		if(type(check_tag) is not NoneType):
			text = check_tag.next_sibling.next_sibling.get_text()
			h4TagSibling = divHtmlElem.findAll("h4")[1].next_sibling.next_sibling
		else:
			text = divTag.next_sibling.get_text()
			h4Tag = divHtmlElem.find("h4")
			if(type(h4Tag) is not NoneType):
				h4TagSibling = h4Tag.next_sibling.next_sibling

		if((type(h4TagSibling) is not NoneType)):
			h4TagSiblingText = h4TagSibling.get_text()

		description = str(text.encode('utf-8')).replace("\n","")#.lower()
		description = description.replace('\r', '')
		#print "Description is " + description
		causes = str(h4TagSiblingText.encode('utf-8')).replace("\n","")
		causes = causes.replace('\r', '')
		#print "Causes are " + causes
		break
	return description, causes

#html page name is the disease only
def getSymptomsFileTypeTwo():
	return 1

def createJsonFile(outputObj):
	with open("../data/diseases_symptoms_medicinet_new.json", "w") as outfile:
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
		divTagsApPage = soup.findAll("div", { "class" : "apPage" })
		symptoms = getSymptomsFileTypeSymptoms(divTags, disease_name)
		description, causes = getSymptomsFileTypeOneData(divTagsApPage)
		disease_name = row[1].replace(" Symptoms and Signs", "").lower()
		#print symptoms
		diseases_dict[disease_name] = symptoms
		jsonObject = {
			'symptoms' : symptoms,
			'disease' : disease_name,
			'description': description,
			'causes' : causes
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
