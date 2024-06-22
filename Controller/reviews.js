const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.reviewDelete = async (req, res, next) => {
    const { rid, id } = req.params; 
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.reviewCreate =  async (req, res, next) => {
    const result = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    result.reviews.push(newReview);
    await newReview.save();
    await result.save();
    req.flash("success", "Review created Successfully");
    res.redirect(`/listings/${result._id}`);
};
