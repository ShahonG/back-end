const LogRecording = require('../logs/log');
const util = require('util');
const md5 = require('md5');

module.exports = function(app, dbs){
    app.get("/", function(req, res){
        res.send(`
        <html>
        <body>
            <form action="/SignUp" method="POST">
                Account : <input type="text" name="account"><br>
                Password: <input type="text" name="password">
                <input type="submit" value="Submit">
            </form> 
        </body>
        </html>
        `);
    });

    app.post("/", function(req, res){
        var userInfo = {account:req.body.account, password: md5(req.body.password)};
        dbs.testdb.collection("users").findOne({account:req.body.account}, function(err, result){
            if (err) throw err;
            if(result != null){
                res.send("Account has been used!");
            }
        });
        dbs.testdb.collection("users").insertOne(userInfo, function(err, result){
            if (err) throw err;
            // User Create Log
            LogRecording(Date.now(), util.format("New Account %s Created.", userInfo.account), "Users");
            console.log("A new account has been created!");
            res.send("A new account has been created!");
        });
    });
}