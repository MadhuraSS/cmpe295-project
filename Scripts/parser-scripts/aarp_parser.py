import csv
import urllib2
from bs4 import BeautifulSoup
import re
import json
import string
import time


t0 = time.time()
AARP_URL = "http://healthtools.aarp.org/symptomsearch?alpha="
AARP_URL_TERM = "http://healthtools.aarp.org/symptomsearch?addterm="
DISEASES_DICT = {}
SYMPTOMS_COUNT = 0
DISEASES_COUNT = 0


def createJsonFile(outputObj):
	with open("diseases_symptoms_aarp.json", "w") as outfile:
		#json.dump(jsonObject, outfile, indent=4)
		json.dump(outputObj, outfile)

def makeRequest(url, tagName, attributeName, attributeValue):
	response = urllib2.urlopen(url)
	html = response.read()
	soup = BeautifulSoup(html, 'html.parser')
	#print soup
	tagContainer = soup.findAll(tagName, { attributeName : attributeValue })
	return tagContainer

def getPagination(url):
	paginationContainer = makeRequest(url, "span", "class", "numberscontainer")
	#print paginationContainer
	#print "size is " + str(len(paginationContainer))
	num_of_pages = ["1"]
	if(len(paginationContainer) > 0):
		for span in paginationContainer:
			for num in span.findAll("a"):
				#print "Pagination num: " + num.get_text()
				num_of_pages.append(str(num.get_text().encode('utf-8')))
			break
	#print num_of_pages
	return num_of_pages

def processDiseases(tableContainer):
	if(len(tableContainer) == 0):
		return
	for child in tableContainer[0].children:
		childStr = str(child).replace("\n","")
		if(len(childStr) != 0):
			soupObj = BeautifulSoup(childStr, 'html.parser')
			diseaseName = soupObj.find("span", {"class" : "articletitle"}).get_text().encode('utf-8')
			diseaseName =  str(diseaseName).lower()
			symptomsList = soupObj.findAll("ul", {"class" : "div-margin-t-xsmall"})
			symptoms_set = set()
			for sym in symptomsList[0].findAll("li"):
				symp = str(sym.get_text().encode('utf-8')).lower()
				symptoms_set.add(symp)
			if diseaseName in DISEASES_DICT:
				DISEASES_DICT[diseaseName] = DISEASES_DICT[diseaseName].union(symptoms_set)
			else:
				DISEASES_DICT[diseaseName] = symptoms_set
	#print DISEASES_DICT
	return

def processDictAndCreateFile():
	diseasesOutput = {}
	diseasesOutput['diseases'] = []
	for key in DISEASES_DICT.keys():
		jsonObject = {
			'symptoms': list(DISEASES_DICT[key]),
			'disease' : key
		}
		diseasesOutput['diseases'].append(jsonObject)
	createJsonFile(diseasesOutput)
	return


alphabets=list(string.ascii_lowercase)
for letter in alphabets:
	print "Processing letter: " + letter.upper() 
	url = AARP_URL + letter.upper()
	#print url
	num_of_pages = getPagination(url)
	#numSymptoms = 0
	list_of_symptoms = []
	for page_num in num_of_pages:
		url_page = url + "&pagenum=" +  page_num
		linksContainer = makeRequest(url_page, "div", "class", "commonlinks-font-13")
		for symptomsContainer in linksContainer:
			symptomsArr = symptomsContainer.findAll("a", {"style": ""})
			#print len(symptomsArr)
			for symptom in symptomsArr:
				#numSymptoms = numSymptoms + 1
				list_of_symptoms.append(str(symptom.get_text().encode('utf-8')))

	count = 0
	for symptom in list_of_symptoms:
		#print "Symptom: " + symptom
		termUrl = AARP_URL_TERM + symptom
		#print "URL: " + termUrl
		numOfPages = getPagination(termUrl)
		#print numOfPages
		print "--Symptom - " + symptom

		for pageNum in numOfPages:
			reqUrl = AARP_URL_TERM + urllib2.quote(symptom) + "&pagenum=" + pageNum
			print "....page number " +  pageNum
			tableContent = makeRequest(reqUrl, "table", "id", "resulttable")
			processDiseases(tableContent)
		#break
	#break

processDictAndCreateFile()
DISEASES_COUNT = len(DISEASES_DICT)
print "The total number of diseases are: " + str(DISEASES_COUNT)
t1 = time.time()
total = t1-t0
minutes, seconds = divmod(total, 60)
#print str(total) + " seconds to process."
print "Time to process is %d minutes and %d seconds." % (minutes,seconds)

