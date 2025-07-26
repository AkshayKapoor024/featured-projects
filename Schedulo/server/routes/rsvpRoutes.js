const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync')
const { addRsvp, updateRsvp, deleteRsvp, checkRsvp ,generateTicket} = require('../controllers/rsvpFunc')
const { eventValidation, parseArraysMiddleware, requireAuthUser, reviewValidation, userValidation, rsvpValidation} = require('../middlewares/middleware.js')

router.route('/')
    .post(rsvpValidation, wrapAsync(addRsvp))
    .put(requireAuthUser, wrapAsync(updateRsvp))
    .delete(requireAuthUser, wrapAsync(deleteRsvp));
//Checking if user is registred or not
router.get('/isRegistered', requireAuthUser, wrapAsync(checkRsvp))
router.get('/generateTicket',wrapAsync(generateTicket))

module.exports = router
