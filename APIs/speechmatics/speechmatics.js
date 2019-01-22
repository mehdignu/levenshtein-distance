var fs = require('fs');
var http = require('http');
var url = require('url');
var cp = require('child_process');
var request = require('request');
var performance = require('perf_hooks');
var levenshtein = require("../../levenshtein-distance/distance.js");
var results = require("../../utils/results.js");


global.arguments; //necesary arguments from the user
global.server; //server instance
global.jobID; //processing job ID
global.start; //start date of the speechmatics process
global.end; //start date of the speechmatics process


/**
 * check if json object is empty or not
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * extract the Transcription text result from the json object
 * @param json
 * @returns {string}
 */
function getWords(json) {

    if (!isEmpty(json)) {

        var str = "";

        for (var i = 0; i < json.length; i++) {

            if (i === json.length) {
                str += json[i].name;
            } else {
                str += json[i].name + " ";
            }

        }
        return str;

    } else {

        return "";

    }
}

/**
 * download a processed transcription
 */
function getTranscription() {

    //API CALL: Download transcription by job ID.
    var apiDownloadURL = 'https://api.speechmatics.com/v1.0/user/' + global.arguments.userId + '/jobs/' + global.jobID + '/transcript?auth_token=' + global.arguments.authToken;

    request(apiDownloadURL, function (error, response, body) {

        if (error) {
            return console.log('\nREQUEST ERROR:', error);
        }

        try {

            var json = JSON.parse(body);
            if (json['error']) {
                return console.log('\nAPI ERROR', json['error']);
            }
        } catch (parseError) {
            return console.log('\nPARSE ERROR', parseError);
        }

        global.end = new Date().getTime();

        var speed = (global.end - global.start) / 1000;

        var textResult = getWords(json["words"]);

        //print the result of the testing
        results.print(speed, textResult, "Speechmatics testing results", global.arguments);

        global.server.close();

    });
}

/**
 * upload and process an audio file
 */
function postAudio() {

    var formData = {
        diarisation: 'true',
        model: global.arguments.languageSC,
        data_file: fs.createReadStream(global.arguments.file),
        notification: 'callback',
        callback: global.arguments.callbackUrl
    }

    //API CALL: Upload file for transcription.
    var apiUploadURL = 'https://api.speechmatics.com/v1.0/user/' + global.arguments.userId + '/jobs/?auth_token=' + global.arguments.authToken;

    //start measuring speed
    global.start = new Date().getTime();

    var jobID = request.post({url: apiUploadURL, formData: formData}, function (error, response, body) {
        if (error) {
            return console.log('\nREQUEST ERROR:', error);
        }

        try {
            var json = JSON.parse(body);
            if (json['error']) {
                return console.log('\nAPI ERROR', json['error']);
            }
        } catch (parseError) {
            return console.log('\nPARSE ERROR', parseError);
        }


        //save the job id to retrieve the result later
        global.jobID = json['id'];

    });
}

/**
 * listen for callback notification when the processing of the audio file is finished
 * @param request
 * @param response
 */
function onRequest(request, response) {

    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end();

    getTranscription();

}


/**
 * main method to start testing the Speechmatics API
 * @param settings
 */
exports.start = function (settings) {

    //save the arguments settings
    global.arguments = settings;

    //start the server to recieve notification when the transcription finishes
    global.server = http.createServer(onRequest).listen(global.arguments.port);

    //start processing the file
    postAudio();

};