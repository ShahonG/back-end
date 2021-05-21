const md5 = require('md5');
const bodyParser = require('body-parser');
const express = require('express');

const initdatabase = require('./database/connect');
const Login = require('./users/Login');
const SignUp = require('./users/SignUp');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

initdatabase().then(dbs => {
    app.listen(3000);
    Login(app, dbs);
    SignUp(app, dbs);
}).catch(err => {
    console.error("Failed to connect Database.");
    console.error(err);
    process.exit(1);
});

// user part


app.get("/", function(req, res){
    res.send(`
    <p>Hello, World</p>
    <form action="/Login" method="GET">
        <input type="submit" value="Login Page">
    </form>
    <form action="/SignUp" method="GET">
        <input type="submit" value="Sign up">
    </form>
    `);
});