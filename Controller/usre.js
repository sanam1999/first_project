const User = require("../models/user");



module.exports.signupGet = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signupPost = async (req, res) => {
    try {
        let newuser = new User(req.body.user);
        let registeredUser = await User.register(newuser, req.body.user.password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', `Welcome ${newuser.username}`);
            res.redirect('/listings');
        });
       
    } catch (err) {
        req.flash("error", err.message);
        res.redirect('/signup');
    }
}

module.exports.loginPost = async (req, res) => {
            req.flash("success", `Welcome ${req.user.username}`);
            let url = res.locals.url || '/listings'
            res.redirect(url);     
}

module.exports.loginGet =  (req, res) => {
    res.render("users/login.ejs");
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
           return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect('/listings')
    })
}


