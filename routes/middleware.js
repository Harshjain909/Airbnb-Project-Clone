const Listing = require("../data initializer/init.js");  
const Review = require("../data initializer/review.js");
const ExpressError = require("../data initializer/ExpressError.js"); 
const {listingSchemaValidation,reviewSchemaValidation} = require("../joi.js");

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchemaValidation.validate(req.body);
    if (error) {                                  
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchemaValidation.validate(req.body);
    if (error) {                                       
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};


module.exports.Isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;   
        req.flash("error","You must be logged in !");
        return res.redirect("/login");
    }
    next();
}

module.exports.authorizationReview = async (req, res,next) => {
    const {id,reviewid} = req.params;
    const review = await Review.findById(reviewid);
    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "Unauthorized User");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
 }
 next();
}