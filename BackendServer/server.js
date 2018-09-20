var express             =   require("express");
var ExpressSession      =   require('express-session');
var googleAPI           =   require('googleapis');
var bodyParser          =   require("body-parser");
var cors                =   require('cors');
var cookieParser        =   require('cookie-parser');
var urlModule           =   require('url');

var app                 =   express();
var usersModel          =   require("./models/users");
var predictionModel     =   require("./models/prediction");
var appointmentsModel   =   require("./models/appointments");
var diseasesModel       =   require("./models/diseases");
var googleCalendarModel =   require("./models/googleCalendar");
var router              =   express.Router();
var googlePlus          =   googleAPI.plus('v1');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : true}));
app.set('json spaces', 3);
app.use(ExpressSession({
    secret: 'calendar-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));


router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});


//app.use(express.static('html'));

////////////////////////////////////////////////////////////////
/// TEMP Authentication
////////////////////////////////////////////////////////////////

router.route("/api/authenticate")
    .get(function(req,res){
        googleCalendarModel.getAuthUrl2(req,function(url, err){
            if (err){
                //console.log('before 500');
                res.status(500).send(err.message);
            }
            // else if(users == undefined || users == null ){
            //     res.status(404).json({ message: 'User not found' })
            // }
            else{
                res.send(`
                    <h1>Authentication using google oAuth<h1>
                    <a href=${url}>Login</a>
                `)
            }
        });
        // var url = googleCalendarModel.getAuthUrl();
        // console.log(url);
        // res.send(`
        //     <h1>Authentication using google oAuth<h1>
        //     <a href=${url}>Login</a>
        // `)
});

router.route("/api/authenticate/oauthCallback")
    .get(function(req,res){
        googleCalendarModel.handleOauthCallback(req,function(err, user){
            console.log(JSON.stringify(user));
            if (err){
                console.log(err);
                //console.log('before 500');
                //res.status(500).send(err.message);
                res.send(`<h3>Login failed!!</h3>;`);
            }
            // else if(users == undefined || users == null ){
            //     res.status(404).json({ message: 'User not found' })
            // }
            else{
                res.send('<h1>auth successful</h1>');
            }
        });
        // var url = googleCalendarModel.getAuthUrl();
        // console.log(url);
        // res.send(`
        //     <h1>Authentication using google oAuth<h1>
        //     <a href=${url}>Login</a>
        // `)
});

////////////////////////////////////////////////////////////////
/// Authentication
////////////////////////////////////////////////////////////////

router.route("/authenticate")
    .get(function(req,res){
        googleCalendarModel.getAuthUrl(req,function(url, err){
            if (err){
                res.status(500).send(err.message);
            }else{
                res.status(200).json({"authUrl": url});
            }
        });
});

router.route("/authenticate/oauthCallback")
    .get(function(req,res){
        googleCalendarModel.handleGoogleOauthCallback(req,function(err, info){
            if (err){
                res.redirect("http://ec2-34-205-171-38.compute-1.amazonaws.com:5000/error.html");
            }else{
                var redirectURL = urlModule.format({
                    pathname: "http://ec2-34-205-171-38.compute-1.amazonaws.com:5000/landingpage.html",
                    query: {
                        "email": info.email_id,
                        "token": JSON.stringify(info.google_calendar_token)
                    }
                });
                res.redirect(redirectURL);
            }
        });
});


////////////////////////////////////////////////////////////////
/// Prediction
////////////////////////////////////////////////////////////////

router.route("/api/prediction")
    .get(function(req,res){
        predictionModel.predictDisease(req,function(err,disease){
            if (err){
                res.status(500).send(err.message);
            }else{
                res.status(200).json(disease);
            }
        });
    });

////////////////////////////////////////////////////////////////
/// Users
////////////////////////////////////////////////////////////////

router.route("/api/users")
    .get(function(req,res){
        usersModel.getUsers(req,function(err,users){
            if (err){
                res.status(500).send(err.message);
            }
            else if(users == undefined || users == null ){
                res.status(404).json({ message: 'User not found' })
            }
            else{
                res.status(200).json(users);
            }
        });
    })

    .post(function(req,res){
        if(req.cookies.remoteHealthGoogleToken){
            var req_temp = req;
            req_temp.body.google_calendar_token = req.cookies.remoteHealthGoogleToken;
            req = req_temp;
        }
        usersModel.createUser(req, function (err){
            if(err){
                res.status(500).send(err.message);
            }
            else{
                res.status(201).json({ message: 'User created!' });
            }
        });
    });

router.route("/api/users/:user_id")
    .get(function(req,res){
        usersModel.getUser({'_id': req.params.user_id},function(err,user){
            //console.log(user);
            if (err){
                res.status(500).send(err.message);
            }
            else if(user == undefined || user == null || user == []){
                res.status(404).json({ message: 'User not found' });
            }
            else{
                res.status(200).json(user);
            }
        });
    })

    .put(function(req, res) {
        usersModel.updateUser({"_id":req.params.user_id},req.body,function(err,user){
            //console.log("Err: "+JSON.stringify(err, ["message", "arguments", "type", "name"]));
            if (err){
                res.status(500).send(err.message);
            }
            else if(user == undefined || user == null  ){
                res.status(404).json({ message: 'User not found' });
            }
            else{
                res.status(204).send();
            }
        });
    })

    .delete(function(req, res) {
        usersModel.deleteUser(req,function(err){
            if (err)
                res.status(500).send(err.message);
            else
                res.status(200).json({ message: 'User deleted' });
        });
    });

router.route("/api/users/:user_id/:password/login")
    .get(function(req,res){
        usersModel.authenticateUserLogin({'_id': req.params.user_id, 'password': req.params.password},function(err, user, login){
            if (err){
                res.status(500).send(err.message);
            }else if(user == undefined || user == null){
                res.status(404).json({ message: 'User not found' });
            }else if(login){
                res.status(200).json({ message: 'Login Successful!', user_type: user.user_type });
            }else{
                res.status(401).json({ message: 'Login Failed' });
            }
        });
    });

router.route("/api/doctors")
    .get(function(req,res){
        usersModel.getDoctors(req,function(err,users){
            if (err){
                res.status(500).send(err.message);
            }
            else if(users == undefined || users == null ){
                res.status(404).json({ message: 'User not found' })
            }
            else{
                res.status(200).json(users);
            }
        });
    });


////////////////////////////////////////////////////////////////
/// Appointments
////////////////////////////////////////////////////////////////

router.route("/api/appointments")
    .post(function(req,res){
        appointmentsModel.addAppointment(req,function(err,user){
            if (err){
                res.status(500).send(err.message);
            }
            else{
                res.status(201).json({ message: 'Appointment added!' });
            }
        });
    })
    .get(function(req,res){
        appointmentsModel.getAppointments({},function(err,appointments){
            //console.log(user);
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointments == undefined || appointments == null || appointments == []){
                res.status(404).json({ message: 'Appointments not found' })
            }
            else{
                res.status(200).json(appointments);
            }
        });
    });

