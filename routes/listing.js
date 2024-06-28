const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../data initializer/ExpressError.js"); 
const {validateListing,Isloggedin,authorization} = require("./middleware.js");

const listingController = require("../controllers/listing.js");

//INDEX ROUTE
router.get("/",listingController.index);

//NEW ROUTE 
router.get("/new",Isloggedin,listingController.renderNewForm);

// Show details Route
router.get("/:id",listingController.showDetails);

// Add new listing Route
router.post("/",Isloggedin,validateListing,listingController.addNewListing);

//Edit route
router.get("/:id/edit",Isloggedin,listingController.editListing);

//Update route
router.put("/:id",validateListing, Isloggedin, listingController.updateListing);

// Delete route
router.delete("/:id",Isloggedin, listingController.deleteListing);

module.exports = router;