var mongoose    =   require("mongoose");

var personalMedicalHistorySchema  = new mongoose.Schema({
	"alcoholism": {type: String},
	"anemia": {type: String},
	"asthma": {type: String},
	"concussion": {type: String},
	"eating_disorder": {type: String},
	"heart_disease": {type: String},
	"high_cholesterol": {type: String},
	"kidney_or_bladder_problems": {type: String},
	"loss_of_consciousness": {type: String},
	"overweight_or_obesity": {type: String},
	"seizures_or_convulsions": {type: String},
	"stroke": {type: String},
	"surgery": {type: String},
	"thyroid_problems": {type: String},
	"allergies": {type: String},
	"anxiety_or_panic_attack": {type: String},
	"cancer_or_tumor": {type: String},
	"diabetes": {type: String},
	"headaches_severe": {type: String},
	"high_blood_pressure": {type: String},
	"hospitalization": {type: String},
	"liver_disease_or_hepatitis": {type: String},
	"mononucleosis": {type: String},
	"psychiatric_problems": {type: String},
	"stomach_or_intestinal_problems": {type: String},
	"substance_abuse": {type: String},
	"thrombophlebitis_or_blood_clots)": {type: String},
	"tuberculosis_or_positive_TB_skin_test": {type: String},
	"smoke": {type: String},
	"drink_alcohol": {type: String},
	"cut_down_drinking_alcohol": {type: String},
	"drugs": {type: String},
	"sleep_problems": {type: String},
	"sad_or_depressed": {type: String},
	"regular_physical_exercise": {type: String},
	"sexually_active": {type: String},
	"safe_sex": {type: String},
	"chlamydia": {type: String},
	"gonorrhea": {type: String},
	"herpes": {type: String},
	"genital_warts": {type: String},
	"syphilis": {type: String},
	"trichomonas": {type: String},
	"other": {type: String},
	"comments": {type: String},
	"comments_breast_problems": {type: String}
});

exports.PersonalMedicalHistory = mongoose.model('PersonalMedicalHistory', personalMedicalHistorySchema);



//Alcoholism
//Anemia
//Asthma
//Concussion
//Eating Disorder
//Heart Disease
//High Cholesterol
//Kidney or Bladder Problems
//Loss of Consciousness
//Overweight or Obesity	
//Seizures or Convulsions
//Stroke
//Surgery
//Thyroid Problems


//Allergies
//Anxiety or Panic Attack
//Cancer or Tumor
//Diabetes
//Headaches (severe)
//High Blood Pressure
//Hospitalization
//Liver Disease or Hepatitis
//Mononucleosis
//Psychiatric Problems
//Stomach or Intestinal Problems
//Substance Abuse
//Thrombophlebitis or DVT (blood clots)
//Tuberculosis or positive TB skin test


//Do you smoke?
//Do you drink alcohol?
//Have you ever felt you should cut down on drinking alcohol?
//Do you use drugs?
//Do you have any sleep problems? 
//Are you often sad or depressed?
//Do you get regular physical exercise?
//Are you sexually active?
//Do you practice safe sex? 
//Have you had any of the of the following?
//		Chlamydia	Gonorrhea	Herpes
//		Genital Warts	Syphilis	Trichomonas


//Other
//Comments (If yes, give dates and details)

////FOR WOMEN ONLY
//Have you had a history of breast problems (lumps, nipple discharge, cancer) or surgery (including implants, biopsy)?


