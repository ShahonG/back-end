const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const cors = require('cors');
const corsOptions = require('./config/cors');

// Database part
const Mongo = require('mongoose');
const url = "mongodb://127.0.0.1:27017/testdb";
Mongo.connect(url, (err) => {
    if (err) throw err;
    console.log("Connect to DB!");
});

// init express()
var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded( { extended: false } ));
app.use(flash());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'SECRET'
}));

// init Passport
const passport = require('passport');
const initPassport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Services part
app.use('/users/Login', cors(corsOptions.Login), require('./users/Login'));
app.use('/users/SignUp', cors(corsOptions.SignUp), require('./users/SignUp'));
app.use('/users/Google', require('./users/Google'));

// Backup part
const backup = require('./backup');
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