var mongoose    =   require("mongoose");

var familyMedicalHistorySchema  = new mongoose.Schema({
	"alcoholism": {type: String},
	"cancer": {type: String},
	"epilepsy_seizures": {type: String},
	"high_blood_pressure": {type: String},
	"migraine_headaches": {type: String},
	"stroke": {type: String},
	"psychiatric_problems": {type: String},
	"bleeding_problems": {type: String},
	"diabetes_high_blood_sugar)": {type: String},
	"heart_disease": {type: String},
	"high_cholesterol": {type: String},
	"sickle_cell_disease": {type: String},
	"thyroid_disease": {type: String},
	"tuberculosis": {type: String},
	"arthritis": {type: String},
	"nervous_breakdown": {type: String},
	"other": {type: String},
	"comments": {type: String}
});

exports.FamilyMedicalHistory = mongoose.model('FamilyMedicalHistory', familyMedicalHistorySchema);