router.route("/api/appointments/:appointment_id")
    .get(function(req,res){
        appointmentsModel.getAppointment({_id : req.params.appointment_id},function(err,appointment){
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointment == undefined || appointment == null || appointment == []){
                res.status(404).json({ message: 'Appointment not found' })
            }
            else{
                res.status(200).json(appointment);
            }
        });
    })

    .put(function(req, res) {
        appointmentsModel.updateAppointment({_id : req.params.appointment_id},req.body,function(err,appointment){
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointment == undefined || appointment == null  ){
                res.status(404).json({ message: 'Appointment not found' });
            }
            else{
                res.status(204).send();
            }
        });
    })

    .delete(function(req, res) {
        googleCalendarModel.cancelAppointment({_id : req.params.appointment_id},function(err){
            if (err){
                res.status(500).send(err.message);
            }
            else{
                res.status(200).json({ message: 'Appointment deleted' });
            }
        });
    });

router.route("/api/appointments/:appointment_id/:user_id/approve")
    .put(function(req, res) {
        googleCalendarModel.approveAppointment({"_id":req.params.appointment_id, "patient_id":req.params.user_id}, function(err,appointment){
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointment == undefined || appointment == null  ){
                res.status(404).json({ message: 'Appointment not found' });
            }
            else{
                res.status(204).send();
            }
        });
    });

