const Listing = require('./models/listing.js')
const ExpressError = require("./utils/ExpressError.js")
const { ListingSchema, reviewShema } = require('./shema.js'); 
const Revies = require('./models/review.js');


module.exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.url = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect('/login');
    } else {
        next();
    }
};


module.exports.saveURL = (req, res, next) => {
    if (req.session.url) {
        res.locals.url = req.session.url;
    }
    next();
};
module.exports.isowner = async (req, res, next) => {
     const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.listingvalidate = (req, res, next) => {
    const { error } = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errMsg)
    } else {
        next();
    }
};
module.exports.validatereview = (req, res, next) => {
    const { error } = reviewShema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } 
    next();
};

module.exports.isOeviewOwner = async (req, res, next) => {
     const { rid ,id} = req.params;
    let revies = await Revies.findById(rid);
    if (!revies.author._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not the author of this revies");
        return res.redirect(`/listings/${id}`)
    }
    next();
}