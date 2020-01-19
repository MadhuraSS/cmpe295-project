'use strict';

var Messages 		= require('../messages');
var Alexa 			= require("alexa-sdk");
var Requests 		= require('../requests');
var Handlers 		= require('../handlers');
var SessionStates 	= require('./sessionStates');
var DateFormat 		= require("dateformat");

var APPOINTMENT_POST_URL = "https://remote-health-api.herokuapp.com/api/appointments";

var appointmentIntentHandler = function () {
	var doctor = this.event.request.intent.slots.Doctor.value;
	var location = this.event.request.intent.slots.Location.value;
	var reason = this.event.request.intent.slots.Reason.value;
	var starttime = this.event.request.intent.slots.StartTime.value;
	var endtime = this.event.request.intent.slots.EndTime.value;

	if(starttime != undefined && endtime != undefined){
		var temp = this.attributes['appointment_details'];
		temp['start_time'] = starttime;
		temp['end_time'] = endtime;
		this.attributes['appointment_details'] = temp;
		this.emit(':ask', Messages.APPT_DOCTOR + " " + Messages.APPT_DOCTOR_HELP, Messages.APPT_DOCTOR_HELP);
	}else if(doctor != undefined){
		var temp = this.attributes['appointment_details'];
		temp['doctor_name'] = "Doctor " + doctor;
		//hardcoded for now, need to get it from database
		temp['doctor_id'] ="jelsonsantos89@gmail.com";
		this.attributes['appointment_details'] = temp;
		this.emit(':ask', Messages.APPT_REASON + " " + Messages.APPT_REASON_HELP, Messages.APPT_REASON_HELP);
	}else if(reason != undefined){
		var temp = this.attributes['appointment_details'];
		temp['purpose'] = reason;
		this.attributes['appointment_details'] = temp;
		this.emit(':ask', Messages.APPT_LOCATION+ " " + Messages.APPT_LOCATION_HELP, Messages.APPT_LOCATION_HELP);
	}else if(location != undefined){
		var temp = this.attributes['appointment_details'];
		temp['location'] = location;
		this.attributes['appointment_details'] = temp;

		var data = temp;
		var outputSpeech = "You want to schedule an appointment on " + data['date'] + " from " + data['start_time'];
		outputSpeech += " to " + data['end_time'] +  " with " + data['doctor_name'] + " at " + data['location'];

		console.log("APPT DATA: " + JSON.stringify(data));
		this.emit(':ask', outputSpeech + ". " + Messages.APPT_YES, Messages.APPT_YES)
	}else{
		this.emit(":tell", Messages.ERROR);
	}
};

var yesIntentHandler = function () {
	postAppointment(APPOINTMENT_POST_URL, this.attributes['appointment_details'], this);
};

var noIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['appointment_details'] = {};
	this.emit(":tell", Messages.APPT_NO);
};

var unhandledIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['appointment_details'] = {};
	this.emit(':ask', Messages.ERROR, Messages.HELP);
};

function postAppointment(url, data, thisPointer){
	Requests.makePOSTRequest(url, data, function(err, res){
    	thisPointer.handler.state = SessionStates.states.REGULAR_SESSION;
    	thisPointer.attributes['appointment_details'] = {};
    	var d = JSON.parse(res);
    	if(d['message'] == "Appointment added!"){
    		thisPointer.emit(':ask', Messages.APPT_SUCCESS + " " + Messages.ASK, Messages.ASK);
    	}else{
    		thisPointer.emit(':ask', Messages.APPT_FAILED + " " + Messages.ASK, Messages.ASK);
    	}
	});
}

var cancelIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['appointment_details'] = {};
	this.emit(":tell", Messages.GOODBYE);
};

var stopIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['appointment_details'] = {};
	this.emit(":tell", Messages.GOODBYE);
};

var helpIntentHandler = function () {
	this.handler.state = SessionStates.states.REGULAR_SESSION;
	this.attributes['appointment_details'] = {};
	this.emit(':ask', Messages.HELP, Messages.HELP);
};

var appointmentHandlers = {};
appointmentHandlers['Unhandled'] = unhandledIntentHandler;
appointmentHandlers['AddAppointmentIntent'] = appointmentIntentHandler;
appointmentHandlers['AMAZON.CancelIntent'] = cancelIntentHandler;
appointmentHandlers['AMAZON.StopIntent'] = stopIntentHandler;
appointmentHandlers['AMAZON.HelpIntent'] = helpIntentHandler;
appointmentHandlers['AMAZON.NoIntent'] = noIntentHandler;
appointmentHandlers['AMAZON.YesIntent'] = yesIntentHandler;

var appointmentSessionHandlers = Alexa.CreateStateHandler(SessionStates.states.APPOINTMENT_SESSION, appointmentHandlers);

module.exports = {appointmentSessionHandlers};
