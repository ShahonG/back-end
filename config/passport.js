const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const util = require('util');

const LogRecording = require('../logs/log');
const userCollection = require('../database/mongodb').user;
const keys = require('./keys');

function initialize(passport) {
    passport.use(new GoogleStrategy({
        clientID: keys.Google.ClientID,
        clientSecret: keys.Google.ClientSecret,
        callbackURL: "/users/Google/callback"
    }, 
    (accessToken, refreshToken, profile, done) => {
        const googleInfo = {
            googleID : crypto.createHash('sha256').update(profile.id).digest('base64')
        };
        userCollection.findOne(googleInfo, (err, user) => {
            if (err) throw err;
            if (user == null){
                // create User with googleInfo._id
                googleInfo.account = null;
                googleInfo.password = null;
                userCollection.create(googleInfo, (err, user) => {
                    if (err) throw err;
                    LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
                                    util.format("Google ID '%s' has been create(Google OAuth).", googleInfo.googleID),
                                    "\x1b[31mUsers.Google\x1b[0m"
                                );
                    return done(null, user);
                })
            } else {
                // user has been create before.
                console.log("Login SUCCESS.");
                LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
                                util.format("Google ID '%s' Login SUCCESS(Google OAuth).", googleInfo.googleID),
                                "\x1b[31mUsers.Google\x1b[0m"
                            );
                return done(null, user);
            }
        });
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
                                    "\x1b[31mUsers.Local\x1b[0m"
                                );
                return done(null, false, { message: 'No user with that account' });
            } else {
                if (reqInfo.password == user.password) {
                    console.log("Login SUCCESS.");
                    LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
                                    util.format("Account '%s' Login SUCCESS.", reqInfo.account),
                                    "\x1b[31mUsers.Local\x1b[0m"
                                );
                    return done(null, user);
                } else {
                    console.log("Password incorrect.");
                    LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}), 
                                    util.format("Wrong PASSWORD for Account '%s'", reqInfo.account),
                                    "\x1b[31mUsers.Local\x1b[0m"
                                );
                    return done(null, false, { message: 'Password incorrect' });
                }
            }
        });
    }));
    /* 
        user serialize to id
        id deserialize to user
    */
    passport.serializeUser((user, done) => { done(null, user.id); });
    passport.deserializeUser((id, done) => { done(null, id) });
}

module.exports = initialize;