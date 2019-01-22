var levenshtein = require("../levenshtein-distance/distance.js");

/**
 * print the test results
 * @param speed
 * @param result
 * @param header
 * @param arguments
 */
exports.print = function (speed, result, header, arguments) {

    //print the header
    console.log('\x1b[36m%s\x1b[0m', header);

    //print the test speed
    console.log("Speed : " + speed + " seconds");

    //print the test accuracy
    console.log("Accuracy : " + levenshtein.measure(result, arguments) + " %");

};