var request 				= require("request");
var elasticsearch 			= require("elasticsearch");
var naiveBayesModel 		= require('./naiveBayes.js');
var cosineSimilarityModel 	= require('./cosineSimilarity.js');
var ELASTICSEARCH_HOSTNAME 	= "https://search-diseases-symptoms-pyhhcjkict7d5ksiazurzo4m2a.us-west-2.es.amazonaws.com";
var ELASTICSEARCH_API 		= "/diseases/api/_search";


exports.predictDisease = function (req, callback){
	var email = req.query.email;
	var symptomsStr = req.query.symptoms;
	var symptoms = symptomsStr.split(",");
	makePrediction(email, symptoms, symptomsStr ,callback);
}

function makePrediction(email, symptoms, inputStr, callback){
	var query = buildQueryParameter(symptoms);
	//console.log("-- Request Query: " + JSON.stringify(query, undefined, 2));
	console.log("Request Query: " + JSON.stringify(query));
	makeElasticSearchRequest(email, query, inputStr, callback);
	return;
}

function makeElasticSearchRequest(email, query, inputStr, callback){
	var client = new elasticsearch.Client({
		host: ELASTICSEARCH_HOSTNAME,
	 	log: 'error'
	}); 
	var headers = {
	    'Content-Type': 'application/json'
	};
	var url = ELASTICSEARCH_HOSTNAME + ELASTICSEARCH_API;
	var options = {
	    url: url,
	    headers: headers,
	    method: 'GET',
	    data: query
	};

	client.search({
		index: 'diseases',
		type: 'api',
		body: query
	}).then(function (res) {
		var hits = res.hits.hits;
		cosineSimilarityModel.predictDiseaseBasedOnCosineSimilarity(email, hits, callback);
	}, function (err) {
		console.error(err.message);
	});
}

function buildQueryParameter(symptoms){
	var match_phrases_array = [];
	for(var i=0; i < symptoms.length; i++){
		var phrase = {};
		phrase["match"] = {"symptoms" : symptoms[i]};
		match_phrases_array.push(phrase);
	}
	var query = {
		"size" : 2000,
		"query" : {
			"bool" : {
				"should" : match_phrases_array,
				"minimum_should_match" : match_phrases_array.length
			}
		}
	};
	return query;
}


