const express = require('express');
const warpAsync = require('../utils/warpAsync');
const passport = require('passport'); 
const {saveURL} = require('../Middleware')
const router = express.Router();
const {signupGet,signupPost,loginPost,loginGet,logout} = require('../Controller/usre')


// Signup route
router.route('/signup')
    .get(signupGet)
    .post(warpAsync(signupPost));

// Login route
router.route('/login')
    .post(
    saveURL,
    passport.authenticate(
    "local", { 
    failureRedirect: '/login', 
        failureFlash: true
    }),
    warpAsync(loginPost)
    )
    .get(loginGet);

// Login route
router.get("/logout", logout)

module.exports = router;