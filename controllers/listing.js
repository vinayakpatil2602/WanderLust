
const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const Review = require("../models/reviews");

//index
module.exports.IndexPage=async(req,res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

//new form
module.exports.renderNewForm=(req, res)=>{
    res.render("./listings/new.ejs");
}

//show
module.exports.showListing=async(req,res) => {
    let {id}=req.params;    
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
       req.flash("error","Listing you requested for does not exist!");
       res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}


//create 
module.exports.createListing=async(req, res,next)=>{

    //for map
    let responce=await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    })
    .send();

    let url=req.file.path;
    let filename=req.file.filename;
    const newList=new Listing(req.body.listing);
    newList.image={url,filename};
    newList.owner=req.user._id;

    newList.geometry=responce.body.features[0].geometry;


    await newList.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

//edit form
module.exports.renderEditForm=async(req, res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you requested for does not exist!");
       res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
   originalImageUrl= originalImageUrl.replace("/upload","/upload/w_200");
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
}

//update
module.exports.updateListing=async(req, res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});//deconstruct to convert individual values

    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.searchListings = async (req, res) => {
    try{
            const { location } = req.query
            // Perform a search based on the location
            const searchResults = await Listing.find({ location: { $regex: new RegExp(location, "i") } }).populate('owner');
            
            if(searchResults.length>0){
                  req.flash('success',"Please Login to show Yours Listings");
                  res.render("./listings/Search.ejs", { searchResults});
            }
            else{
                req.flash("error", "No listings found for the provided location.");
                res.redirect("/listings");
            }
        }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/listings");
    }
   
};

//destroy 
module.exports.destroyListing = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Listing.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            req.flash("error", "Listing not found");
        } else {
            req.flash("success", "Listing deleted successfully");
        }
        res.redirect("/listings");
    } catch (error) {
        console.error("Error deleting listing:", error);
        req.flash("error", "Error deleting listing");
        res.redirect("/listings");
    }
};




//Search
//controllers/listing.js

// Add a new function to handle search


