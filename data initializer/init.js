const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String, 
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [             
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review",                     
        }
    ],
    owner : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

const Listing = mongoose.model("Listing",listingSchema);
const info = require("./data.js");
let initializedata = async() => {
    data = info.data.map((obj)=> ({...obj,owner:'667cf52ddc16b01c81c05d87'})); 
    await Listing.deleteMany({}); 
    await Listing.insertMany(data);
}
(async () => {
    await initializedata();
})();


module.exports = Listing; 