const MongoCli = require('mongodb').MongoClient;
const md5 = require('md5');
const bodyParser = require('body-parser');
const express = require('express');

const url = "mongodb://127.0.0.1:27017/";
const app = express();
var db;
const dbName = 'testdb'
MongoCli.connect(url, (err, mongo) => {
    if (err) throw err;
    db = mongo;
    app.listen(3000);
    console.log("Listening on port 3000");
});

app.use(bodyParser.urlencoded({ extended: true }));


// Users DB
    // User Login page with create user button
app.get("/", function (req, res) {
    res.send(`
    <html>
    <body>
        <form action="/Login" method="POST">
            Account : <input type="text" name="account">  <br>
            Password: <input type="text" name="password">
            <input type="submit" value="Submit">

        </form>
        <form action="/Login" method="GET">
            <input type="submit" value="NewAccount">
        </form>
    </body>
    </html>`
    );
});

    // User Login
app.post("/Login", function (req, res) {
    var userInfo = {account:req.body.account, password: md5(req.body.password)};
    dbo = db.db(dbName);
    dbo.collection("users").findOne(userInfo, function(err, result){
        if (err) throw err;
        if (result == null){
            // Login Log
            LogRecording(Date.now(), sprintf("Account %s Login FAILED.", userInfo.account), "Login");
            res.send("Wrong account or password!");
            console.log("Wrong account or password!");
        }
        else{
            // Login Log
            LogRecording(Date.now(), sprintf("Account %s Login SUCCESS.", userInfo.account), "Login");
            res.send("Login Success!");
            console.log("Login Success!");
        }
    });
});

    // Create User page
app.get("NewAccount", function(req, res){
    res.send(`
    <html>
    <body>
        <form action="/Register" method="POST">
            Account : <input type="text" name="account"><br>
            Password: <input type="text" name="password">
            <input type="submit" value="Submit">
        </form> 
    </body>
    </html>
    `);
})

    // Create User
app.post("/Register", function (req, res) {
    var userInfo = {account:req.body.account, password: md5(req.body.password)};
    dbo = db.db(dbName);
    dbo.collection("users").findOne({account:req.body.account}, function(err, result){
        if (err) throw err;
        if(result != null){
            res.send("Account has been used!");
        }
    });
    dbo.collection("users").insertOne(userInfo, function(err, result){
        if (err) throw err;
        // User Create Log
        LogRecording(Date.now(), sprintf("New Account %s Created.", userInfo.account), "Users");
        console.log("A new account has been created!");
        res.send("A new account has been created!");
    });
});

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