var user_email = "";

function generateGoogleOauthUrl(){
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var res = JSON.parse(this.responseText);
	    	document.getElementById("googlesubmit").href = res.authUrl;
	    }
  	};
  	xhttp.open("GET", "https://remote-health-api.herokuapp.com/authenticate", true);
  	xhttp.send();
}

// function samplePostRequest(){
// 	var email = $("email").val();
// 	var password = $("password").val();
// 	var confirm_password = $("confirm_password").val();
// 	var json = {
// 		"email" : email,
// 		"password" : password,
// 		"confirm_password" : confirm_password
// 	};
// 	console.log(json);
// 	var xhttp = new XMLHttpRequest();
//   	xhttp.onreadystatechange = function() {
// 	    if (this.readyState == 4) {
// 	    	if(this.status == 201){
// 	    		window.location = "/dashboard.html"
// 	    	}else if(this.status == 500){
// 	    		console.log("There was an error with the submission of the form.")
// 	    	}
// 	    }
//   	};
//   	xhttp.open("POST", "/api/test", true);
//   	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
// 	xhttp.send(json);
//   	//xhttp.send();
// }

function sampleAjaxPostRequest(){
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	var confirm_password = document.getElementById("confirm_password").value;
	var json = {
		"email" : email,
		"password" : password,
		"confirm_password" : confirm_password
	};
	console.log(json);
	$.post("/api/test", json,
        function(data,status){
            //alert("Data: " + JSON.stringify(data) + "\nStatus: " + status);
            if(status == "success" && data.message == "User created!"){
            	window.location = "/dashboard.html";
            }
        });
}

function populateUserFromCookie(){
	var cookies= document.cookie.split(';');
	for (var i = 0 ; i < cookies.length; i++) {
	    var cur_cookie = cookies[i].trim();
	    if(cur_cookie.startsWith("remoteHealthUserEmail")){
	    	user_email = decodeURIComponent(cur_cookie.split("=")[1]);
	    }
	}
}

function div_show() {
	document.getElementById('googleAccess').style.display = "block";
}

function div_hide(){
	document.getElementById('googleAccess').style.display = "none";
}

function autopopulate_email(){
	document.getElementById('email').value = user_email;
}

$(document).ready(function(){
	populateUserFromCookie();
	if(document.getElementById("googlesubmit")){
		generateGoogleOauthUrl();
	}

	if(document.getElementById("email")){
		autopopulate_email();
	}
});