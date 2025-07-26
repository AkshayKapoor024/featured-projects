const joi = require('joi')
module.exports = new joi.object({
     status:joi.string().required(),
        username:joi.string().required(),
        email:joi.string().required(),
        userid:joi.string().optional(),
        eventid:joi.string().optional(),
        timestamp:joi.date().optional(),
        checkedIn:joi.boolean().optional(),
        feedback:joi.string().optional(),
        info:joi.string().optional(),
        ticketId:joi.string().optional(),
        ticketURL:joi.string().optional(),
        ticketUsed:joi.boolean().optional()
})
