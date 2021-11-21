const router = require("express").Router();
const passport = require('passport');
const userCollection = require('../database/mongodb').user;

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        console.log(req.cookies);
        return res.redirect('/users/Dashboard');
    }
    return next();
}

router.get("/", ensureAuthenticated, (req, res) => {
    res.send(`
    <html>
    <body>
        <p>Login</p>
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
        <form action="/users/logout" method="POST">
            <input type="submit" value="Logout">
        </form>
        <form action="/users/SignUp" method="GET">
            <input type="submit" value="NewAccount">
        </form>
        <form action="/users/OAuth2" method="GET">
            <input type="submit" value="Sign in with Google">
        </form>
    </body>
    </html>`
    );
    // console.log(req.session);
});

/* local authenticate config in "../config/passport.js" */
router.post("/",
    // passport.authenticate('local', {
    //     successRedirect: "/users/Login",
    //     failureRedirect: "/users/Login",
    //     // failureFlash: true
    //     failureFlash: "error"
    // })
    (req, res) => {
        passport.authenticate('local', (err, user, info) => {
            // console.log(user);
            if (err) { return 'error'; }
            if (user) {
                // console.log(user);
                // passport.serializeUser
                req.logIn(user, (err) => {
                    if (err) { 
                        return console.log(err);
                    };
                    console.log(req.session);
                    res.cookie('cookieName', 123, { path: '/', maxAge: 900000, httpOnly: true });
                    return res.send({ "message":"Login Success!", "data":user, "session":req.session});
                })
            }
            else {
                return res.send("Login Failed!");
            }
        })(req, res);
    }
);

module.exports = router;
