const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const multer = require('multer')
const { cloudinary, storage } = require('../cloudConfig.js')
const upload = multer({ storage })
const {eventValidation,parseArraysMiddleware,requireAuthUser,reviewValidation,userValidation,rsvpValidation}=require('../middlewares/middleware.js')
const {signupUser,loginUser,logoutUser,googleAuthCallbackFunction,AuthenticationCheck,userDetailing,findUsers,saveUserInfo,findRsvp,findReviews,getSearch}=require('../controllers/userFunc.js')
//Authentication routes
//Sign-up route
router.post('/signup', userValidation, wrapAsync(signupUser))
//Login route
router.post('/login', userValidation, passport.authenticate('local', {
  failureRedirect: '/login',
}),loginUser)
//Logout user 
router.get('/logout',logoutUser)


//GOOGLE AUTH ROUTES
// Trigger Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://go-schedulo.vercel.app/login'
  }),
googleAuthCallbackFunction
);
//Check Authenticated
router.get('/isAuthenticated',AuthenticationCheck)
router.get('/userDetails',userDetailing)

router.get('/users',findUsers)
//Saving user details on user form in user Dashboard
router.post('/userDashboard/profile/saveDetails', upload.single('image'), requireAuthUser, wrapAsync(saveUserInfo))
//Route for giving user rsvps currently done !!!
router.get('/userRsvp', requireAuthUser, wrapAsync(findRsvp))
router.get(`/users/:userid/reviews/YourReviews`, wrapAsync(findReviews))
router.get('/api/searchResults',wrapAsync(getSearch))
module.exports = router
