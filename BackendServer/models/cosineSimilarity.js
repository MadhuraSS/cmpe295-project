var request 		= require("request");
var natural 		= require('natural');
var TF_IDF 			= natural.TfIdf;
var porterStemer 	= natural.PorterStemmer.attach();
var USERS_API_URL 	= "https://remote-health-api.herokuapp.com/api/users/";


exports.predictDiseaseBasedOnCosineSimilarity = function(email, results, callback){
	var url = USERS_API_URL + email;

	request(url, function(error, response, body) {
		if(error){
			return console.log('Error:', error);
		}
		if (response.statusCode == 200) {
			var user_info = JSON.parse(body);
			var history_doc = processMedicalRecord(user_info.medical_record);
			//console.log("HISTORY DOC: "+ history_doc);
			//Create a keyword dictionary from medical history
			var keywordsDict = tokenizeStem(history_doc);
			var history_vector = processDocTFIDF(keywordsDict, keywordsDict);

			var disease = getRecommendedDisease(keywordsDict, history_vector, results);

			//console.log(disease);
			callback(null, disease);
		}
   	});
}

function processMedicalRecord(medicalRecord){
	var ethnicity = medicalRecord.ethnicity;
	var gender = medicalRecord.gender;
	var family_history = medicalRecord.family_medical_history;
	var personal_history = medicalRecord.personal_medical_history;
	var appt_comments = medicalRecord.appointment_comments;
	var family_history_doc = createHistoryDocument(family_history);
	var personal_history_doc = createHistoryDocument(personal_history);
	var appt_diagnosis_doc = createAppointmentDiagnosisDocument(appt_comments);

	doc = ethnicity + " " + gender + " " + family_history_doc + " " + personal_history_doc + appt_diagnosis_doc;
	//console.log("DOC: " + doc);
	return doc;
}

function processDocTFIDF(words, doc) {
	var vector = [];
	for (var i = 0; i < words.length; i++) {
		var val = calculateTFIDF(words[i], doc)
		vector.push(val);
		//console.log("Ret val: " + val);
	}
	return vector;
}

function calculateTFIDF(term, tokenizeDoc){
	var tf_idf = new TF_IDF();
	tf_idf.addDocument(tokenizeDoc)
	var val = 0;
	tf_idf.tfidfs(term, function(i, measure) {
	    //console.log('IN CALCULATE: document #' + i + ' is ' + measure);
	    val = measure
	});
	return val;
}

function getRecommendedDisease(keywordsDict, historyVector, elasticResults){
	var disease = "";
	var description = "";
	var probability = 0;

	if(elasticResults.length > 0){
		disease = elasticResults[0]._source.disease;
		description = elasticResults[0]._source.description;
	}

	for(var i =0; i < elasticResults.length; i++){
		var num_of_symptoms = elasticResults[i]._source.symptoms.length;
		var symptoms_str = elasticResults[i]._source.symptoms.join(" ");
		var cur_disease = elasticResults[i]._source.disease;
		var cur_description = elasticResults[i]._source.description;
		var document_text = cur_disease + " " + symptoms_str + " " + cur_description;
		var stemTerms = tokenizeStem(document_text);

		var disease_tokenize = tokenizeStem(document_text);
		var disease_vector = processDocTFIDF(keywordsDict, disease_tokenize)
		//console.log(disease_vector);
		var cosine_similarity = calculateCosineSimilarity(historyVector, disease_vector);

		if(cosine_similarity > probability){
			probability = cosine_similarity;
			disease = cur_disease;
			description = cur_description;
		}
	}
	var outputDisease = {"disease" : disease, "description" : description};
	console.log("---------------------------------------------------------------------------------------");
	console.log("Predicted Disease History: " + disease);
	return outputDisease;
}

function createHistoryDocument(history){
	var doc = "";
	for(var key in history){
		if(history[key] == "yes"){
			doc = doc + " " + stringReplaceAll(key, "_", " ");
		}else if(key.startsWith("comments")){
			doc = doc + " " + stringReplaceAll(key, "_", " "); + history[key];
		}
	}
	//console.log("DOC: " + doc);
	return doc;
}

function createAppointmentDiagnosisDocument(comments){
	var doc = "";
	for(var i in comments){
		doc = doc + " " + comments[i];
	}
	//console.log("DOC Comments: " + doc);
	return doc;
}

function calculateCosineSimilarity(doc1Vector, doc2Vector) {
	var dot_product = calculateDotProduct(doc1Vector, doc2Vector);
	var doc1VectorMag = calculateVectorMagnitude(doc1Vector);
	var doc2VectorMag = calculateVectorMagnitude(doc2Vector);
	if(doc1VectorMag != 0 && doc2VectorMag != 0){
		return dot_product / (doc1VectorMag * doc2VectorMag);
	}
	return 0;
}

function calculateDotProduct(vector1, vector2) {
	//both vectors are the same size
	var dot_product = 0;
	for (var i = 0; i < vector1.length; i++) {
		dot_product += (vector1[i] * vector2[i]);
	}
	return dot_product;
}

function calculateVectorMagnitude(vector) {
	var temp = 0;
	for (var i = 0; i < vector.length; i++) {
		temp += Math.pow(vector[i], 2);
	}
	return Math.sqrt(temp);
}

function tokenizeStem(str){
	return str.tokenizeAndStem();
}

function stringReplaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
};

