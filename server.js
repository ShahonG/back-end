const express = require('express');
const session = require('express-session');
// connect-mongo@3.2.0 version
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const cors = require('cors');

const Mongo = require('mongoose');
const url = "mongodb://127.0.0.1:27017/testdb";
const sessionURL = "mongodb://127.0.0.1:27017/sessionDB";
Mongo.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
},(err) => {
    if (err) throw err;
    console.log("Connect to DB!");
});

var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded( { extended: false } ));
app.use(express.json());
// app.use(cors());
app.use(flash());
app.use(session({
    secret: 'GAIS Editor is really really Good!',
    store: new MongoStore({ url: sessionURL }),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 } // 1 minutes
}));

app.use((req, res, next) => {
    //先允許跨域請求才能進來
    //res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
    res.header('Access-Control-Allow-Origin', '*');
    //處理cookie資訊，如果有，並且不對每次請求都新開一個session
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    res.header('Access-Control-Allow-Headers', 'x-requested-with,content-type,Authorization');
    next();
})

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
const initPassport = require('./config/passport');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
initPassport(passport);

app.use('/users/Login', require('./users/Login'));
app.use('/users/SignUp', require('./users/SignUp'));
app.use('/users/OAuth2', require('./users/OAuth2'));
app.use('/users/logout', require('./users/logout'));
app.use('/users/dashboard', require('./users/dashboard'));
app.use('/query', require('./query'));

app.listen(3003);

app.get("/", (req, res) => {
    res.send(`
    <p>Login Back-end Testing</p>
    <form action="/users/Login" method="GET">
        <input type="submit" value="Login Page">
    </form>
    <form action="/users/SignUp" method="GET">
        <input type="submit" value="Sign up">
    </form>
    `);
});
