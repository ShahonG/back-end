const Mongodb = require('mongodb');
const MongoCli = require('mongodb').MongoClient;
const md5 = require('md5');
const bodyParser = require('body-parser');
const express = require('express');

const url = "mongodb://127.0.0.1:27017/";
const app = express();
var db;

MongoCli.connect(url, (err, mongo) => {
    if (err) throw err;
    db = mongo;
    app.listen(3000);
    console.log("Listening on port 3000");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.send(`
    <html>
    <body>
    <form action="/Login" method="POST">
    Account : <input type="text" name="account">  <br>
    Password: <input type="text" name="password">
    <input type="submit" value="Submit">

    </form>
    </body>
    </html>`
    );
});

app.post("/Login", function (req, res) {
    var userInfo = {account:req.body.account, password: md5(req.body.password)};
    dbo = db.db("testdb");
    dbo.collection("users").findOne(userInfo, function(err, result){
        if(err) throw err;
        if(result == null){
            res.send("Wrong account or password!");
            console.log("Wrong account or password!");
        }
        else{
            res.send("Login Success!");
            console.log("Login Success!");
        }
    });
});