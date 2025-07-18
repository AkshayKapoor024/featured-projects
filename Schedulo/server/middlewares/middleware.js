const customError = require('../utils/customError.js')
const ValidateEvents = require('../utils/ValidateEvents.js')
const ValidateReview = require('../utils/ValidateReview')
const ValidateUser = require('../utils/ValidateUser')
const ValidateRsvp = require('../utils/ValidateRsvp')
const User  = require('../models/user.js')
module.exports.eventValidation =  (req, res, next) => {
    const response = ValidateEvents.validate(req.body)
    if (response.error) {
        throw new customError(400, response.error.details[0].message)
    } else next()

}
module.exports.parseArraysMiddleware=(req, res, next)=> {
    ['cohosts', 'enums'].forEach((field) => {
        if (typeof req.body[field] === 'string') {
            try {
                req.body[field] = JSON.parse(req.body[field]);
            } catch {
                return res.status(400).send(`Invalid ${field} format`);
            }
        }
    });
    next();
}


module.exports.requireAuthUser =async (req, res, next) => {
    if (!req.user || !req.user.email) {
        return res.status(401).send({ error: 'Not authenticated' });
    }
    req.currentUser = await User.findOne({ email: req.user.email });
    if (!req.currentUser) {
        return res.status(404).send({ error: 'User not found' });
    }
    next();
};
module.exports.reviewValidation  = (req,res,next)=>{
   const response = ValidateReview.validate(req.body)
  if (response.error) {
    throw new customError(400, response.error.details[0].message)
  } else next()
}

module.exports.userValidation = (req, res, next) => {
  const response = ValidateUser.validate(req.body)
  if (response.error) {
    throw new customError(400, response.error.details[0].message)
  } else next()
}

//RSVP Validation
module.exports.rsvpValidation = (req, res, next) => {
    const response = ValidateRsvp.validate(req.body)
    if (response.error) {
        throw new customError(400, response.error.details[0].message)
    } else next()
}
