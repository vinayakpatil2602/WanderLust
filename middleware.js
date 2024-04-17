
const Listing=require("./models/listing");
const Review=require("./models/reviews");

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated())//passport method to check user is logged in
    {
        //redirect url save
        // path->login->same path as first path
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if(!listing.owner.equals(res.locals.currentUser._id)){//for authorisation from any hoppscotch request or anything
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
     }
     next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(review.author.equals(res.locals.currentUser._id)){//for authorisation from any hoppscotch request or anything
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
     }
     next();
};