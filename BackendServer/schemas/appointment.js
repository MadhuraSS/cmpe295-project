var mongoose    =   require("mongoose");

var appointmentSchema  = new mongoose.Schema({
	"patient_id": {type: String},
	"patient_name": {type: String},
	"doctor_id": {type: String},
	"doctor_name": {type: String},
	"purpose": {type: String},
	"status": {type: String},
	"date": {type: Date},
	"start_time": {type: Date},
	"end_time": {type: Date},
	"location": {type: String},
	"google_event_link": {type: String},
	"google_event_id": {type: String},
	"start_time_timestamp": {type: Number}
});

exports.Appointment = mongoose.model('Appointment', appointmentSchema);