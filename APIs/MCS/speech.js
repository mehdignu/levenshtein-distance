var sdk = require("microsoft-cognitiveservices-speech-sdk");
var results = require("../../utils/results.js");

global.arguments;

(function () {
    "use strict";

    module.exports = {
        main: function (settings, audioStream) {

            var start = new Date().getTime();
            global.arguments = settings;

            // now create the audio-config pointing to our stream and
            // the speech config specifying the language.
            var audioConfig = sdk.AudioConfig.fromStreamInput(audioStream);
            var speechConfig = sdk.SpeechConfig.fromSubscription(settings.subscriptionKey, settings.serviceRegion);

            // setting the recognition language to English.
            speechConfig.speechRecognitionLanguage = settings.languageMCS;

            // create the speech recognizer.
            var reco = new sdk.SpeechRecognizer(speechConfig, audioConfig);

            // start the recognizer and wait for a result.
            reco.recognizeOnceAsync(
                function (result) {

                    reco.close();
                    reco = undefined;

                    //print the speed and accuracy
                    results.print(((new Date().getTime()) - start) / 1000, result.privText, "Microsoft testing results", global.arguments);

                },
                function (err) {
                    reco.close();
                    reco = undefined;
                });
        }

    }
}());
