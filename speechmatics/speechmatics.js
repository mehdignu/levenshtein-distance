/* GET MODULES AND HANDLE COMMAND LINE OPTIONS */
var fs = require('fs');
var http = require('http');
var url = require('url');
var cp = require('child_process');
var request = require('request');
const {performance} = require('perf_hooks');

global.arguments; //necesary arguments from the user
global.jobID; //processing job ID
global.start; //start date of the speechmatics process
global.end; //start date of the speechmatics process

/* --- DOWNLOAD a processed transcription --- */
function getTranscription() {

    //API CALL: Download transcription by job ID.
    var apiDownloadURL = 'https://api.speechmatics.com/v1.0/user/' + global.arguments.i + '/jobs/' + global.jobID + '/transcript?auth_token=' + global.arguments.t;

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

        console.log('\nSpeechmatics transcript downloaded. Transcript data:', json);

        var speed = (global.end - global.start) / 1000;

        console.log("Speechmatics took " + speed + " seconds.")

    });
}

function postAudio() {

    var formData = {
        diarisation: 'true',
        model: global.arguments.l,
        data_file: fs.createReadStream(global.arguments.f),
        notification: 'callback',
        callback: global.arguments.c
    }

    //API CALL: Upload file for transcription.
    var apiUploadURL = 'https://api.speechmatics.com/v1.0/user/' + global.arguments.i + '/jobs/?auth_token=' + global.arguments.t;

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

        console.log('\nSpeechmatics job uploaded. Job ID:', json['id']);

        global.jobID = json['id'];

    });
}

function onRequest(request, response) {
    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end();

    getTranscription();
}


exports.start = function () {

    //start the server to recieve notification when the transcription finishes
    http.createServer(onRequest).listen(8880);
    console.log('Server started');


    //show how the software should be used
    try {
        var epilogueMessage = 'Documentation at https://www.speechmatics.com/api-details';

        var yargs = require('yargs')
                .usage('Usage: $0 <command> <options>')
                .command('test', 'Upload an audio file for testing')
                .demand(1, 'ERROR: Must provide a valid command.')
                .epilogue(epilogueMessage),
            argv = yargs.argv,
            command = argv._[0];
    } catch (e) {
        console.log("\nError: Cannot find module 'yargs'. Install with 'npm install yargs'.");
        process.exit();
    }

    /* --- UPLOAD an audio file for processing --- */
    if (command === 'test') {

        //Handle command line options.
        yargs.reset()
            .usage('Usage: $0 upload <options>')
            .example('$0 upload -f example.mp3 -l en-US -i $MY_API_USER_ID -t $MY_API_AUTH_TOKEN -c $MY_CALLBACK_URL')
            .demand(['f', 'l', 'i', 't', 'c'])
            .describe({
                'f': 'File to transcribe',
                'l': 'Language to use (e.g. en-US)',
                'i': 'API User Id',
                't': 'API Auth Token',
                'c': 'Callback url to use'
            })
            .help('h', 'display this help')
            .epilogue(epilogueMessage)
            .argv

        global.arguments = argv;

        postAudio();

    } else {
        yargs.showHelp();
    }

};