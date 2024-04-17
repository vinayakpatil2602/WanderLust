
const Reviews=require("../models/reviews.js");
const Listing=require("../models/listing.js");

module.exports.createReview=(async(req,res) => {
    let listing=await Listing.findById(req.params.id);
    let newReview=new Reviews(req.body.review);//Receive on backend
    newReview.author=req.user._id;//to add author
    listing.reviews.push(newReview);//beacuse it is array
    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
})


module.exports.destroyReview = (async(req, res, next) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
})
