const util = require('util');
/*
var markdown = {
    version : 1,
    doc : {
        type : "paragraph",
        content : [{
            type : "text",
            text : "A tiny paragraph to start"
        }]
    }
};
*/

module.exports = function LogRecording(time, content, type, dbs){
    dbs.testdb.collection("log").insertOne({time: time, cotent: content, type: type}, function(err, result){
        if (err) throw err;
        console.log(util.format("LOG RECORD : [%s] [%s] [%s]", time, content, type));
    });
};