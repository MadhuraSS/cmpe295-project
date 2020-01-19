var routerApp=angular.module('myApp',['ui.router', 'ui.bootstrap']);

routerApp.config(function($stateProvider,$urlRouterProvider, $locationProvider){

    $locationProvider.hashPrefix('');

	$locationProvider.html5Mode({
    enabled: false,
    requireBase: true
  		});

	$stateProvider.state('update_profile',{
		url: 'updateProfile',
		templateUrl:'templates/updateProfile.html',
		controller: 'updateProfileController'
	})
	.state('register',{
		url: 'registerUser',
		templateUrl:'templates/register.html',
		controller: 'registerUserController'
	})
	.state('request_appointment',{
		url:'requestAppointment',
		templateUrl:'templates/requestAppointment.html',
		controller: 'requestAppointmentController'
	})
	.state('upcoming_appointment',{
		url:'upcomingAppointment',
		templateUrl:'templates/upcomingAppointment.html',
		controller: 'upcomingAppointmentController'
	})
	.state('doc_upcoming_appointment',{
		url:'upcomingAppointmentDoc',
		templateUrl:'templates/DocUpcoming.html',
		controller: 'docUpcomingAppointmentController'
	})
	.state('doc_current_session',{
		url:'currentSessionDoc',
		templateUrl:'templates/CurrentSession.html',
		controller: 'currentSessionDocController'
	})
	
	.state('individual_info',{
		url:'individual_info',
		templateUrl:'templates/individual_Info.html',
		controller: 'personalController'
	})
	
	.state('family_info',{
		url:'family_info',
		templateUrl:'templates/family_Info.html',
		controller: 'familyController'
	})
	
	.state('pending_appointment',{
		url:'pendingAppointment',
		templateUrl:'templates/pendingAppointment.html',
		controller: 'pendingAppointmentController'
	})
	.state('doc_pending_appointment',{
		url:'pendingAppointmentDoc',
		templateUrl:'templates/DocPending.html',
		controller: 'docPendingAppointmentController'
	})
	.state('past_appointment',{
		url:'pastAppointment',
		templateUrl:'templates/pastAppointment.html',
		controller: 'pastAppointmentController'
	})
	.state('doc_past_appointment',{
		url:'pastAppointmentDoc',
		templateUrl:'templates/DocPast.html',
		controller: 'docPastAppointmentController'
	})
	.state('personal_info',{
		url:'personalInfo',
		templateUrl:'templates/personalInfo.html',
		controller: 'personalInfoController'
	})
	.state('personal_history',{
		url:'personalHistory',
		templateUrl:'templates/personalHistory.html',
		controller: 'personalHistoryController'
	})
	.state('family_history',{
		url:'familyHistory',
		templateUrl:'templates/familyHistory.html',
		controller: 'familyHistoryController'
	})
  .state('get_recommendation',{
    url:'get_recommendation',
    templateUrl:'templates/reco.html',
    controller: 'recoController'
  })

})

var userAppointments=[];
var userInfo=[];
var user_type;
var userName;
var userCookie;
const cookieName="rhaSJSU";
var user_legalName;

/**
* @func redirectToHome
* @desc function to redirect to home
*/
var redirectToHome=function(){
  console.log("inside redirectToHome")
  window.location.href = '/';
 }

 var destroyCookie=function(){
      var date = new Date();
      expires=date.setTime(date.getTime()+(-1*24*60*60*1000));
      document.cookie = cookieName +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = "/";
 }

///////////////////////////////////
////  DashBoard Controller ////////
///////////////////////////////////
routerApp.controller('dashBoardController',function($scope,$http,$window,$state){
	console.log("inside dashBoardController");

	//below function loads user appointments upon loading of the page
	
		/*****code added today********/
	   //fetches the values from the parameters
     // if no cookie exists
     //var values=JSON.parse(readCookie("macrocheck"));
     $scope.patientNavBar=true;
     $scope.doctorNavBar=true;

     var nameEQ = encodeURIComponent(cookieName) + "=";
     console.log("document cookie")
     console.log(document.cookie)
     var ca = document.cookie.split(';');
     console.log("ca");
     console.log(ca);

     var values=JSON.parse(readCookie(cookieName));
     console.log("cookie values")
     console.log(values);	
     if(values==null)
     {
	 	   redirectToHome();
     }
     else{
     	userCookie={
     		_id: values.user,
     		tokens:values.tokens
     	}
     	userName=values.user;
      user_type=values.user_type;

      if(user_type=="patient"){
        //show patient nav bar
        console.log("patient nav bar")
        $scope.patientNavBar=false;
        $scope.doctorNavBar=true;
        $state.go('request_appointment')
      }
      else if(user_type=="doctor")
      {
        // show doctor nav bar
        console.log("doctor nav bar")
        $scope.patientNavBar=true;
        $scope.doctorNavBar=false;
        $state.go('doc_upcoming_appointment')
      }
     }

     //return cookie if present else returns null
     function readCookie(cookieName){
       	var nameEQ = cookieName + "=";
       	for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            console.log("c "+i)
            console.log(c);
            while (c.charAt(0) === ' ') {
            	c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0){
            	console.log("3");
            	console.log(decodeURIComponent(c.substring(nameEQ.length, c.length)));
            	return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }  	
     	   }
     	   return null;
     }
   
   /**
   * @func logout
   * @desc destroys the cookie, redirects to homepage
   */   
   $scope.logout=function(){
      destroyCookie();
   }
	
	$scope.checkboxModel = {
       value1 : 'no',
       value2 : 'no',
       value3 : 'no',
       value4 : 'no',
       value5 : 'no',
       value6 : 'no'
     }; 

  /*********fetching user details**********************/   
  // fetching patient appointments
 	if(userAppointments.length==0 || userInfo.length==0){
		console.log("fetching user details")
	$http({
	   method:'get',
	   url:'https://remote-health-api.herokuapp.com/api/appointments/'+user_type+'/'+userName,
		}).then(function(response){
	        $scope.mydata=response.data;   
	        userAppointments.push(response.data);
	        console.log($scope.mydata);
	        console.log("hi");
	        console.log($scope.mydata[0]["_id"]);
	      },function(error){
          console.log(error);
	    });
	
  //fetching patient health record
  }
  if(user_type=="patient"){
      $http({
       method:'get',
       url:'https://remote-health-api.herokuapp.com/api/users/'+userName,
     }).then(function(response){
        console.log("medical info");
        console.log(response);
        user_legalName=response.data.name.first_name+" "+response.data.name.last_name;
        $scope.myinfo=response.data;
        $scope.address=$scope.myinfo.address;
        $scope.phone_number=$scope.myinfo.phone_number;
        $scope.medical_record=$scope.myinfo.medical_record.personal_medical_history;
        console.log($scope.medical_record);
        userInfo.push(response.data)
     },function(error){
        console.log(error);
     });
  }
  else{
    //parse values to the front end from the variables
    console.log("user details already exists");
    //read the cookie
   }
  

	

	   			
})

