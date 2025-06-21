const List = require('../models/listing')
const Review = require('../models/review')
//Saving review logic
module.exports.saveReview = async (req, res) => {
    const { comment, rating } = req.body;
    const { id } = req.params;

    const review = new Review({ comment, rating });
    review.author=req.user._id
    const obj = await List.findById(id);
    obj.reviews.push(review);

    await review.save();
    await obj.save();

    console.log("Review saved in listing" + review);
    req.flash('revAdd','New Review Added Successfully!')
    res.redirect(`/listings/${id}`);
}
//Deleting a review logic
module.exports.deleteReview = async (req,res)=>{
    let {id , reviewId} = req.params
    await List.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    console.log("review deleted successfully")
    req.flash('revDlt','Review Deleted Successfully!')
    res.redirect(`/listings/${id}`)
}