const router = require("express").Router();
const passport = require('passport');

// router.get("/", (req, res) => {
//     res.send(`
//     <html>
//     <body>
//         <p>Login</p>
//         <form action="/users/Login" method="POST">
//             <div>
//                 <label for="account">account</label>
//                 <input type="text" id="account "name="account" required>  <br>
//             </div>
//             <div>
//                 <label for="password">password</label>
//                 <input type="password" id="password "name="password" required>
//             </div>
//             <input type="submit" value="Submit">

//         </form>
//         <form action="/users/SignUp" method="GET">
//             <input type="submit" value="NewAccount">
//         </form>
//         <form action="/users/OAuth2" method="GET">
//             <input type="submit" value="Sign in with Google">
//         </form>
//     </body>
//     </html>`
//     );
//     // console.log(req.session);
// });

/* local authenticate config in "../config/passport.js" */
router.post("/", passport.authenticate('local', {
    successRedirect: "/users/Login",
    failureRedirect: "/users/Login",
    // failureFlash: true
    failureFlash: "error"
}));

module.exports = router;
