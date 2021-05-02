const MongoCli = require('mongodb').MongoClient;

const url = "mongodb://127.0.0.1:27017/";

MongoCli.connect(url, (err, db) => {
    if (err) throw err;
    
    var dbo = db.db("testdb");

    dbo.createCollection("users", (err, res) => {
        if (err) throw err;

        console.log("Collection created");

        db.close();
    });
});