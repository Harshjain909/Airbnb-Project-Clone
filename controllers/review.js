const Listing = require("../data initializer/init.js"); 
const Review = require("../data initializer/review.js");

module.exports.postReview = async (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in !")
        res.redirect("/login");
    }
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const newReview = new Review({
            comment: comment,
            rating: rating,
            author: req.user._id,
        })
        const listing = await Listing.findById(id);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success","Thanks for your valuable review")
        res.redirect(`/listings/${id}`)
    }
    catch (err) {
        next(err);
    }
};

module.exports.deleteReview = async (req, res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in !")
        res.redirect("/login");
    }
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted sucessfully")
    res.redirect(`/listings/${id}`);
};