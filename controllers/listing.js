const Listing = require("../data initializer/init.js");  
const Review = require("../data initializer/review.js");

module.exports.index = async(req,res)=>{   
    let places = await Listing.find({});
    res.render("./listings/listings.ejs",{places});
}

module.exports.renderNewForm = (req,res)=>{  
    console.log(req.user);                
    res.render("./listings/new.ejs");
}

module.exports.showDetails = async(req,res,next)=>{ 
    const {id} = req.params;
    const placedata = await Listing.findById(id).populate({path:"reviews", populate :{path:"author"}}).populate("owner");  //reviews ko populate krna hoga kyuki id h
    if(!placedata){
      req.flash("error","Listing was deleted or does not exist");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{placedata});
}

module.exports.addNewListing = async(req,res,next)=>{   
    let url = req.file.path;
    let filename = req.file.filename;
    
    try {
        const { title, description, price, country, location } = req.body;
        const newListing = new Listing({
            title: title,
            description: description,
            price: price,
            location: location,
            country: country,
            owner: req.user._id,
        })
        newListing.image = {url,filename};
        
        await newListing.save();
        req.flash("success","New listing added sucessfully")
        res.redirect("/listings");
    }
    catch(err){
        next(err);
    }
}

module.exports.editListing = async(req,res)=>{ 
    const {id} = req.params;
    const placedata = await Listing.findById(id);
    if(!placedata){
        req.flash("error","Listing was deleted or does not exist");
        res.redirect("/listings");
      }

      placedata.image.url = (placedata.image.url).replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs",{placedata});
}

module.exports.updateListing = async (req, res, next) => { 
    try {
        const { id } = req.params;
        const { title, description, image, price, country, location } = req.body;

        const updatedListing = await Listing.findByIdAndUpdate(id,{title,description,image,price,country,location},
            { new: true, runValidators: true }
        );

        if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        await updatedListing.save();
        } 
        
        if (!updatedListing) {
            throw new ExpressError(404, "Listing Not Found");
        }
        req.flash("success","Listing updated sucessfully")
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
}

module.exports.deleteListing = async (req, res, next) => {  
    try {
        const { id } = req.params;
        
        const deletedListing = await Listing.findById(id);
        if (!deletedListing) {
            throw new ExpressError(404, "Listing Not Found");
        }

        await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
        await Listing.findByIdAndDelete(id);

        req.flash("success","Listing deleted sucessfully")
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}