const MongoCli = require('mongodb').MongoClient;
const express = require('express');
var router = express.Router();

const url = "mongodb://127.0.0.1:27017/";
const dbName = 'testdb';
var db;

// connect to Database
router.all('*', function(req, res, next){
    MongoCli.connect(url, (err, database) => {
        if (err) throw err;
        db = database;
        console.log("Connected to db");
    });    
});

module.exports = router;