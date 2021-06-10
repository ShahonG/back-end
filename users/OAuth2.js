const router = require('express').Router();
const passport = require('passport');

router.get('/', 
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback', 
    passport.authenticate('google', { failureRedirect : '/users/Login' }),
    (req, res) => {
    res.redirect('/users/OAuth2/success');
});

router.get('/success', (req, res) => {
    res.send("Google OAuth2 Login Success!!!");
});

module.exports = router;