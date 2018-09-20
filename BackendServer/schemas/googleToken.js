var mongoose    =   require("mongoose");

var googleTokenSchema  = new mongoose.Schema({
	"access_token": {type: String},
	"id_token": {type: String},
	"refresh_token": {type: String},
	"token_type": {type: String},
	"expiry_date": {type: Number}
});

exports.GoogleToken = mongoose.model('GoogleToken', googleTokenSchema);