var usersModel 				= 	require('./users');
var appointmentsModel   	=   require("./appointments");
var google 					= 	require('googleapis');
var calendar 				= 	google.calendar('v3');
var OAUTH2            		=   google.auth.OAuth2;

const GOOBLE_CLIENT_ID      =   "310398537432-4ctsbrma6krd85bsgdvbv6h4vttbt9hs.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET  =   "A8s3j6VY8zuQ1atA5-VwgEcL";
//const AUTH_REDIRECTION_URL  =   "http://localhost:5000/authenticate/oauthCallback";
const AUTH_REDIRECTION_URL  =   "https://remote-health-api.herokuapp.com/authenticate/oauthCallback";

function getOAuthClient () {
    return new OAUTH2(GOOBLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_REDIRECTION_URL);
}

exports.getAuthUrl = function(req, callback){
	var oauth2Client = getOAuthClient();
	//console.log("OAUTH: " + oauth2Client);
	var scopes = [
    	'https://www.googleapis.com/auth/userinfo.email',
       	'https://www.googleapis.com/auth/plus.me',
      	'https://www.googleapis.com/auth/calendar'
    ];
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    //console.log("Generated URL: " + url);
    callback(url, null);
}

exports.handleGoogleOauthCallback = function(req, callback){
    var oauth2Client = getOAuthClient();
    var code = req.query.code;
    //console.log("OauthCallback Code: " + code);
    var userProfile;

    oauth2Client.getToken(code, function(err, tokens) {
        //console.log("OAuth Tokens: " + tokens);
        if(!err) {
            oauth2Client.setCredentials(tokens);
            var userGoogleProfile;
            var plus = google.plus('v1');
            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, function (err, response) {
                userGoogleProfile = response;    
                var emailID = userGoogleProfile.emails[0].value;
                var query = {"_id" : emailID};
                //var conditions = {'google_calendar_token' : tokens};

                var responseJson = {
                    "email_id" : emailID,
                    "google_calendar_token" : tokens
                };
                //console.log(tokens);
                usersModel.getUser(query,function(err,user){
                    if (err){
                        callback(err, null)
                    }else if(user == undefined || user == null){
                        callback(null, responseJson);
                    }
                    else{
                        callback(new Error("User already exists."), null);
                    }
                });
                //callback(null, responseJson);
                //updateUserCalendarToken(query, conditions, callback)
            });
        }else{
            callback(err,null);
        }
    });
}

function updateUserCalendarToken(query, conditions, callback){
	usersModel.updateUser(query,conditions,function(err,user){
        if (err){
            callback(err,user)
        }
        else if(user == undefined || user == null  ){
            callback(true, null)
        }
        else{
            callback(null, user);
        }
    });
}

exports.approveAppointment = function(query, callback){
	var query_user = {
		"_id" :  query["patient_id"]
	}
	usersModel.getUser(query_user,function(err,user){
        if (err){
            callback(err, user);
        }else if(user == undefined || user == null || user == []){
            callback(true, null);
        }else{
            //console.log(user["google_calendar_token"]);
            var tokens = user["google_calendar_token"];
            appointmentsModel.getAppointment(query, function(err,appointment){
            	//console.log(appointment);
	            if (err){
	                callback(err, appointment);
	            }else if(appointment == undefined || appointment == null || appointment == []){
	                callback(true, null);
	            }else{
	                addEventToGoogleCalendar(appointment, tokens, callback);
	            }
	        });
        }
    });
}

exports.cancelAppointment = function(query, callback){
    appointmentsModel.getAppointment(query, function(err,appointment){
        if (err){
            callback(err);
        }else if(appointment == undefined || appointment == null || appointment == []){
            callback(true);
        }else{
            if(appointment["status"] == "pending"){
                //console.log("Pending appt only");
                appointmentsModel.deleteAppointment(query, function(err){
                    callback(err);
                }); 
            }else{
                var query_user = {
                    "_id" :  appointment["patient_id"]
                };
                usersModel.getUser(query_user,function(err,user){
                    if (err){
                        callback(err);
                    }else if(user == undefined || user == null || user == []){
                        callback(true);
                    }else{
                        var tokens = user["google_calendar_token"];
                        //console.log("deleteEventFromGoogleCalendar()");
                        deleteEventFromGoogleCalendar(appointment, tokens, callback);
                    }
                });
            }
        }
    });
}

