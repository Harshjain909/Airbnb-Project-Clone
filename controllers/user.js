const User = require("../data initializer/user");

module.exports.signupForm = (req, res) => {
    res.render("Users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const user = await User.register(newUser, password);
        console.log(user);
        req.login(user,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success", "Welcome to Airbnb!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm =  (req, res) => {
    res.render("Users/login.ejs");
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");

    if(res.locals.redirectUrl){ 
        res.redirect(res.locals.redirectUrl); 
    }else{
        res.redirect("/listings");
    }
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You have been logged out!");
        res.redirect("/listings");
    });
}