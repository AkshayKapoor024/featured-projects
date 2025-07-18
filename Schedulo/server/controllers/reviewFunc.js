
const Event = require('../models/event')
const User = require('../models/user')
const Review = require('../models/review')


module.exports.postReview = async (req, res) => {
  let { eventid } = req.params
  let { comment, rating } = req.body
  console.log(eventid , req.body)
  
  const review = new Review({ comment, rating, event: eventid })
  review.author = req.currentUser._id
  let event = await Event.findById(eventid);
  event.reviews.push(review._id);
  await event.save();
  await review.save()
  res.send(`Successfully Added a review`)
}

module.exports.deleteReview = async (req, res) => {
  let { eventid, reviewid } = req.params
  await Event.findByIdAndUpdate(eventid, { $pull: { reviews: reviewid } })
  await Review.findByIdAndDelete(reviewid)
  console.log("review deleted successfully")
  res.send(`Review deleted successfully`)
}