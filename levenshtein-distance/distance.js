var xlsx = require('xlsx');
var path = require("path");

/**
 * calculate the levenshtein distance between two words
 * @param word1
 * @param word2
 * @returns {*}
 */
function distance(word1, word2) {

    if (word1.length === 0) return word2.length;
    if (word2.length === 0) return word1.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= word2.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= word1.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= word2.length; i++) {
        for (j = 1; j <= word1.length; j++) {
            if (b.charAt(i - 1) == word1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }


    return matrix[word2.length][word1.length];

}

/**
 * extract the correct transcription text from the source .xls file
 * @param fileName
 * @param transcriptionTargetFile
 * @returns {*}
 */
function getCorrectTranscriptionText(fileName, transcriptionTargetFile) {

    var audioFileTitle = path.basename(fileName);

    const workbook = xlsx.readFile(transcriptionTargetFile);
    const sheet_name_list = workbook.SheetNames;

    var transcriptions = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    var correctTranscriptionText;
    for (var i = 0; i < transcriptions.length; i++) {
        if (transcriptions[i]["File Mapping 1"].substring(1) === audioFileTitle.substring(1)) {
            correctTranscriptionText = transcriptions[i]["True Transcription"];
            break;
        }
    }

    return correctTranscriptionText;
}

exports.measure = function (apiTranscription, settings) {

    //get the correct transcription text
    correctTranscription = getCorrectTranscriptionText(settings.file, settings.transcriptionTargetFile);

    //print out the correct and APIs transcription text
    console.log("correct transcription: " + correctTranscription);
    console.log("APIs transcription: " + apiTranscription);


    //remove non alphabets caracters
    apiTranscription = apiTranscription.replace(/[^0-9a-z-\u00C0-\u017F]/gi, ' ');
    correctTranscription = correctTranscription.replace(/[^0-9a-z-\u00C0-\u017F]/gi, ' ');

    //remove multiple whitespaces
    apiTranscription = apiTranscription.replace(/\s+/g, ' ').split(' ');
    correctTranscription = correctTranscription.replace(/\s+/g, ' ').split(' ');


    //find the max length of the two texts
    var maxLength = ((apiTranscription.length > correctTranscription.length) ? apiTranscription.length : correctTranscription.length);

    var count = 0; // levenshtein distance
    var acc = 0; // levenshtein distance modified into percentage

    //break the two sentences into words and calculate the distance
    for (var i = 0; i < maxLength; i++) {
        var s1 = ((typeof apiTranscription[i] === 'undefined') ? " " : apiTranscription[i]);
        var s2 = ((typeof correctTranscription[i] === 'undefined') ? " " : correctTranscription[i]);

        // Percentage rank of Levenshtein Distance matching
        acc += 1 - distance(s1, s2) / Math.max(s1.length, s2.length);

        count += distance(s1, s2);
    }

    return acc * 10;
};