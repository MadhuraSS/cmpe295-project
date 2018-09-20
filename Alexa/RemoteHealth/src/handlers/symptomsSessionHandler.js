'use strict';

var Messages 		= require('../messages');
var Alexa 			= require("alexa-sdk");
var Requests 		= require('../requests');
var Handlers 		= require('../handlers');
var SessionStates 	= require('./sessionStates');
var PREDICTION_URL 	= "https://remote-health-api.herokuapp.com/api/prediction?symptoms=";

var symptomIntentHandler = function () {
	var slotVal = this.event.request.intent.slots.Symptom.value;
	this.handler.state = SessionStates.states.SYMPTOMS_SESSION;
	console.log("SLOT_VALUE: " + slotVal);
	// var url = "https://remote-health-api.herokuapp.com/api/prediction?symptoms=dehydration,headache&email=jesantos0527@gmail.com";
	// Requests.makeRequest(url);
	if(slotVal == null){
		this.emit(':ask', Messages.ERROR, Messages.HELP);
	}else{
		console.log("SESSION_ATTRIBUTES: " + this.attributes['session_symptoms']);
		this.attributes['session_symptoms'].push(slotVal);
		var symptoms = this.attributes['session_symptoms'];
		var userEmail = this.attributes['user_email'];
		if(symptoms.length < 2){
			this.emit(':ask', Messages.SYMPTOM_ASK, Messages.HELP);
		}else{
			getPrediction(userEmail, symptoms, this);
		}		
	}
};

var yesIntentHandler = function () {
	this.handler.state = SessionStates.states.SYMPTOMS_SESSION;
	this.emit(':ask', Messages.SYMPTOM_YES + " " + Messages.SAMPLE_UTTERANCE, Messages.HELP);
};

var noIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['session_symptoms'] = [];
	this.emit(":tell", Messages.GOODBYE);
};

var unhandledIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['session_symptoms'] = [];
	this.emit(':ask', Messages.ERROR, Messages.HELP);
};

function getPrediction(email, symptoms, thisPointer){
	//var url = "https://remote-health-api.herokuapp.com/api/prediction?symptoms=dehydration,headache&email=jesantos0527@gmail.com";
	var url = PREDICTION_URL + symptoms.toString()+"&email=" +email;
	console.log("PREDICTION URL: " + url);
	Requests.makeGETRequest(url, function(res){
		//console.log("PREDICTION RES: " + res);
		//console.log("PREDICTION RES Disease: " + res.disease);
		var resObj = JSON.parse(res);
		var output = "Our recommendation system predicts that you may have " + resObj.disease + ". " + resObj.description;
    	thisPointer.handler.state = SessionStates.states.REGULAR_SESSION;
		thisPointer.attributes['session_symptoms'] = [];
    	thisPointer.emit(':ask', output + " " + Messages.ASK, Messages.ASK);
	});
}

var cancelIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['session_symptoms'] = [];
	this.emit(":tell", Messages.GOODBYE);
};

var stopIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['session_symptoms'] = [];
	this.emit(":tell", Messages.GOODBYE);
};

var helpIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['session_symptoms'] = [];
	this.emit(':ask', Messages.HELP, Messages.HELP);
};

var symptomHandlers = {};
symptomHandlers['Unhandled'] 			= unhandledIntentHandler;
symptomHandlers['SymptomIntent'] 		= symptomIntentHandler;
symptomHandlers['AMAZON.CancelIntent'] 	= cancelIntentHandler;
symptomHandlers['AMAZON.StopIntent'] 	= stopIntentHandler;
symptomHandlers['AMAZON.HelpIntent'] 	= helpIntentHandler;
symptomHandlers['AMAZON.NoIntent'] 		= noIntentHandler;
symptomHandlers['AMAZON.YesIntent'] 	= yesIntentHandler;

var symptomSessionHandlers = Alexa.CreateStateHandler(SessionStates.states.SYMPTOMS_SESSION, symptomHandlers);

module.exports = {symptomSessionHandlers};
