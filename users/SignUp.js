const router = require('express').Router();
const LogRecording = require('../logs/log');
const userCollection = require('../database/mongodb').user;
const util = require('util');
const bcrypt = require('bcrypt');

const hashSeed = 10;

router.get("/", function(req, res){
    res.send(`
    <html>
    <body>
        <form action="/users/SignUp" method="POST">
            Account : <input type="text" name="account"><br>
            Password: <input type="password" name="password">
            <input type="submit" value="Submit">
        </form> 
    </body>
    </html>
    `);
});

router.post("/", function(req, res){
    const userInfo = { account:req.body.account, password: req.body.password };
    userCollection.findOne({ "account" : req.body.account }, (err, user) => {
        if (err) throw err;
        if(user == null){
            // null -> create new account
            userCollection.create(userInfo, (err, result) => {
                if (err) throw err;
                // User Create Log
                LogRecording(Date.now(), util.format("New Account %s Created.", userInfo.account), "Users");
                console.log("A new account has been created!");
                res.send("A new account has been created!");
            });
        } else {
            // not null -> account has been used
            LogRecording(Date.now(), util.format("Account '%s' has been Created before.", userInfo.account), "Users");
            console.log("Account has been used!");
            res.send("Account has been used!");
        }
    });
});

module.exports = router;