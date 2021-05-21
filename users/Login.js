const LogRecording = require('../logs/log');
const util = require('util');
const md5 = require('md5');

module.exports = function(app, dbs){
    app.get("/Login", function(req, res){
        res.send(`
        <html>
        <body>
            <form action="/Login" method="POST">
                Account : <input type="text" name="account">  <br>
                Password: <input type="text" name="password">
                <input type="submit" value="Submit">
    
            </form>
            <form action="/SignUp" method="GET">
                <input type="submit" value="NewAccount">
            </form>
        </body>
        </html>`
        );
    });
    
    app.post("/Login", function(req, res){
        /*
        json = {
            account: "YOUR_ACCOUNT",
            password: "YOUR_PASSWORD"
        }
        */
        var userInfo = {account: req.body.account, password: req.body.password};
        dbs.testdb.collection("users").findOne(userInfo, function(err, result){
            if (err) throw err;
            if (result == null){
                // Login Log
                LogRecording(Date.now(), util.format("Account `%s` Login FAILED.", userInfo.account), "Login", dbs);
                res.send("Wrong account or password!");
                console.log("Wrong account or password!");
            }
            else{
                // Login Log
                LogRecording(Date.now(), util.format("Account `%s` Login SUCCESS.", userInfo.account), "Login", dbs);
                res.send("Login Success!");
                console.log("Login Success!");
            }
        });
    });    
};