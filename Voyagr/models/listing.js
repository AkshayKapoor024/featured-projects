const mongoose = require('mongoose')
const Review = require('./review.js')
const Listing =new mongoose.Schema({
title:String,
description:String,
image:{
    filename:{
        type:String,
        default:"filename"
    },
    url:{
        type:String,
        default:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    }
},
price :Number,
location:String,
country:String,
reviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"review"
}],
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
},
//Using geojson format for storing coordinates 
geometry:{
    type:{
        type:String,
        enum:['Point'],
        required:true
    },
    coordinates:{
        type:[Number],
        required:true
    }
}
})
//deleting middleware which tackles the case to delete all the reviews of a listing if listing is deleted
Listing.post("findOneAndDelete",async (listing)=>{
let res = await Review.deleteMany({_id:{$in:listing.reviews}})
})
const List= new mongoose.model("listings",Listing)

module.exports=List