router.route("/api/appointments/patient/:user_id")
    .get(function(req,res){
        appointmentsModel.getAppointmentsByUser({"patient_id" : req.params.user_id},function(err,appointments){
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointments == undefined || appointments == null || appointments == []){
                res.status(404).json({ message: 'Appointments not found' })
            }
            else{
                res.status(200).json(appointments);
            }
        });
    });

router.route("/api/appointments/doctor/:user_id")
    .get(function(req,res){
        appointmentsModel.getAppointmentsByUser({"doctor_id" : req.params.user_id},function(err,appointments){
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointments == undefined || appointments == null || appointments == []){
                res.status(404).json({ message: 'Appointments not found' })
            }
            else{
                res.status(200).json(appointments);
            }
        });
    });

router.route("/api/appointments/:appointment_id/finish")
    .put(function(req, res) {
        appointmentsModel.finishAppointment({"_id":req.params.appointment_id, "user_id":req.body.user_id, "doctor_comment": req.body.doctor_comment}, function(err, appointment, user){
            if (err){
                res.status(500).send(err.message);
            }else if(appointment == undefined || appointment == null  ){
                res.status(404).json({ message: 'Appointment not found' });
            }else if(user == undefined || user == null  ){
                res.status(404).json({ message: 'User not found' });
            }else{
                res.status(204).send();
            }
        });
    });

router.route("/api/appointments/doctor/:user_id/today")
    .get(function(req,res){
        appointmentsModel.getTodayAppointmentsByUser({"doctor_id" : req.params.user_id},function(err,appointments){
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointments == undefined || appointments == null || appointments == []){
                res.status(404).json({ message: 'Appointments not found' })
            }
            else{
                res.status(200).json(appointments);
            }
        });
    });

router.route("/api/users/:user_id/appointments")
    .post(function(req,res){
        appointmentsModel.addAppointment({email:req.params.user_id},req,function(err,user){
            if (err){
                res.status(500).send(err.message);
            }
            else if(user == undefined || user == null  ){
                res.status(404).json({ message: 'User not found' });
            }
            else{
                res.status(201).json({ message: 'Appointment added!' });
            }
        });
    })
    .get(function(req,res){
        appointmentsModel.getUserAppointments(req,function(err,user){
            //console.log(user);
            if (err){
                res.status(500).send(err.message);
            }
            else if(user == undefined || user == null || user == []){
                res.status(404).json({ message: 'User not found' })
            }
            else{
                res.status(200).json(user);
            }
        });
    });

router.route("/api/users/:user_id/appointments/:appointment_id")
    .get(function(req,res){
        appointmentsModel.getAppointment({_id : req.params.appointment_id},function(err,appointment){
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointment == undefined || appointment == null || appointment == []){
                res.status(404).json({ message: 'Appointment not found' })
            }
            else{
                res.status(200).json(appointment);
            }
        });
    })

    .put(function(req, res) {
        appointmentsModel.updateAppointment({_id : req.params.appointment_id},req.body,function(err,appointment){
            if (err){
                res.status(500).send(err.message);
            }
            else if(appointment == undefined || appointment == null  ){
                res.status(404).json({ message: 'Appointment not found' });
            }
            else{
                res.status(204).send();
            }
        });
    })

    .delete(function(req, res) {
        appointmentsModel.deleteAppointment({_id : req.params.appointment_id},function(err){
            if (err)
                res.status(500).send(err.message);
            else
                res.status(200).json({ message: 'Appointment deleted' });
        });
    });

router.route("/api/users/:user_id/patients")
    .get(function(req,res){
        usersModel.getUserPatients(req,function(err,user){
            if (err){
                res.status(500).send(err.message);
            }
            else if(user == undefined || user == null || user == []){
                res.status(404).json({ message: 'User not found' })
            }
            else{
                res.status(200).json(user);
            }
        });
    });


app.use('/',router);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Listening to PORT "+ port);

var http = require ('http');
var mongoose    =   require("mongoose");
//mongoose.connect('mongodb://localhost:27017/users');
//var connection_uri = 'mongodb://localhost:27017/healthcare-system'
var connection_uri = process.env.MONGODB_URI || 'mongodb://cmpe295a:chandra3295a@ds143330.mlab.com:43330/healthcare-system';

mongoose.connect(connection_uri, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + connection_uri + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + connection_uri);
  }
});

