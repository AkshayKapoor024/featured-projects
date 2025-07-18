const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync')
const {eventValidation,parseArraysMiddleware,requireAuthUser,reviewValidation,userValidation,rsvpValidation}=require('../middlewares/middleware.js')
const {postReview,deleteReview} = require('../controllers/reviewFunc.js')

//Review Model routes 
router.post('/newReview', requireAuthUser, reviewValidation,wrapAsync(postReview))

router.delete('/deleteReview/:reviewid', wrapAsync(deleteReview))



module.exports = router