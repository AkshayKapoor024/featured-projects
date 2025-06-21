const joi = require('joi')
const passport = require('passport')

module.exports = joi.object({
    email:joi.string().required(),
    username:joi.string().required(),
    password:joi.string().required()
})