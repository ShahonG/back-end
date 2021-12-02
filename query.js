const router = require("express").Router();
const userCollection = require('./database/mongodb').user;

router.post("/", (req, res) => { 
    let account = req.body.account;
    let name = req.body.name;
    console.log(account);
    if (req.body.cmd === 'addFile') {
        userCollection.updateOne({ account: account }, { $push: { fileList: { namespace: "namespace1/project1", room: name, tags: [] }} } , (err, r)=> {
            if (err) throw err;
            else {
                console.log(r);
                userCollection.findOne({ account: account }, (err, r) => {
                    if (err) throw err;
                    else {
                        return res.send(r);
                    }
                });
            }
        });

    }
    else if (req.body.cmd === 'deleteFile') {
        userCollection.updateOne({ account: account }, { $pull: { "fileList": { room: name } } }, (err, r) => {
            if (err) throw err;
            else {
                console.log(r);
                userCollection.findOne({ account: account }, (err, r) => {
                    if (err) throw err;
                    else {
                        return res.send(r);
                    }
                });
            }
        });
    }
    else if (req.body.cmd === 'addUser') {
        userCollection.updateOne({ account: name.newUser }, { $push: { "fileList": name.file } }, (err, r) => {
            if (err) throw err;
            else {
                console.log(r);
                userCollection.findOne({ account: account }, (err, r) => {
                    if (err) throw err;
                    else {
                        return res.send(r);
                    }
                });
            }
        });
    }
})

module.exports = router;
