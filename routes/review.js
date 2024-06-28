const express = require("express");
const router = express.Router({mergeParams:true});

const {validateListing,Isloggedin,authorizationReview,validateReview} = require("./middleware.js");

const Listing = require("../data initializer/init.js");   
const Review = require("../data initializer/review.js");

const reviewController = require("../controllers/review.js");

router.post("/", Isloggedin,validateReview, reviewController.postReview);

router.delete("/:reviewid", Isloggedin,authorizationReview,reviewController.deleteReview)

module.exports = router;