const router = require("express").Router();

router.post("/", (req, res) => {
    console.log("logout");
    req.logout();
    // if (!req.session.passport.user)
    //     console.log("logout success");
    res.redirect('/');
})

module.exports = router;