function buildEventObject(appointment){
	var event = {
		'summary': 'Doctor '+ appointment["doctor_name"] +' Visit',
		'location': appointment["location"],
		'description': appointment["purpose"],
		'start': {
			'dateTime': appointment["start_time"],
			'timeZone': 'America/Los_Angeles',
		},
		'end': {
			'dateTime': appointment["end_time"],
			'timeZone': 'America/Los_Angeles',
		},
		'recurrence': [
			'RRULE:FREQ=DAILY;COUNT=2'
		],
		'attendees': [
			{'email': appointment["patient_id"]},
            {'email': appointment["doctor_id"]}
		],
		'reminders': {
			'useDefault': false,
			'overrides': [
				{'method': 'email', 'minutes': 24 * 60},
				{'method': 'popup', 'minutes': 10},
			],
		},
	};

	return event;
}

function addEventToGoogleCalendar(appointment, tokens, callback){
	var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(tokens);
	var event = buildEventObject(appointment);

	calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        resource: event,
    }, function(err, event) {
    	if (err) {
            callback(err,null);
        }
        //console.log(event);
        //console.log('Event created: %s', event.htmlLink);
        var id_query = {
        	"_id" : appointment["_id"]
        }
        var update_query = {
        	"status" : "approved",
        	"google_event_link" : event.htmlLink,
            "google_event_id" : event.id
        }
        appointmentsModel.updateAppointment(id_query, update_query, function(err,appointment){
            if (err){
                callback(err,null);
            }else if(appointment == undefined || appointment == null  ){
                callback(new Error("Appointment not found"),null );
            }else{
                callback(err, appointment);
            }
        });
    });
}

function deleteEventFromGoogleCalendar(appointment, tokens, callback){
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(tokens);

    calendar.events.delete({
        auth: oauth2Client,
        calendarId: 'primary',
        eventId: appointment["google_event_id"]
    }, function(err, event) {
        if (err) {
            callback(err,null);
        }
        var id_query = {
            "_id" : appointment["_id"]
        }
        appointmentsModel.deleteAppointment(id_query, function(err){
            callback(err);
        });
    });
}


///////////////////////////////////////
/// Temp to Update Google Token
///////////////////////////////////////
//const AUTH_TEMP_URL = "http://localhost:5000/api/authenticate/oauthCallback";
const AUTH_TEMP_URL = "https://remote-health-api.herokuapp.com/api/authenticate/oauthCallback";

function getOAuthClient2 () {
    return new OAUTH2(GOOBLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_TEMP_URL);
}

exports.handleOauthCallback = function(req, callback){
    var oauth2Client = getOAuthClient2();
    var code = req.query.code;
    //console.log("OauthCallback Code: " + code);
    var userProfile;

    oauth2Client.getToken(code, function(err, tokens) {
        //console.log("OAuth Tokens: " + tokens);
        if(!err) {
            oauth2Client.setCredentials(tokens);
            var userGoogleProfile;
            var plus = google.plus('v1');
            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, function (err, response) {
                userGoogleProfile = response;    
                var emailID = userGoogleProfile.emails[0].value;
                var query = {"_id" : emailID};
                var conditions = {'google_calendar_token' : tokens};
                // usersModel.getUser(query,function(err,user){
                //     if (err){
                //         callback(err, null)
                //     }else if(user == undefined || user == null){
                //         callback(null, user)
                //     }
                //     else{
                //         callback(new Error("User already exists."), null);
                //     }
                // });
                updateUserCalendarToken(query, conditions, callback)
            });
        }else{
            callback(err,null);
        }
    });
}

exports.getAuthUrl2 = function(req, callback){
    var oauth2Client = getOAuthClient2();
    //console.log("OAUTH: " + oauth2Client);
    var scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/calendar'
    ];
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    //console.log("Generated URL: " + url);
    callback(url, null);
}