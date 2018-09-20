var request = require("request");

var ELASTICSEARCH_HOSTNAME      = "https://search-diseases-symptoms-pyhhcjkict7d5ksiazurzo4m2a.us-west-2.es.amazonaws.com";
var ELASTICSEARCH_API           = "/diseases/api/_search";
var ELASTICSEARCH_QUERY_PARAMS  = "?pretty=true&q=symptoms:headache";
var GOOGLE_USER_INFO            = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=";

function makeRequest(url, callback){
    makeGETRequest(url, function(){
        
    });
}

function makeGETRequest(url, callback){
    //var url = ELASTICSEARCH_HOSTNAME + ELASTICSEARCH_API + ELASTICSEARCH_QUERY_PARAMS;
    request.get(url, function(error, response, body) {
        var d = JSON.parse(body);
        // console.log("REQUEST BODY: " + body);
        // console.log("REQUEST RESPONSE: " + response);
        // console.log("REQUEST ERROR: " + error);
        callback(body);
    });
}

function makePOSTRequest(url, data, callback){
    var options = {  
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        form : data
    };
    console.log("OPTIONS: " + JSON.stringify(options));
    console.log("DATA: " + JSON.stringify(data));

    request(options, function(err, res, body) {  
        console.log("POST REQUEST BODY: " + body);
        console.log("POST REQUEST RESPONSE: " + JSON.stringify(res));
        console.log("POST REQUEST ERROR: " + err);
        callback(err, body);
    });
}

module.exports = {makeGETRequest, makePOSTRequest};

//https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=ya29.GlvfBF-BKZPlNOS4Qx0wfLasXS1yvOxYdldUWwogYGsBzEdFcI-5jjBTakKO7lJf6fg-g8L-UDz2S_LCVaSwH1Prf4ej2Iin9sAmapZQhERsC1H8AAkMUMiCRprX



// var request = require("request");

// request({
//   uri: "http://www.cjihrig.com/development/php/hello_form.php",
//   method: "POST",
//   form: {
//     name: "Bob"
//   }
// }, function(error, response, body) {
//   console.log(body);
// });