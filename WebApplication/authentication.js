var mongo 		=	require('./public/modules/mongo.js');
var bcrypt 		= 	require('bcrypt-nodejs');
var mongoURL 	=   "mongodb://adminrha:adminrha@ds161008.mlab.com:61008/rhasjsudb";

var userCollection;
var userLoginDetailsCollection;

mongo.connect(mongoURL,function(databaseConnection){
	console.log("connected to mongoURL: "+mongoURL);
    userCollection=mongo.collection('users');    
    userLoginDetailsCollection=mongo.collection('userLoginDetails'); 
});

exports.storePassword=function(req,callback){
		//to create a hashed password for the new user
			var document={
				email:req.query.userEmail,
				password:bcrypt.hashSync(req.query.newPassword, bcrypt.genSaltSync(8), null)
			}
			userLoginDetailsCollection.save(document,function(err3,doc2){
				if(err3){
					console.log("err3");
					console.log(err3);
				}
				else{
				    console.log("doc2");
				    console.log(doc2);
				    callback({statusCode:200,message:"user password saved."});
				}
			})
}

exports.authenticateUserLogin=function(req,callback){
	console.log("inside authenticateUserLogin");
	// console.log(req.query);

	var userEmail=req.query.username;
	var password=req.query.password;

	userCollection.findOne({email:userEmail},function(err,user){
		if(err){
			console.log(err);
		}
		else if(user){
			//check password
			userLoginDetailsCollection.findOne({email:userEmail},function(err2,doc){
				if(err2){
					console.log("err2");
					console.log(err2);
				}
				else{
					console.log("doc");
					console.log(doc);
					console.log("user")
					console.log(user.email+" "+user.name);
					if(doc){
						//user records exists
						if(bcrypt.compareSync(password, doc.password)){
							console.log("password matches");
							var cookiePackage={
								user:user.email,
								//userType:user.type
								name: user.name
							}
							callback({statusCode:200,message:"user authenticated",cookiePackage:cookiePackage});
						}
						else{
							console.log("password doesnt matches");
							callback({statusCode:202,message:"user not authenticated",cookiePackage:null});
						}
					}
					else{
						//user records doesnt exists
						console.log("user records doesnt exists in the hash document")
						callback({statusCode:204,message:"user records abnormal.",cookiePackage:null});

					}
				}
			})
		}
		else{
			callback({statusCode:206,message:"user doesnt exit.",cookiePackage:null});
		}
	})


}