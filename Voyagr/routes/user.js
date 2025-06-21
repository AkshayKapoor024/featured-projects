const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../util/WrapAsync.js')
const passport = require('passport')
//Userlogged middleware for checking that if user is logged in before allowing tasks to be performed
const { userLogged, saveUrl, serverValidation, ValidateReview, ValidateUser, isOwner, isAuthor } = require('../util/middleware.js')
const { renderSignup, signupUser, renderLogin, loginUser, logoutUser, debug } = require('../controllers/users.js')
router.route('/signup')
//Route Handler for rendering form for signup
.get(renderSignup)
//Route handling post request for adding user to database
.post(ValidateUser, wrapAsync(signupUser))

//Debug route for checking if user is authenticated or not 
router.get('/debug', debug);


router.route('/login')
// Login Form
.get(renderLogin)
// Handle Login Logic
.post(saveUrl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  loginUser
);

//Logout route
router.get('/logout', logoutUser)



module.exports = router
