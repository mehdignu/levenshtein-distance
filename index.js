var mcs = require('./APIs/MCS/index.js');
var sc = require('./APIs/speechmatics/speechmatics.js');
var settings = require("./config/settings.js");

//start the testing of the speechsematics API
sc.start(settings);

//start the testing of the Microsoft Cognitive Speech API
mcs.start(settings);