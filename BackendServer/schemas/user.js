var mongoose    =   require("mongoose");
var apptSchema = require('./appointment');
var Appointment = apptSchema.Appointment;
var addressSchema = require('./address');
var Address = addressSchema.Address;
var googleTokenSchema = require('../schemas/googleToken');
var GoogleToken = googleTokenSchema.GoogleToken;
var familyMedicalHistorySchema = require('./familyMedicalHistory');
var FamilyMedicalHistory = familyMedicalHistorySchema.FamilyMedicalHistory;
var personalMedicalHistorySchema = require('./personalMedicalHistory');
var PersonalMedicalHistory = personalMedicalHistorySchema.PersonalMedicalHistory;

var userSchema  = new mongoose.Schema({
    "_id" : {type: String},
    "password" : {type: String},
    "name": {
    	"first_name": {type: String},
    	"last_name": {type: String},
    },
    "address": {type: mongoose.Schema.Types, ref: 'Address'},
    "phone_number": {type: String, validate: {validator: function(v) {return /\d{3}-\d{3}-\d{4}/.test(v);},message: '{VALUE} is not a valid phone number!'}},
    "user_type": {type: String},
    "doctor_id": {type: String},
    "medical_record":{
        "ethnicity": {type: String},
        "gender": {type: String},
        "age": {type: Number},
    	"family_medical_history": {type: mongoose.Schema.Types, ref: 'FamilyMedicalHistory'},
        "personal_medical_history": {type: mongoose.Schema.Types, ref: 'personalMedicalHistory'},
        "appointment_comments": [{type: String}]
    },
    "google_calendar_token": {type: mongoose.Schema.Types, ref: 'GoogleToken'}
});

exports.User = mongoose.model('User', userSchema);
