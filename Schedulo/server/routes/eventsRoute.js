const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const multer = require('multer')
const { cloudinary, storage } = require('../cloudConfig.js')
const upload = multer({ storage })
const {eventValidation,parseArraysMiddleware,requireAuthUser,reviewValidation,userValidation,rsvpValidation}=require('../middlewares/middleware.js')
const {getAllEvents ,postNewEvent,singleEvent ,deleteEvent,updateEvent,attendeeList } =require('../controllers/eventFunc.js')
//Events Validation before any route to check if event is coming in correct format or not

router.route('/')
    .get(wrapAsync(getAllEvents))
    .post(upload.single('image'), parseArraysMiddleware, eventValidation, requireAuthUser, wrapAsync(postNewEvent))



router.route('/:id')
    .get(wrapAsync(singleEvent))
    .delete(requireAuthUser, wrapAsync(deleteEvent))

router.put('/:id/updateDetails', upload.single('image'), parseArraysMiddleware, eventValidation, requireAuthUser, wrapAsync(updateEvent))

//Only for owner of event
router.get('/:id/attendees', requireAuthUser, wrapAsync(attendeeList))

module.exports = router