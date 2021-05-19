const md5 = require('md5');
const bodyParser = require('body-parser');
const express = require('express');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// database part
app.use("/database", require("./database/connect"));

// user part
app.use("/Login", require("./users/Login"));
app.use("/SignUp", require("./users/SignUp"));

app.listen(3000);
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

function LogRecording(time, content, type){
    dbo = db.db(dbName);
    dbo.collection("log").insertOne({time: time, cotent: content, type: type}, function(err, result){
        if (err) throw err;
        console.log(sprintf("LOG RECORD : [%s] [%s] [%s]", time, content, type));
    });
};