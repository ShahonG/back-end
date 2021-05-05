const MongoCli = require('mongodb').MongoClient;
const md5 = require('md5');

const url = "mongodb://127.0.0.1:27017/";

MongoCli.connect(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db("testdb");
    var userInfo = { account: '1234', password: '5678'};
    userInfo.password = md5(userInfo.password);
    console.log(userInfo);
    dbo.collection("users").findOne(userInfo, function(err, result){
        if (err){
            console.log("System Failed!");
            throw err;
        }
        if(result == null){
            console.log("Wrong account or password!\n");
        }
        else{
            console.log("Login Success!\n");
        }
        db.close();
    });
});

// LoginInterface(account, password){ };
