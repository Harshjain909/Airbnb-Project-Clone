if(process.env.NODE_ENV !='production'){
    require('dotenv').config(); 
}


const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const ejsMate = require("ejs-mate");
const ExpressError = require("./data initializer/ExpressError.js");


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./data initializer/user.js");
const methodOverride = require('method-override');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));


const session = require("express-session");
const sessionOptions = {
    secret:"secretcodehere", 
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*(1000), 
        maxAge: 7*24*60*60*(1000),
        httpOnly:true,   
    }
}
app.use(session(sessionOptions));

const flash = require("connect-flash");
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride('_method'));


app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); 
    res.locals.error = req.flash("error");
    res.locals.userdata = req.user;
    console.log(res.locals.userdata);
    next();
})

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter); 
app.use("/", userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    let { status = 500, message = "Something went wrong" } = err;
    res.render("./listings/error.ejs",{message});
});

// Starting Routes
app.listen(3000,()=>{
    console.log("listening on port 3000");
});


//connecting with database
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{console.log("connection successfull");}).catch((err)=>{console.log(err)});









