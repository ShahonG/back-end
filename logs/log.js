const logCollection = require('../database/mongodb').log;
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

module.exports = function LogRecording(time, content, type){
    logCollection.create({
        time : time,
        content : content,
        type : type
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(util.format("LOG RECORD : [%s] [%s] [%s]", time, content, type));
        }
    });
};