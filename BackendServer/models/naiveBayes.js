const NUM_OF_SYMPTOMS = 2895;
const NUM_OF_DISEASES = 1174;
const LAPLACE_SMOTHING_ALPHA = 2;

exports.processResultNaiveBayes = function(results){
	var disease = "";
	var description = "";
	var probability = 0;
	for(var i =0; i < results.length; i++){
		var num_of_symptoms = results[i]._source.symptoms.length;
		var conditional_p = calculateProbabilitySymptomGivenDisease(1, num_of_symptoms, NUM_OF_SYMPTOMS);
		var p = calculateProbabilityDisease(results[i]._source.disease);
		var prob = p * conditional_p;
		if(prob > probability){
			probability = prob;
			disease = results[i]._source.disease;
			description = results[i]._source.description;
		}
		// console.log("PROBABILITY: " + prob);
		// console.log("DISEASE: " +  results[i]._source.disease);
	}
	// console.log("P " + probability);
	var outputDisease = {"disease" : disease, "description" : description};
	console.log("---------------------------------------------------------------------------------------");
	console.log("Predicted Disease Multinomial Naive Bayes: " + disease);
	return outputDisease;
}

function calculateProbabilitySymptomGivenDisease(diseaseFrequecy, numSymptoms, totalSymptoms ){
	// diseaseFrequecy: Frequency of same disease in the dataset
	// numSymptoms: Total symptoms of the particular disease
	// totalSymptoms: total symptoms in the dataset
	// alpha = LAPLACE_SMOTHING_ALPHA: known as Laplace Smoothing
	// P(symptom_i | Disease) = diseaseFrequecy + alpha
	//				   		   ___________________________________				
	//						   numSymptoms + alpha * totalSymptoms 
	//	
	var numerator = diseaseFrequecy + LAPLACE_SMOTHING_ALPHA;
	var denominator = numSymptoms + (LAPLACE_SMOTHING_ALPHA * totalSymptoms);
	return numerator/denominator;
}

function calculateProbabilityDisease(disease) {
	// Using Laplace Law of Succession
	// P(Disease) = N(Disease) + 1
	//				______________
	//					N + 2
	// N(Disease): number of times the disease appears in the dataset
	// N: total number of diseases
	var num_of_times_in_dataset = 1;
	var probability = (num_of_times_in_dataset + 1) / (NUM_OF_DISEASES + 2)
	return probability;
}
