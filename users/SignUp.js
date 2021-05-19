const express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.send(`
    <html>
    <body>
        <form action="/" method="POST">
            Account : <input type="text" name="account"><br>
            Password: <input type="text" name="password">
            <input type="submit" value="Submit">
        </form> 
    </body>
    </html>
    `);
});

router.post("/", function(req, res){
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

module.exports = router;