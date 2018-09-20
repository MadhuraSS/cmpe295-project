'use strict';
var Messages 		= require('./messages');
var Alexa 			= require("alexa-sdk");
var request 		= require("request");
var Requests 		= require('./requests');
var SessionStates 	= require('./handlers/sessionStates');
var GOOGLE_USER_INFO= "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=";

////////////////////////////////////////////////////////////////////////
//// REGULAR SESSION
////////////////////////////////////////////////////////////////////////

var launchRequestHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	console.log("LAUNCH_REQUEST");
	var accessToken = this.event.session.user.accessToken;
	console.log("ACCESS_TOKEN: "+ accessToken);
	var url = GOOGLE_USER_INFO + accessToken;
 	var thisSession = this;
 	if(accessToken === null || accessToken === undefined) { 
       	this.emit(':tellWithLinkAccountCard', Messages.LINK_ACCOUNT);
    } else { 
   	    request(url, function(error, response, body) {
			if(error){
				return console.log('Error:', error);
			}
			if (response.statusCode == 200) {
				console.log("body=", body);
				var profile = JSON.parse(body);
				//speechOutput += 'Hello ' + profile.name.split(" ")[0];
				//thisSession.event.session.user['userEmail'] = profile.email;
				thisSession.attributes['user_email'] = profile.email;
				thisSession.attributes['session_symptoms'] = [];
			    var speechOutput = Messages.WELCOME + " " + Messages.HELP;
			    var repromptSpeech =  Messages.HELP;
			    thisSession.emit(':ask', speechOutput, repromptSpeech);
			} else {
				//speechOutput += 'I was unable to get your profile info from Amazon.';
				thisSession.emit(":tell", Messages.ERROR);
			}
	   	});
    }
};

var symptomIntentHandler = function () {
	var slotVal = this.event.request.intent.slots.Symptom.value;
	this.handler.state = SessionStates.states.SYMPTOMS_SESSION;
	console.log("SLOT_VALUE: " + slotVal);
	//var url = "https://remote-health-api.herokuapp.com/api/prediction?symptoms=dehydration,headache&email=jesantos0527@gmail.com";
	if(slotVal == null){
		this.emit(':ask', Messages.ERROR, Messages.HELP);
	}else{
		console.log("SESSION_ATTRIBUTES: " + this.attributes['session_symptoms']);
		this.attributes['session_symptoms'].push(slotVal);
		console.log("SLOT_VALUE_REGULAR_SESSION: " + slotVal);
	    this.emit(':ask', Messages.SYMPTOM_ASK, Messages.HELP);
	}
};

var addAppointmentIntentHandler = function () {
	var initialData = {
		"patient_id": this.attributes['user_email'],
		"status": "pending",
		"date": this.event.request.intent.slots.Date.value
	};
	this.attributes['appointment_details'] = initialData;
	this.handler.state = SessionStates.states.APPOINTMENT_SESSION;
	this.emit(':ask', Messages.APPT_TIME + " " + Messages.APPT_TIME_HELP, Messages.APPT_TIME_HELP);
};

var cancelIntentHandler = function () {
	this.attributes['session_symptoms'] = [];
	this.emit(":tell", Messages.GOODBYE);
};

var stopIntentHandler = function () {
	this.attributes['session_symptoms'] = [];
	this.emit(":tell", Messages.GOODBYE);
};

var helpIntentHandler = function () {
	this.emit(':ask', Messages.HELP, Messages.HELP);
};

var yesIntentHandler = function () {
	this.emit(':ask', Messages.HELP, Messages.HELP);
};

var noIntentHandler = function () {
	//this.attributes['session_symptoms'] = []
	this.emit(":tell", Messages.GOODBYE);
};

var unhandledIntentHandler = function () {
	this.emit(':ask', Messages.ERROR, Messages.HELP);
};


var handlers = {};
handlers['Unhandled'] 			= unhandledIntentHandler;
handlers['LaunchRequest'] 		= launchRequestHandler;
handlers['SymptomIntent'] 		= symptomIntentHandler;
handlers['AddAppointmentIntent']= addAppointmentIntentHandler;
handlers['AMAZON.CancelIntent'] = cancelIntentHandler;
handlers['AMAZON.StopIntent'] 	= stopIntentHandler;
handlers['AMAZON.HelpIntent'] 	= helpIntentHandler;
handlers['AMAZON.NoIntent'] 	= noIntentHandler;
handlers['AMAZON.YesIntent'] 	= yesIntentHandler;

var regularSessionHandlers = Alexa.CreateStateHandler(SessionStates.states.REGULAR_SESSION, handlers);

var handlersNoSession = {};
handlersNoSession['Unhandled'] = unhandledIntentHandler;
handlersNoSession['LaunchRequest'] = launchRequestHandler;

module.exports = {handlersNoSession, regularSessionHandlers};

