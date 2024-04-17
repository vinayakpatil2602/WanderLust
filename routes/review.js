
const express=require("express");
const router=express.Router({mergeParams: true});//beacuse the request is send by app.js the id parameter is 
                                                //stopped so we used mergeParams parent be app.js and child be review.js
                                                //so child value take precedence
const wrapAsync= require("../utils/wrapAsync.js");
const Reviews=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isReviewAuthor}=require("../middleware.js");

//Reviews

//controllers
const reviewsController=require("../controllers/reviews.js");

//Post Review route
router.post("/", isLoggedIn,wrapAsync(reviewsController.createReview));

//Destroy Review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewsController.destroyReview));

module.exports=router;