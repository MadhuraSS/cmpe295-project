var Bcrypt 		= require('bcrypt-nodejs');
var userModel 	= require('../schemas/user');
var User 		= userModel.User;

exports.createUser = function (req,callback){
	var password = req.body.password;
	req.body.password = Bcrypt.hashSync(password, Bcrypt.genSaltSync(8), null);
	var new_user = new User(req.body);
	User.findOne({"_id":req.body._id},function(err,user){	
		//console.log(user);
		if(err){
			return callback(err,null);
		}
		else if(user != null){
			return callback(new Error("User already exists."));
		}
		new_user.save(function(err) {
        	callback(err);
    	});
	});
}

exports.getUser = function (query, callback){
	//console.log("User id: ",req.params.user_id);
	User.findOne(query, {"password":0}).exec(function(err, user) {
        callback(err,user);
    });
}

exports.authenticateUserLogin = function (query, callback){
	User.findOne({'_id': query._id}).exec(function(err, user) {
        if (err){
            callback(err, null, null);
        }else if(user == undefined || user == null){
            callback(null, user, null);
        }else{
            if(Bcrypt.compareSync(query.password, user.password)){
            	callback(null, user, true);
            }else{
            	callback(null, user, false);
            }
        }
    });
}

exports.updateUser = function (query, conditions, callback){
	//console.log("User body: "+JSON.stringify(conditions));
	User.findOne(query,function(err,user){	
		if(err){
			return callback(err,null);
		}
		else if(user == null){
			return callback(new Error("User not found"),null );
		}
		for (var key in conditions){
			if(key == '_id'){
				return callback(new Error('Email is unique and cannot be modified'), null)
			}else if(key == 'password'){
				var pwd = conditions[key];
				pwd = Bcrypt.hashSync(pwd, Bcrypt.genSaltSync(8), null)
				user[key] = pwd;
			}else{
				user[key] = conditions[key];
			}
		}
		user.save(callback(err, user));
	});
}

exports.getUsers = function (query,callback){
	User.find({}, {"password":0},function(err, users) {
		callback(err,users)
	});
}

exports.deleteUser = function (req,callback){
	User.remove({"_id" : req.params.user_id}, function(err) {
        callback(err);
    });
}

exports.getUserPatients = function (req,callback){
	User.find({'user_type': 'patient', 'doctor_id': req.params.user_id}, {"password":0}, function(err, users) {
		callback(err,users)
	});	
}

exports.getDoctors = function (req,callback){
	User.find({'user_type': 'doctor'}, {"password":0}, function(err, users) {
		callback(err,users)
	});	
}

exports.updateUserAppointmentComments = function (query, comment, callback){
	User.findOne(query,function(err,user){	
		if(err){
			return callback(err,null);
		}
		else if(user == null){
			return callback(new Error("User not found"), null);
		}
		user.medical_record.appointment_comments.push(comment);
		user.save(callback(err, user));
	});
}
