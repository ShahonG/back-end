const router = require("express").Router();
const passport = require('passport');

router.get("/", (req, res) => {
    res.send(`
    <html>
    <body>
        <form action="/users/Login" method="POST">
            <div>
                <label for="account">account</label>
                <input type="text" id="account "name="account" required>  <br>
            </div>
            <div>
                <label for="password">password</label>
                <input type="password" id="password "name="password" required>
            </div>
            <input type="submit" value="Submit">

        </form>
        <form action="/users/SignUp" method="GET">
            <input type="submit" value="NewAccount">
        </form>
        <form action="/OAuth2" method="GET">
            <input type="submit" value="Sign in with Google">
        </form>
    </body>
    </html>`
    );
});

router.post("/", passport.authenticate('local', {
    successRedirect: "/users/Login",
    failureRedirect: "/users/SignUp",
    failureFlash: true
}))

router.get('/OAuth2', 
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/OAuth2/callback', 
    passport.authenticate('google', { failureRedirect : '/Login' }),
    (req, res) => {
    res.redirect('/OAuth2/success');
    });

module.exports = router;