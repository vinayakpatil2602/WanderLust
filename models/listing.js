const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const reviews=require("./reviews.js");
const { number } = require("joi");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    contact_no:{
        type:String,
        required:true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
});

listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(listing){
        await mongoose.model("Review").deleteMany({ _id: { $in: doc.reviews } });
        // await Listing.deleteMany({_id:{$in:listing.reviews}});
    }
    
})


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;