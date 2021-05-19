const express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.send(`
    <html>
    <body>
        <form action="/" method="POST">
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

router.post("/", function(req, res){
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

module.exports = router;