
const express=require("express");
const router=express.Router();//Express router are a way to organize your express application such that
                                //our primary app.js file does not become bloated//सुजलेला 
const wrapAsync= require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


//controllers
const listingController=require("../controllers/listing.js");

//Index route
router.get("/",wrapAsync(listingController.IndexPage));
 
//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);
 
 //Search route
 router.get("/search",isLoggedIn,wrapAsync(listingController.searchListings));

//Show Route
 router.get("/:id",wrapAsync(listingController.showListing));

//create route
 router.post("/",isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing));
 
//Edit route
 router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
 
 //update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing));
 
 //Delete route
 router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


 module.exports=router;