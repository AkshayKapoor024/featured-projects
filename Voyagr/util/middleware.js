// middleware.js
const Listing = require('../models/listing')
const Review = require('../models/review.js')
const listingSchema=require('../schema.js')
const reviewSchema = require('../util/reviewValidate.js')
const userValidate = require('../util/userValidate.js')
const ExpressError1 = require('./ExpressError.js')
//Server side validation function for listing schema
let serverValidation = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError1(400, result.error.details[0].message);
  }
  next()
}

//Server side validation function for review Schema
let ValidateReview = (req, res, next) => {
  let resu = reviewSchema.validate(req.body)
  if (resu.error) {
    throw new ExpressError1(400, resu.error.details[0].message)
  }
  next()
}

//validation function for user entry
let ValidateUser = (req, res, next) => {
  let resp = userValidate.validate(req.body)
  if (resp.error) {
    throw new ExpressError1(404, req.error.details[0].message)
  }
  next()
}
//Middleware used to check if the user is logged in and if not then redirect to login page
const userLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('✅ Authenticated User:', req.user);
    next();
  } else {
    req.session.redirectUrl = req.originalUrl;
    console.log('🔒 Not Authenticated');
    req.flash('error', 'Please login first for accessing this section');
    res.redirect('/login');
  }
};
//Url to save the currentUrl to locals so to access further
const saveUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
//Middleware used to check if the current user is the listing owner authorized to edit /delete post or not
const isOwner = async (req, res, next) => {
  let id= req.params.id
  console.log(req.params.id)
  let listing = await Listing.findById(id)
  console.log(res.locals.currentuser)
  if (!listing.owner.equals(res.locals.currentuser._id)) {
    req.flash('error', 'You are not the authorized user!')
   return res.redirect(`/listings/${id}`)
  }
  next()
}
//Middleware used to check if the current user is the review owner authorized to edit /delete post or not
const isAuthor = async (req, res, next) => {
  const listid = req.params.id
  let id= req.params.reviewId
  let review = await Review.findById(id)
  console.log(review)
  console.log(res.locals.currentuser)
  if (!review.author.equals(res.locals.currentuser._id)) {
    req.flash('error', 'You are not the authorized user!')
   return res.redirect(`/listings/${listid}`)
  }
  next()
}
module.exports = {
  userLogged,
  saveUrl,
  isOwner,
  serverValidation,
  ValidateReview,
  ValidateUser,
  isAuthor
};
