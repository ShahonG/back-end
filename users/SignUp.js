const router = require('express').Router();
const LogRecording = require('../logs/log');
const userCollection = require('../database/mongodb').user;
const util = require('util');
const crypto = require('crypto');

router.get("/", function(req, res){
    res.send(`
    <html>
    <body>
        <p>Sign up</p>
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
    const hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
    //console.log(hash);
    const userInfo = { account:req.body.account, password: hash };
    userCollection.findOne({ "account" : req.body.account }, (err, user) => {
        if (err) throw err;
        if(user == null){
            // null -> create new account
            userCollection.create(userInfo, (err, result) => {
                if (err) throw err;
                // User Create Log
                LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}), 
                                util.format("New Account %s Created.", userInfo.account), 
                                "\x1b[31mUsers.SignUp\x1b[0m"
                            );
                console.log("A new account has been created!");
                res.send("A new account has been created!");
            });
        } else {
            // not null -> account has been used
            LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}), 
                            util.format("Account '%s' has been Created before.", userInfo.account),
                            "\x1b[31mUsers.SignUp\x1b[0m"
                        );
            console.log("Account has been used!");
            res.send("Account has been used!");
        }
    });
});

module.exports = router;