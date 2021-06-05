const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const bcrypt = require('bcrypt');
const LogRecording = require('../logs/log');
const userCollection = require('../database/mongodb').user;
const util = require('util');
const hashSeed = 10;

function initialize(passport) {
    passport.use(new GoogleStrategy({
        clientID: "616661066353-vi8pngo3m40r7emdmk48ikppf10ej4o7.apps.googleusercontent.com",
        clientSecret: "nrYz8ZAZBHBq5R8S3ybwK82g",
        callbackURL: "https://localhost:3000/OAuth2/callback"
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
        const userInfo = { account: account, password: password };
        console.log(userInfo);
        userCollection.findOne(userInfo, (err, user) => {
            if (err) throw err;
            if (user == null){
                return done(null, false, { message: 'No user with that account' });
            } else {
                if (password == user.password) {
                    console.log("Login SUCCESS.");
                    //LogRecording(Date.now(), util.format("Account '%s' Login SUCCESS.", userInfo.account), "Login");
                    return done(null, user);
                } else {
                    console.log("Password incorrect.");
                    //LogRecording(Date.now(), util.format("Wrong PASSWORD for Account '%s'", userInfo.account), "Login");
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