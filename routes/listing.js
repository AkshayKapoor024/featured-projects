const express = require('express')
const router = express.Router()
const wrapAsync = require('../util/WrapAsync.js')
//Userlogged middleware for checking that if user is logged in before allowing tasks to be performed
const {userLogged , saveUrl,serverValidation,ValidateReview,ValidateUser,isOwner,isAuthor}= require('../util/middleware.js')
const { index , createList , saveList , editList , saveEdit , showList , deleteList } = require('../controllers/listing.js')
//File Handling and Storage
const multer = require('multer')
const {storage} = require('../cloudconfig.js')
//    dest:'upload/' instead of storage incase of development level , stores images in upload folder automatically created
const upload = multer({storage})

//Index Route and save new listing route on /listings using router.route() together
router.route('/')
.get(wrapAsync(index))
//Upload single uploads incoming file to storage which is cloudinarystorage
.post(userLogged,upload.single('image'),serverValidation,wrapAsync(saveList))

//Create new Post route
router.get('/new',userLogged,createList)

router.route('/:id')
//Single post route
.get(userLogged,wrapAsync(showList))
//patch request to change data
//Upload single uploads incoming file to storage which is cloudinarystorage
.patch(userLogged,isOwner,upload.single('image'),serverValidation,wrapAsync(saveEdit))
//Delete request 
.delete(userLogged,isOwner,wrapAsync(deleteList))

//Edit form route
router.get('/:id/edit',userLogged,isOwner,editList)



module.exports = router