//////////////////////// Patient Nav Bar Controllers ////////////////////////////
/********************************************************************************/


//////////////////////////////////////////////////////////
/////// request appointment menu controller /////////////
////////////////////////////////////////////////////////
routerApp.controller('requestAppointmentController',function($scope,$http,$uibModal){
	console.log("inside requestAppointmentController");
	var doctor_id;
  var docDetails=null;
  //fetches doctor details -- doctor name, id and location
    $http({
      method:'get',
       url:'https://remote-health-api.herokuapp.com/api/doctors',
    }).then(function(doctorDetails){
       console.log("doctorDetails")
       console.log(doctorDetails);
       docDetails=doctorDetails.data;
       $scope.doctorDetails=doctorDetails.data;

      // console.log("doctorDetails");
      // console.log(docDetails)

       //parse it to front end in the form of drop down
       // parse doc name and id/ dont show id to the user but keep it
       // parse doc location to the drop down
    },function(error){
       console.log(error);
    });

    $scope.selectedDoctor=function(){
        console.log("selectedDoctor")
        console.log($scope.doctor_name)
        var fetchedValues=$scope.doctor_name;
        fetchedValues=fetchedValues.split('+');
        console.log(fetchedValues[0]+" "+fetchedValues[1]);
        var index=fetchedValues[0];
        doctor_id=fetchedValues[1];
       // console.log("doctorDetails 2")
       // console.log(docDetails)
       //console.log("doc address");
        var tempaddress=docDetails[index].address;
       // console.log(tempaddress);
        $scope.location=tempaddress.street;   
    }

  // on appointment request
  /** @func onSubmit
   *  @desc handles submission of request for doc's appointment
   */
	 $scope.onSubmit=function(){
      var data={
      	"patient_id": userName,
        "patient_name":user_legalName,
      	"doctor_id": doctor_id,
      	"doctor_name": $scope.doctor_name,
      	"purpose": $scope.purpose,
      	"status": "pending",
      	"date": document.getElementById("uniqueDate").value,
      	"start_time": document.getElementById("time_start").value,
      	"end_time": document.getElementById("time_end").value,
      	"location": $scope.location
  	  }
  	  $http({
         method:'post',
         url:'https://remote-health-api.herokuapp.com/api/appointments',
         data:data
       }).then(function(response){
        console.log(response);


         //modal pop ups
         $scope.statusMessage="Appointment request has been sent to the doctor. You will get notification once approved. Thank you using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       },function(error){
          console.log(error);


         //modal pop ups
         $scope.statusMessage="Appointment request has encountered some error. Please try again after sometime. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       });                   
   }    
})

////////////////////////////////////////////////////////////////
//////// user profile update controller ///////////////////////
///////////////////////////////////////////////////////////////
routerApp.controller('updateProfileController',function($scope,$http,$uibModal){
  console.log("inside updateProfileController");
     $scope.onUpdate=function(){
        console.log("user hits update")
        var data_update={
           "address": {
              "street": $scope.address.street,
              "city": $scope.address.city,
              "state": $scope.address.state,
              "zip": $scope.address.zip,
              "county": $scope.address.county,
              "country": $scope.address.country
        },
           "phone_number": $scope.phone_number
     }
    
       $http({
         method:'PUT',
         url:'https://remote-health-api.herokuapp.com/api/users/'+userName,
         data:data_update    
       }).then(function(response){

         //modal pop ups
         $scope.statusMessage="Profile has been updated. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       },function(error){

         //modal pop ups
         $scope.statusMessage="Some error encountered during update request. Kindly check your input or try after sometime. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       });       
   }   
})


routerApp.controller('pendingAppointmentController',function($scope,$http){
  console.log("inside pendingAppointmentController");
})



routerApp.controller('upcomingAppointmentController',function($scope,$http){
  console.log("inside upcomingAppointmentController");
})

///////////////////////////////////////////////////////////////////////////
//////// recommendation Controller ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////
routerApp.controller('recoController',function($state,$scope,$http,$uibModal){
  console.log("inside recoController");
  
   $scope.onSubmit=function(){
//       var data={
//        "symptom1": $scope.symptom1,
//        "symptom2": $scope.symptom2
//      }
  var symptom1=document.getElementById("symptom1").value;
  var symptom2=document.getElementById("symptom2").value;
      
      $http({
      method:'get',
       url:'https://remote-health-api.herokuapp.com/api/prediction?symptoms='+symptom1+','+symptom2+'&email='+userName,
    }).then(function(response){
       console.log(response);
       $scope.diseaseData=response.data;
    
        var modal = document.getElementById('myModal1');
      // Get the button that opens the modal
      var btn = document.getElementById("myBtn");
      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close1")[0];
      // When the user clicks the button, open the modal 
      modal.style.display = "block";
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
          modal.style.display = "none";
      }
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
        }

    },function(error){
       console.log(error);


     //modal pop ups
     $scope.statusMessage="Some error occured!!. Kindly try again or after some time.Thank you for using Remote Health Assist"
        $uibModal.open({
          scope: $scope,
          templateUrl: 'templates/modal.html',
          resolve: {
            statusMessage: function() {
              return $scope.statusMessage;
            }
          }
        })
    });                 
   }    
})





/////////////////////////////////////////////////////////////////////////////////////
/********************** doctor profile controller *********************************/




///////////////////////////////////////////////
////// patient personal info controller  //////
//////////////////////////////////////////////

//holds the patient id which needs to be searched
var tempPatientId=null;

routerApp.controller('personalController',function($state,$scope,$http,$uibModal){
	console.log("inside personalController");
	   
     // fetch patient name
     // onclick
		$http({
       method:'get',
       url:'https://remote-health-api.herokuapp.com/api/users/'+tempPatientId,
     }).then(function(response){
      	console.log("medical info");
        $scope.myinfo=response.data;
        $scope.address=$scope.myinfo.address;
        $scope.phone_number=$scope.myinfo.phone_number;
        $scope.medical_record=$scope.myinfo.medical_record.personal_medical_history;
        console.log($scope.medical_record); 
        userInfo.push(response.data)
     },function(error){
          console.log(error)
     });
})

/////////////////////////////////////////////
////// patient family  info controller //////
////////////////////////////////////////////
routerApp.controller('familyController',function($state,$scope,$http,$uibModal){
	console.log("inside familyController");
	 
    // patient family information
    // on click
		$http({
       method:'get',
       url:'https://remote-health-api.herokuapp.com/api/users/'+tempPatientId,
     }).then(function(response){
     	// console.log("response");
      	console.log("medical info");
        $scope.myinfo=response.data;
      //   console.log($scope.myinfo);
//         console.log($scope.myinfo.user_type);
        $scope.address=$scope.myinfo.address;
        $scope.phone_number=$scope.myinfo.phone_number;
        $scope.medical_record=$scope.myinfo.medical_record.personal_medical_history;
        console.log($scope.medical_record);
        
        userInfo.push(response.data)
     },function(error){
        console.log(error);
     });
	// $state.go('family_history');
})




////////////////////////////////////////////
/// doc upcoming appointment controller ////
////////////////////////////////////////////
routerApp.controller('docUpcomingAppointmentController',function($scope,$http,$uibModal){
	console.log("inside DocUpcomingAppointmentController");
	var appointment;

	$scope.onFinish=function(appt_id){
	appointment=appt_id;
	console.log("Appt id");
    console.log(appt_id);

    // appointment pop modal
    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks the button, open the modal 
    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
      }                    
   } 
   
   // take the patientName
   $scope.onFinalFinish=function(){
    console.log("final submit");
        var data_update={ 
         "comments": document.getElementById("finish_comments").value,
         "status":"finished"
         }
    
       $http({
         method:'PUT',
         url:'https://remote-health-api.herokuapp.com/api/appointments/'+appointment,
         data:data_update    
       }).then(function(response){
         console.log("alter appt success ");
          

         //modal pop ups
         $scope.statusMessage="Appointment has been closed. Comments added user profile. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       });                  
   } 
})


///////////////////////////////////////////////////////////////////
//////     patient health & family history retrival    ////////////
///////////////////////////////////////////////////////////////////

routerApp.controller('currentSessionDocController',function($state,$scope,$http,$uibModal){
	console.log("inside currentSessionDocController");

  //fetches the doc current session
      $http({
       method:'get',
       url:'https://remote-health-api.herokuapp.com/api/users/'+userName+'/patients',
     }).then(function(response){
      console.log("users");
        $scope.patients=response.data;
        console.log($scope.patients);
     },function(error){
      // console.log("err");
      //   console.log(error);
     });
  // if the doc clicks on the button to get patient individual info
  //pass patient id
	$scope.onView=function(PatientId){  
      tempPatientId=PatientId;    
      $state.go('individual_info');                 
   }   
   // if the doc clicks to check the family history of the patient
   //patient id
   	$scope.onViewFamily=function(PatientId){  
      tempPatientId=PatientId; 
      $state.go('family_info');                 
   }
})

/////////////////////////////////////////////////////////////
////// pending doc approval appointments controller//////////
/////////////////////////////////////////////////////////////

routerApp.controller('docPendingAppointmentController',function($scope,$http,$uibModal){
	console.log("inside docPendingAppointmentController");
	var appt;

   /*** if the doctor approves the appointment ****/
  	$scope.onConfirm=function(appt_id,patient_id){  
  	   // var data_update={
      //  "status": "approved"
  	   // }
  		console.log(appt_id,patient_id)
       $http({
         method:'PUT',
         url:'https://remote-health-api.herokuapp.com/api/appointments/'+appt_id+'/'+patient_id+'/approve'
       }).then(function(response){
       	console.log("put success");


         //modal pop ups
         $scope.statusMessage="Appointment request has been confirmed. Notification has been sent to patient. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       },function(error){
        console.log(error);

         //modal pop ups
         $scope.statusMessage="Some error occured during approval process. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       });                   
     } 
     
    /*** if the doc denies the appointment request*****/ 
     $scope.onDeny=function(){ 		
       $http({
         method:'DELETE',
         url:'https://remote-health-api.herokuapp.com/api/appointments/'+appt_id
       }).then(function(response){
       	console.log("deny success");

         //modal pop ups
         $scope.statusMessage="Appointment request has been declined. Notification has been sent to patient. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
        $window.location.href = "/Dashboard";
       },function(error){
       	// console.log("put err");

         //modal pop ups
         $scope.statusMessage="Some error occured during the process. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       });              
     } 
     

   /*** if the doc alter the requested appointment *******/  
     $scope.onAlter=function(appt_id){
      appt=appt_id;
      console.log("alter1");
      console.log(appt);
            // Get the modal
        var modal = document.getElementById('myModal2');
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close2")[0];
        // When the user clicks the button, open the modal 
        modal.style.display = "block";
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }                    
     }
     

   /*** if the doc alter the requested appointment *******/  
   $scope.onFinalAlter=function(){
    console.log("On final alter");
    console.log(appt);
    	   var data_update={
          "status": "approved",
        	"date": document.getElementById("uniqueDate").value,
        	"start_time": document.getElementById("time_start").value,
        	"end_time": document.getElementById("time_end").value
	       }	
       $http({
         method:'PUT',
         url:'https://remote-health-api.herokuapp.com/api/appointments/'+appt+'',
         data:data_update    
       }).then(function(response){
       	console.log("alter appt success success");


         //modal pop ups
         $scope.statusMessage="Appointment has been approved with altered date and time. Patient has been notified. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
          $window.location.href = "/Dashboard";
       },function(error){
       	   console.log(error);

         //modal pop ups
         $scope.statusMessage="Some error occured during the alter process. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
       });     
   }
})

routerApp.controller('pastAppointmentController',function($scope,$http){
	console.log("inside pastAppointmentController");
})

routerApp.controller('docPastAppointmentController',function($scope,$http){
	console.log("inside docPastAppointmentController");
})








/*****************new user registration controller *******************/





//append the values as he clicks next button on each screen
/////////////////////////////////////////////////////////////
///////// new user registration register.html ///////////////
/////////////////////////////////////////////////////////////
var registrationInfo=[];

routerApp.controller('userRegistrationController',function($state,$scope,$http,$uibModal){
	console.log("inside userRegistrationController");
  $state.go('register');
  var nameEQ = encodeURIComponent(cookieName) + "=";
     console.log("document cookie")
     console.log(document.cookie)
     var ca = document.cookie.split(';');
     console.log("ca");
     console.log(ca);

     var values=JSON.parse(readCookie(cookieName));
     console.log("cookie values")
     console.log(values); 
     if(values==null)
     {
       redirectToHome();
     }
     else{
      userCookie={
        _id: values.user,
        tokens:values.tokens
      }
      userName=values.user;
      user_type=values.user_type;
    }
     function readCookie(cookieName){
        var nameEQ = cookieName + "=";
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            console.log("c "+i)
            console.log(c);
            while (c.charAt(0) === ' ') {
              c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0){
              console.log("3");
              console.log(decodeURIComponent(c.substring(nameEQ.length, c.length)));
              return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }   
         }
         return null;
     }
   

	//retrieve from cookie the user email info
})

////////////////////////////////////////////////////////////////////////
//////// template register.html controller to add password ////////////
//////////////////////////////////////////////////////////////////////
routerApp.controller('registerUserController',function($state,$scope,$http,$uibModal){
	console.log("inside registerUserController");

	  $scope.userName = userName; 
  	$scope.savePassword=function(){
  		var password = document.getElementById("password").value;
  		var confirm_password = document.getElementById("confirm_password").value;
  		// console.log(password);
  		if (password != confirm_password){
  			console.log("Passwords Don't Match");

         //modal pop ups
         $scope.statusMessage="Password Dont Match!!"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
  		}
  		else
  		{		
  			var password=document.getElementById("password").value;
  			var email=document.getElementById("email").value;
  			registrationInfo[0]=email;
  			registrationInfo[1]=password;
  			console.log(registrationInfo[0]);
  		}
  		$state.go('personal_info');
  	}
}) 

//////////////////////////////////////////////////////////////////////
//////// stores personal information template personalInfo //////////
////////////////////////////////////////////////////////////////////
routerApp.controller('personalInfoController',function($state,$scope,$http,$rootScope,$uibModal){
	console.log("inside personalInfoController");

   $http({
      method:'get',
       url:'https://remote-health-api.herokuapp.com/api/doctors',
    }).then(function(doctorDetails){
       
       console.log("doctor Details!");
       $scope.doctorDetails=doctorDetails.data;
       console.log(doctorDetails);
       
       //parse it to front end in the form of drop down
       // parse doc name and id/ dont show id to the user but keep it
       // parse doc location to the drop down
    },function(error){
       console.log(error);
    })
    
    $scope.onClick=function(doc_email){
    console.log(doc_email);
    }
	
	$scope.personalInfoSave=function(){
		var first_name=document.getElementById("first_name").value;
		var age=document.getElementById("age").value;
		var street=document.getElementById("street").value;
		var county=document.getElementById("county").value;
		var doctor_id=document.getElementById("doctor_id").value;
		var last_name=document.getElementById("last_name").value;
		var city=document.getElementById("city").value;
		var ethnicity=document.getElementById("ethnicity").value;
		var country=document.getElementById("country").value;
		var user_type=document.getElementById("user_type").value;
		var gender=document.getElementById("gender").value;
		var temp_phone_number=document.getElementById("phone_number").value;

    /* process phone number*/
    var cell_part1=temp_phone_number.substring(0,3);
    var cell_part2=temp_phone_number.substring(3,6);
    var cell_part3=temp_phone_number.substring(6,10);
    phone_number=cell_part1+"-"+cell_part2+"-"+cell_part3;

		var state=document.getElementById("state").value;
		var zip=document.getElementById("zip").value;
		registrationInfo[2]=first_name;
		registrationInfo[3]=age;
		registrationInfo[4]=street;
		registrationInfo[5]=county;
		registrationInfo[6]=doctor_id;
		registrationInfo[7]=last_name;
		registrationInfo[8]=city;
		registrationInfo[9]=ethnicity;
		registrationInfo[10]=country;
		registrationInfo[11]=user_type;
		registrationInfo[12]=gender;
		registrationInfo[13]=phone_number;
		registrationInfo[14]=state;
		registrationInfo[15]=zip;
		
    if(user_type=="doctor"){

      $rootScope.personal_history=true;
      $rootScope.family_history=true;
    var data={
        "_id": userName,
        "password": registrationInfo[1],
         "name": {
           "first_name": registrationInfo[2],
           "last_name": registrationInfo[7]
        },
        "address": {
           "street": registrationInfo[4],
          "city": registrationInfo[8],
          "state": registrationInfo[14],
          "zip": registrationInfo[15],
          "county": registrationInfo[10],
          "country": registrationInfo[5]
        },
        "user_type": registrationInfo[11],
        "phone_number": registrationInfo[13],
        "doctor_id": registrationInfo[6],
        "google_calendar_token" :userCookie.tokens
      }

       console.log(data);
         $http({
           method:'post',
           url:'https://remote-health-api.herokuapp.com/api/users',
           data:data
         }).then(function(response){
            console.log("response");
            console.log(response);


         //modal pop ups
         $scope.statusMessage="Doctor has been added. Thank you for using Remote Health Assist. You can now check the dashboard."
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
             destroyCookie();
             $window.location.href = "/";

         },function(error){
            
         //modal pop ups
         $scope.statusMessage="Some error in processing doctor addition. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
         });
         destroyCookie();
        $window.location.href = "/Dashboard";
    }
    else if(user_type=="patient"){
         $state.go('personal_history');
    }    
	}
})

//////////////////////////////////////////////////////////////////
///// personal history template=personalHistory.html ////////////
////////////////////////////////////////////////////////////////

// should only work if the user_type is doc
routerApp.controller('personalHistoryController',function($state,$scope,$http,$uibModal){
	console.log("inside personalHistoryController");

	
	$scope.personalHistorySave=function(){
		var alcoholism= "no";
		var anemia= "no";
		var asthma= "no";
		var concussion= "no";
		var eating_disorder= "no";
		var heart_disease= "no";
		var high_cholesterol= "no";
		var kidney_or_bladder_problems= "no";
		var loss_of_consciousness= "no";
		var smoke= "no";
		
		var overweight_or_obesity= "no";
		var seizures_or_convulsions= "no";
		var stroke= "no";
		var surgery= "no";
		var thyroid_problems= "no";
		var allergies= "no";
		var anxiety_or_panic_attack= "no";
		var cancer_or_tumor_id= "no";
		var diabetes= "no";
		var drink_alcohol= "no";
		
		var headaches_severe= "no";
		var high_blood_pressure= "no";
		var hospitalization= "no";
		var liver_disease_or_hepatitis= "no";
		var mononucleosis= "no";
		var psychiatric_problems= "no";
		var substance_abuse= "no";
		var stomach_or_intestinal_problems= "no";
		var thrombophlebitis_or_blood_clots= "no";
		var tuberculosis_or_positive_TB_skin_test= "no";
		
		var cut_down_drinking_alcohol= "no";
		var drugs= "no";
		var sleep_problems= "no";
		var sad_or_depressed= "no";
		var regular_physical_exercise= "no";
		var sexually_active= "no";
		var safe_sex= "no";
		
		var checkboxModel_value1= "no";
		var checkboxModel_value2= "no";
		var checkboxModel_value3= "no";
		var checkboxModel_value4= "no";
		var checkboxModel_value5= "no";
		var checkboxModel_value6= "no";
		
		var other= "no";
		var comments_breast_problems= document.getElementById("comments_breast_problems").value;
		var comments= document.getElementById("comments").value;
		
		if (document.getElementById('other_yes').checked) {
  		other = "yes";
  		}
  		
		if (document.getElementById('checkboxModel_value1').checked) {
  		checkboxModel_value1 = "yes";
  		}
  		
  		if (document.getElementById('checkboxModel_value2').checked) {
  		checkboxModel_value2 = "yes";
  		}

  		if (document.getElementById('checkboxModel_value3').checked) {
  		checkboxModel_value3 = "yes";
  		}

  		if (document.getElementById('checkboxModel_value4').checked) {
  		checkboxModel_value4 = "yes";
  		}

  		if (document.getElementById('checkboxModel_value5').checked) {
  		checkboxModel_value5 = "yes";
  		}

  		if (document.getElementById('checkboxModel_value6').checked) {
  		checkboxModel_value6 = "yes";
  		}
  		
		if (document.getElementById('cut_down_drinking_alcohol_yes').checked) {
  		cut_down_drinking_alcohol = "yes";
  		}
  		
  		if (document.getElementById('drugs_yes').checked) {
  		drugs = "yes";
  		}

  		if (document.getElementById('sleep_problems_yes').checked) {
  		sleep_problems = "yes";
  		}

  		if (document.getElementById('sad_or_depressed_yes').checked) {
  		sad_or_depressed = "yes";
  		}

  		if (document.getElementById('regular_physical_exercise_yes').checked) {
  		regular_physical_exercise = "yes";
  		}

  		if (document.getElementById('sexually_active_yes').checked) {
  		sexually_active = "yes";
  		}

  		if (document.getElementById('safe_sex_yes').checked) {
  		safe_sex = "yes";
  		} 
  		
		if (document.getElementById('alcoholism_yes').checked) {
  		alcoholism = "yes";
  		}
  		
  		if (document.getElementById('anemia_yes').checked) {
  		anemia = "yes";
  		}

  		if (document.getElementById('asthma_yes').checked) {
  		asthma = "yes";
  		}

  		if (document.getElementById('concussion_yes').checked) {
  		concussion = "yes";
  		}

  		if (document.getElementById('eating_disorder_yes').checked) {
  		eating_disorder = "yes";
  		}

  		if (document.getElementById('heart_disease_yes').checked) {
  		heart_disease = "yes";
  		}

  		if (document.getElementById('high_cholesterol_yes').checked) {
  		high_cholesterol = "yes";
  		}

  		if (document.getElementById('kidney_or_bladder_problems_yes').checked) {
  		kidney_or_bladder_problems = "yes";
  		}

  		if (document.getElementById('loss_of_consciousness_yes').checked) {
  		loss_of_consciousness = "yes";
  		}

  		if (document.getElementById('smoke_yes').checked) {
  		smoke = "yes";
  		}
  		
  		if (document.getElementById('overweight_or_obesity_yes').checked) {
  		overweight_or_obesity = "yes";
  		}
  		
  		if (document.getElementById('seizures_or_convulsions_yes').checked) {
  		seizures_or_convulsions = "yes";
  		}

  		if (document.getElementById('stroke_yes').checked) {
  		stroke = "yes";
  		}

  		if (document.getElementById('surgery_yes').checked) {
  		surgery = "yes";
  		}

  		if (document.getElementById('thyroid_problems_yes').checked) {
  		thyroid_problems = "yes";
  		}

  		if (document.getElementById('allergies_yes').checked) {
  		allergies = "yes";
  		}

  		if (document.getElementById('anxiety_or_panic_attack_yes').checked) {
  		anxiety_or_panic_attack = "yes";
  		}

  		if (document.getElementById('cancer_or_tumor_id_yes').checked) {
  		cancer_or_tumor_id = "yes";
  		}

  		if (document.getElementById('diabetes_yes').checked) {
  		diabetes = "yes";
  		}

  		if (document.getElementById('drink_alcohol_yes').checked) {
  		drink_alcohol = "yes";
  		}
  		
  		if (document.getElementById('headaches_severe_yes').checked) {
  		headaches_severe = "yes";
  		}
  		
  		if (document.getElementById('high_blood_pressure_yes').checked) {
  		high_blood_pressure = "yes";
  		}

  		if (document.getElementById('hospitalization_yes').checked) {
  		hospitalization = "yes";
  		}

  		if (document.getElementById('liver_disease_or_hepatitis_yes').checked) {
  		liver_disease_or_hepatitis = "yes";
  		}

  		if (document.getElementById('mononucleosis_yes').checked) {
  		mononucleosis = "yes";
  		}

  		if (document.getElementById('psychiatric_problems_yes').checked) {
  		psychiatric_problems = "yes";
  		}

  		if (document.getElementById('stomach_or_intestinal_problems_yes').checked) {
  		stomach_or_intestinal_problems = "yes";
  		}

  		if (document.getElementById('substance_abuse_yes').checked) {
  		substance_abuse = "yes";
  		}

  		if (document.getElementById('thrombophlebitis_or_blood_clots_yes').checked) {
  		thrombophlebitis_or_blood_clots = "yes";
  		}

  		if (document.getElementById('tuberculosis_or_positive_TB_skin_test_yes').checked) {
  		tuberculosis_or_positive_TB_skin_test = "yes";
  		}

		registrationInfo[16]=alcoholism;
		registrationInfo[17]=anemia;
		registrationInfo[18]=asthma;
		registrationInfo[19]=concussion;
		registrationInfo[20]=eating_disorder;
		registrationInfo[21]=heart_disease;
		registrationInfo[22]=high_cholesterol;
		registrationInfo[23]=kidney_or_bladder_problems;
		registrationInfo[24]=loss_of_consciousness;
		registrationInfo[25]=smoke;

		registrationInfo[26]=overweight_or_obesity;
		registrationInfo[27]=seizures_or_convulsions;
		registrationInfo[28]=stroke;
		registrationInfo[29]=surgery;
		registrationInfo[30]=thyroid_problems;
		registrationInfo[31]=allergies;
		registrationInfo[32]=anxiety_or_panic_attack;
		registrationInfo[33]=cancer_or_tumor_id;
		registrationInfo[34]=diabetes;
		registrationInfo[35]=drink_alcohol;
		
		registrationInfo[36]=headaches_severe;
		registrationInfo[37]=high_blood_pressure;
		registrationInfo[38]=hospitalization;
		registrationInfo[39]=liver_disease_or_hepatitis;
		registrationInfo[40]=mononucleosis;
		registrationInfo[41]=psychiatric_problems;
		registrationInfo[42]=stomach_or_intestinal_problems;
		registrationInfo[43]=substance_abuse;
		registrationInfo[44]=thrombophlebitis_or_blood_clots;
		registrationInfo[45]=tuberculosis_or_positive_TB_skin_test;	
		
		registrationInfo[46]=cut_down_drinking_alcohol;
		registrationInfo[47]=drugs;
		registrationInfo[48]=sleep_problems;
		registrationInfo[49]=sad_or_depressed;
		registrationInfo[50]=regular_physical_exercise;
		registrationInfo[51]=sexually_active;
		registrationInfo[52]=safe_sex;
		
		registrationInfo[48]=sleep_problems;
		registrationInfo[49]=sad_or_depressed;
		registrationInfo[50]=regular_physical_exercise;
		registrationInfo[51]=sexually_active;
		registrationInfo[52]=safe_sex;
		
		registrationInfo[53]=checkboxModel_value1;
		registrationInfo[54]=checkboxModel_value2;
		registrationInfo[55]=checkboxModel_value3;
		registrationInfo[56]=checkboxModel_value4;
		registrationInfo[57]=checkboxModel_value5;
		registrationInfo[58]=checkboxModel_value6;
		
		registrationInfo[59]=comments_breast_problems;
		registrationInfo[60]=comments;
		console.log(registrationInfo);	
		$state.go('family_history');
		
	}
})


////////////////////////////////////////////////////////////////////////////
////////// family history controller template -familyHistory.html /////////
//////////////////////////////////////////////////////////////////////////
routerApp.controller('familyHistoryController',function($scope,$http,$uibModal){
	console.log("inside familyHistoryController");

	
	$scope.familyHistorySave=function(){
		var comments_fm= document.getElementById("comments_fm").value;
		var fm_alcoholism= "no";
		var fm_cancer= "no";
		var fm_epilepsy_seizures= "no";
		var fm_high_blood_pressure= "no";
		var fm_migraine_headaches= "no";
		var fm_nervous_breakdown= "no";
		
		var fm_stroke= "no";
		var fm_psychiatric_problems= "no";
		var fm_bleeding_problems= "no";
		var fm_diabetes_high_blood_sugar= "no";
		var fm_heart_disease= "no";
		var fm_other= "no";
		
		var fm_high_cholesterol= "no";
		var fm_sickle_cell_disease= "no";
		var fm_thyroid_disease= "no";
		var fm_tuberculosis= "no";
		var fm_arthritis= "no";
		
		if (document.getElementById('fm_high_cholesterol_yes').checked) {
  		fm_high_cholesterol = "yes";
  		}
  		
  		if (document.getElementById('fm_sickle_cell_disease_yes').checked) {
  		fm_sickle_cell_disease = "yes";
  		}

  		if (document.getElementById('fm_thyroid_disease_yes').checked) {
  		fm_thyroid_disease = "yes";
  		}

  		if (document.getElementById('fm_tuberculosis_yes').checked) {
  		fm_tuberculosis = "yes";
  		}

  		if (document.getElementById('fm_arthritis_yes').checked) {
  		fm_arthritis = "yes";
  		}
  		
		if (document.getElementById('fm_alcoholism_yes').checked) {
  		fm_alcoholism = "yes";
  		}
  		
  		if (document.getElementById('fm_cancer_yes').checked) {
  		fm_cancer = "yes";
  		}

  		if (document.getElementById('fm_epilepsy_seizures_yes').checked) {
  		fm_epilepsy_seizures = "yes";
  		}

  		if (document.getElementById('fm_high_blood_pressure_yes').checked) {
  		fm_high_blood_pressure = "yes";
  		}

  		if (document.getElementById('fm_migraine_headaches_yes').checked) {
  		fm_migraine_headaches = "yes";
  		}

  		if (document.getElementById('fm_nervous_breakdown_yes').checked) {
  		fm_nervous_breakdown = "yes";
  		}

		if (document.getElementById('fm_stroke_yes').checked) {
  		fm_stroke = "yes";
  		}
  		
  		if (document.getElementById('fm_psychiatric_problems_yes').checked) {
  		fm_psychiatric_problems = "yes";
  		}

  		if (document.getElementById('fm_bleeding_problems_yes').checked) {
  		fm_bleeding_problems = "yes";
  		}

  		if (document.getElementById('fm_diabetes_high_blood_sugar_yes').checked) {
  		fm_diabetes_high_blood_sugar = "yes";
  		}

  		if (document.getElementById('fm_heart_disease_yes').checked) {
  		fm_heart_disease = "yes";
  		}

  		if (document.getElementById('fm_other_yes').checked) {
  		fm_other = "yes";
  		}

  		
  		registrationInfo[61]=comments_fm;
		registrationInfo[62]=fm_alcoholism;
		registrationInfo[63]=fm_cancer;
		registrationInfo[64]=fm_epilepsy_seizures;
		registrationInfo[65]=fm_high_blood_pressure;
		registrationInfo[66]=fm_migraine_headaches;
		registrationInfo[67]=fm_nervous_breakdown;
		
		registrationInfo[68]=fm_stroke;
		registrationInfo[69]=fm_psychiatric_problems;
		registrationInfo[70]=fm_bleeding_problems;
		registrationInfo[71]=fm_diabetes_high_blood_sugar;
		registrationInfo[72]=fm_heart_disease;
		registrationInfo[73]=fm_other;
		
		registrationInfo[74]=fm_high_cholesterol;
		registrationInfo[75]=fm_sickle_cell_disease;
		registrationInfo[76]=fm_thyroid_disease;
		registrationInfo[77]=fm_tuberculosis;
		registrationInfo[78]=fm_arthritis;
		

      var data=
                 {
      "_id": userName,
      "password": registrationInfo[1],
         "name": {
           "first_name": registrationInfo[2],
           "last_name": registrationInfo[7]
        },
      "address": {
         "street": registrationInfo[4],
        "city": registrationInfo[8],
        "state": registrationInfo[14],
        "zip": registrationInfo[15],
        "county": registrationInfo[10],
        "country": registrationInfo[5]
      },
      "user_type": registrationInfo[11],
      "phone_number": registrationInfo[13],
      "doctor_id": registrationInfo[6],
	  "medical_record": {
         "ethnicity": registrationInfo[9],
         "gender": registrationInfo[12],
         "age": registrationInfo[3],
         "family_medical_history": {
            "alcoholism": registrationInfo[62],
            "cancer": registrationInfo[63],
            "epilepsy_seizures": registrationInfo[64],
            "high_blood_pressure": registrationInfo[65],
            "migraine_headaches": registrationInfo[66],
            "stroke": registrationInfo[68],
            "psychiatric_problems": registrationInfo[69],
            "bleeding_problems": registrationInfo[70],
            "diabetes_high_blood_sugar": registrationInfo[71],
            "heart_disease": registrationInfo[72],
            "high_cholesterol": registrationInfo[74],
            "sickle_cell_disease": registrationInfo[75],
            "thyroid_disease": registrationInfo[76],
            "tuberculosis": registrationInfo[77],
            "arthritis": registrationInfo[78],
            "nervous_breakdown": registrationInfo[67],
            "other": registrationInfo[73],
            "comments": registrationInfo[61]
         },
         "personal_medical_history": {
            "alcoholism": registrationInfo[16],
            "anemia": registrationInfo[17],
            "asthma": registrationInfo[18],
            "concussion": registrationInfo[19],
            "eating_disorder": registrationInfo[20],
            "heart_disease": registrationInfo[21],
            "high_cholesterol": registrationInfo[22],
            "kidney_or_bladder_problems": registrationInfo[23],
            "loss_of_consciousness": registrationInfo[24],
            "overweight_or_obesity": registrationInfo[25],
            "seizures_or_convulsions": registrationInfo[26],
            "stroke": registrationInfo[27],
            "surgery": registrationInfo[28],
            "thyroid_problems": registrationInfo[29],
            "allergies": registrationInfo[30],
            "anxiety_or_panic_attack": registrationInfo[31],
            "cancer_or_tumor": registrationInfo[32],
            "diabetes": registrationInfo[33],
            "headaches_severe": registrationInfo[34],
            "high_blood_pressure": registrationInfo[35],
            "hospitalization": registrationInfo[36],
            "liver_disease_or_hepatitis": registrationInfo[37],
            "mononucleosis": registrationInfo[38],
            "psychiatric_problems": registrationInfo[39],
            "stomach_or_intestinal_problems": registrationInfo[40],
            "substance_abuse": registrationInfo[41],
            "thrombophlebitis_or_blood_clots": registrationInfo[42],
            "tuberculosis_or_positive_TB_skin_test": registrationInfo[43],
            "smoke": registrationInfo[44],
            "drink_alcohol": registrationInfo[45],
            "cut_down_drinking_alcohol": registrationInfo[46],
            "drugs": registrationInfo[47],
            "sleep_problems": registrationInfo[48],
            "sad_or_depressed": registrationInfo[49],
            "regular_physical_exercise": registrationInfo[50],
            "sexually_active": registrationInfo[51],
            "safe_sex": registrationInfo[52],
            "chlamydia": registrationInfo[53],
            "gonorrhea": registrationInfo[54],
            "herpes": registrationInfo[55],
            "genital_warts": registrationInfo[56],
            "syphilis": registrationInfo[57],
            "trichomonas": registrationInfo[58],
            "other": registrationInfo[73],
            "comments": registrationInfo[60],
            "comments_breast_problems": registrationInfo[59]
         }
      },
      "google_calendar_token" : userCookie.tokens
     
   }
				 console.log(data);
         $http({
           method:'post',
           url:'https://remote-health-api.herokuapp.com/api/users',
           data:data
         }).then(function(response){
         console.log("response");
            console.log(response);
           
            //
             $scope.statusMessage="User has been added. Thanks for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
            destroyCookie();
             $window.location.href = "/";
         },function(error){
            console.log("err");
            console.log(error);
           
             $scope.statusMessage="Some error occurred. Thank you for using Remote Health Assist"
            $uibModal.open({
              scope: $scope,
              templateUrl: 'templates/modal.html',
              resolve: {
                statusMessage: function() {
                  return $scope.statusMessage;
                }
              }
            })
            destroyCookie();
            $window.location.href = "/";
         });
	}
})



