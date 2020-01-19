var mongoose    =   require("mongoose");

var diseaseSchema  = new mongoose.Schema({
	"name": {type: String},
	"description": {type: String},
	"symptoms": [{type: String}]
});

exports.Disease = mongoose.model('Disease', diseaseSchema);