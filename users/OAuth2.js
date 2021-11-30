const router = require('express').Router();
const passport = require('passport');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('417578352473-90ueqki5ddsok1747ukrvog34sbbg28g.apps.googleusercontent.com');
const LogRecording = require('../logs/log');
const userCollection = require('../database/mongodb').user;
const crypto = require('crypto');
const util = require('util');


router.get('/', 
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.post('/login', async (req, res) => {
    idToken = req.body.token;
    let ticket, payload;
    try {
        ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: '417578352473-90ueqki5ddsok1747ukrvog34sbbg28g.apps.googleusercontent.com'
        });
        payload = ticket.getPayload();
        console.log('Google payload is '+JSON.stringify(payload));
        
        const googleInfo = { 
            googleID : crypto.createHash('sha256').update(payload.email).digest('base64')
        };
        userCollection.findOne(googleInfo, (err, user) => {
            if (err) throw err;
            if (user == null){
                // create User with googleInfo._id
                googleInfo.account = payload.name;
                googleInfo.password = null;
                userCollection.create(googleInfo, (err, user) => {
                    if (err) throw err;
                    LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
                                    util.format("Google ID '%s' has been create(Google OAuth).", googleInfo.googleID),
                                    "\x1b[31mUsers.Google\x1b[0m"
                                );  
                    return res.send({ "data": user, "session": req.session });
                })  
            } else {
                // user has been create before.
                console.log("Login SUCCESS.");
                console.log(req.session);
                LogRecording(   new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}),
                                util.format("Google ID '%s' Login SUCCESS(Google OAuth).", googleInfo.googleID),
                                "\x1b[31mUsers.Google\x1b[0m"
                            );
                return res.send({ "data": user, "session": req.session });
            }
        });
    } catch (err) {
        console.log('error:', err);
    }
});

// router.get('/callback', 
//     passport.authenticate('google', { failureRedirect : '/users/Login' }),
//     (req, res) => {
//     res.redirect('/users/OAuth2/success');
//    /* (req, res) => {
//         passport.authenticate('google', { failureRedirect : '/users/Login'}, (err, user, info) => {
//             console.log(req.header);
//             return res.send("success");
//         })(req, res);*/
// });

router.get('/success', (req, res) => {
    res.send("Google OAuth2 Login Success!!!");
});

module.exports = router;
