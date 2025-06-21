const joi = require('joi')

module.exports = joi.object({
    comment:joi.string().required(),
    rating:joi.number().required().min(1).max(5)
})