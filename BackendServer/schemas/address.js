var mongoose    =   require("mongoose");

var addressSchema  = new mongoose.Schema({
	"street": {type: String},
	"city": {type: String},
	"state": {type: String},
	"zip": {type: Number},
	"county": {type: String},
	"country": {type: String},
});

exports.Address = mongoose.model('Address', addressSchema);