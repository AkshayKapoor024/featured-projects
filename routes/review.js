const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../util/WrapAsync.js')
//Userlogged middleware for checking that if user is logged in before allowing tasks to be performed
const {userLogged , saveUrl,serverValidation,ValidateReview,ValidateUser,isOwner,isAuthor}= require('../util/middleware.js')
const {saveReview , deleteReview} = require('../controllers/review.js')

//Storing reviews via patch request
router.post('/',userLogged,ValidateReview, wrapAsync(saveReview));

/*Delete a review route */
router.delete('/:reviewId',userLogged,isAuthor, wrapAsync(deleteReview))

module.exports=router
