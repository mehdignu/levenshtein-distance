var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");

var settings = require("../../config/settings");
var speech = require("./speech");


function openPushStream(filename) {
    // create the push stream we need for the speech sdk.
    var pushStream = sdk.AudioInputStream.createPushStream();

    // open the file and push it to the push stream.
    fs.createReadStream(filename).on('data', function (arrayBuffer) {
        pushStream.write(arrayBuffer.buffer);
    }).on('end', function () {
        pushStream.close();
    });

    return pushStream;
}

exports.start = function (settings) {

    speech.main(settings, openPushStream(settings.file));

};