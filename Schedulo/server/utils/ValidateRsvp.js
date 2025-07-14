const joi = require('joi')
module.exports = new joi.object({
     status:joi.string().required(),
        usernname:joi.string().required(),
        email:joi.string().required(),
        userid:joi.string().required(),
        eventid:joi.string().required(),
        timestamp:joi.date().optional(),
        checkedIn:joi.boolean().optional(),
        feedback:joi.string().optional(),
        info:joi.string().optional(),
})