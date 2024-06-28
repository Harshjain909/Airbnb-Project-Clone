
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{console.log("connection successfull");}).catch((err)=>{console.log(err)});

//Database loading
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
        type: String,
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
});

const Listing = mongoose.model("Listing",listingSchema);
const info = require("./data.js");
let initializedata = async() => {
    await Listing.deleteMany({}); 
    await Listing.insertMany(info.data);
}
(async () => {
    await initializedata();
})();


module.exports = Listing; 