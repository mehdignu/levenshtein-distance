(function () {
    "use strict";

    module.exports = {

        /* Microsoft Cognitive Speech settings */
        subscriptionKey: "39c5baba08104efd89de3ea836ccd9bf",
        serviceRegion: "westus", // e.g., "westus"
        languageMCS: "de-DE",

        /* Speechmatics settings */
        userId: "57473",
        authToken: "N2FiNmM0OTUtMGQwOS00MzQ5LTliOTUtMjEwYjI3MjhiMGZl",
        callbackUrl: "http://mehdi-dridi.de:8880",
        port: "8880",
        languageSC: "de",
        
        /* global settings */
        file: "/var/www/html/levenshtein-distance-js/Testdata/audio/R_utterance04.wav", // Audio file to be tested
        transcriptionTargetFile: "/var/www/html/levenshtein-distance-js/Testdata/TargetTranscription.xls", //.xls file containing the transcription

    };
}());

