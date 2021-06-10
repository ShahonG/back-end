const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const LogRecording = require('../logs/log');
const userCollection = require('../database/mongodb').user;
const util = require('util');
const hashSeed = 10;

function initialize(passport) {
    passport.use(new GoogleStrategy({
        clientID: "616661066353-vi8pngo3m40r7emdmk48ikppf10ej4o7.apps.googleusercontent.com",
        clientSecret: "nrYz8ZAZBHBq5R8S3ybwK82g",
        callbackURL: "https://localhost:3000/users/OAuth2/callback"
    }, 
    (accessToken, refreshToken, profile, done) => {
        userProfile = profile;
        return done(null, userProfile);
    }));

    passport.use(new LocalStrategy({
        usernameField: "account",
        passwordField: "password",
    },
    (account, password, done) => {
        const hash = crypto.createHash('sha256').update(password).digest('base64');
        const reqInfo = { account: account, password: hash };
        userCollection.findOne(reqInfo, (err, user) => {
            if (err) throw err;
            if (user == null){
                console.log("Login FAILED, No Account.");
                LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
                                    util.format("Account '%s' hasn't been create.", reqInfo.account),
                                    "\x1b[31mUsers\x1b[0m"
                                );
                return done(null, false, { message: 'No user with that account' });
            } else {
                if (reqInfo.password == user.password) {
                    console.log("Login SUCCESS.");
                    LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
                                    util.format("Account '%s' Login SUCCESS.", reqInfo.account),
                                    "\x1b[31mUsers\x1b[0m"
                                );
                    return done(null, user);
                } else {
                    console.log("Password incorrect.");
                    LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}), 
                                    util.format("Wrong PASSWORD for Account '%s'", reqInfo.account),
                                    "\x1b[31mUsers\x1b[0m"
                                );
                    return done(null, false, { message: 'Password incorrect' });
                }
            }
        });
        /*
        if (user == null){
            return done(null, false, { message: 'No user with that email' });
        }
        else{
            if (bcrypt.compareSync(password, user.password)){
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect'});
            }
        }
        */
    }));
    /* 
        user serialize to id
        id deserialize to user
    */
    passport.serializeUser((user, done) => { done(null, user.id) });
    passport.deserializeUser((id, done) => { done(null, id) });
}

module.exports = initialize;