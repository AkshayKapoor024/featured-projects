const joi = require('joi')
module.exports =new joi.object({
rating:joi.number().required(),
comment:joi.string().required(),
author:joi.string().optional(),
event:joi.string().optional()
})
