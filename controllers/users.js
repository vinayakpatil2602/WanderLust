
const User=require("../models/user.js");
module.exports.renderSignupForm=(req, res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp=async(req, res)=>{
    try{
         let {username,email,password}=req.body;
         if (!username) {
             throw new Error("Username is required");
         }
         const newUser=new User({username,email});
         const RegisteredUser= await User.register(newUser,password);
         req.login(RegisteredUser,(err)=>{
             if(err){
                 return next(err);
             }
             req.flash("success","Welcome to Wanderlust");
             res.redirect("/listings");
         })
    }
    catch(err){
         req.flash("error",err.message);
         res.redirect("/signup");
    }
 };

 module.exports.renderLoginForm=(req, res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req, res)=>{  //passport.authenticate middleware
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logged out!");
        res.redirect("/listings");
    });  
}