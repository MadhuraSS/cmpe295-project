'use strict';

var Alexa 						= require("alexa-sdk");
var Messages 					= require('./messages');
var Handlers 					= require('./handlers');
var SymptomSessionHandlers 		= require('./handlers/symptomsSessionHandler');
var AppointmentSessionHandlers 	= require('./handlers/appointmentSessionHandler');
var APP_ID 						= "amzn1.ask.skill.6cf7d5fd-a5b5-4ff7-bbbd-0d4d6c7a8005";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(Handlers.handlersNoSession, Handlers.regularSessionHandlers, SymptomSessionHandlers.symptomSessionHandlers, 
    	AppointmentSessionHandlers.appointmentSessionHandlers);
    alexa.execute();
};
