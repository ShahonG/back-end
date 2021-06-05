const express = require('express');
const session = require('express-session');
const flash = require('express-flash');

const Mongo = require('mongoose');
const url = "mongodb://127.0.0.1:27017/testdb";
Mongo.connect(url, (err) => {
    if (err) throw err;
    console.log("Connect to DB!");
});

var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded( { extended: false } ));
app.use(flash());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'SECRET'
}));

const passport = require('passport');
const initPassport = require('./users/passport');
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

app.use('/users/Login', require('./users/Login'));
app.use('/users/SignUp', require('./users/SignUp'));

app.listen(3000);

app.get("/", function(req, res){
    res.send(`
    <p>Hello, World</p>
    <form action="/users/Login" method="GET">
        <input type="submit" value="Login Page">
    </form>
    <form action="/users/SignUp" method="GET">
        <input type="submit" value="Sign up">
    </form>
    `);
});