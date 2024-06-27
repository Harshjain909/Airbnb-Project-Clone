const express = require("express");
const router = express.Router({mergeParams:true});

const {validateListing,Isloggedin,authorization} = require("./middleware.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listing.js");

//INDEX ROUTE
router.get("/",listingController.index);

//NEW ROUTE 
router.get("/new",Isloggedin,listingController.renderNewForm);

// Show details Route
router.get("/:id",listingController.showDetails);

// Add new listing Route
router.post("/",Isloggedin,upload.single('image'),validateListing,listingController.addNewListing);

//Edit route
router.get("/:id/edit",Isloggedin,authorization,listingController.editListing);

//Update route
router.put("/:id",validateListing, Isloggedin,authorization,upload.single('image'), listingController.updateListing);

// Delete route
router.delete("/:id",Isloggedin,authorization, listingController.deleteListing);

module.exports = router;