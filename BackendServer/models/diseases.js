var diseaseSchema = require('../schemas/disease');
var Disease = diseaseSchema.Disease;

exports.createDisease = function (req,callback){
	var new_disease = new Disease(req.body);
	Disease.findOne({name:req.body.name},function(err,disease){	
		if(err){
			return callback(err,null);
		}
		else if(disease != null){
			return callback(new Error("Disease already exists."));
		}
		new_disease.save(function(err) {
        	callback(err);
    	});
	});
}

exports.getDiseases = function (query,callback){
	// Disease.find({},function(err, diseases) {
	// 	callback(err,diseases)
	// });
	if(JSON.stringify(query) != '{}'){
		if(query.name != undefined){
			Disease.find([{name : new RegExp(query.name, 'i')}, {description : new RegExp(query.name, 'i')}]).exec(function(err, diseases) {
				callback(err,diseases)
			});
		}else{
			Disease.find({symptoms : query.symptom}).exec(function(err, diseases) {
				callback(err,diseases)
			});
		}
	}else{
		Disease.find({},function(err, diseases) {
			callback(err,diseases)
		});
	}
}

exports.getDisease = function (query, callback){
	Disease.findOne(query).exec(function(err, disease) {
        callback(err,disease);
    });
}

exports.updateDisease = function (query, conditions, callback){
	Disease.findOne(query,function(err,disease){	
		if(err){
			return callback(err,null);
		}
		else if(disease == null){
			return callback(new Error("Disease not found"),null );
		}
		
		for (var key in conditions){
			if(key == '_id'){
				return callback(new Error('Id is unique and cannot be modified'), null)
			}
			disease[key] = conditions[key];
		}
		disease.save(callback(err, disease));
	});
}

exports.deleteDisease = function (req,callback){
	Disease.remove({_id : req.params.disease_id}, function(err) {
            callback(err);
    });
}

