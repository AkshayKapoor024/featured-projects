const joi = require('joi')

module.exports = new joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    type: joi.string().required(),
    date: joi.date().required(),
    time: joi.string().required(),
    venue: joi.string().required(),
    banner: joi.string().optional(),
    host: joi.string().required(),
    cohosts: joi.array().items(joi.string()).required(),
    enums: joi.array().items(joi.string()).optional(),
    rsvps: joi.array().items(joi.string()).optional(),
    attendees: joi.array().items(joi.string()).optional(),
    createdAt: joi.string().optional(),
    owner: joi.string().optional(),
    reviews: joi.array().items(joi.string()).optional()
})