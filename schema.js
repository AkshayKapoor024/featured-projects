// schema.js
const joi = require('joi');

module.exports = joi.object({
    title: joi.string().required(),
    desc: joi.string().required(),
    image: joi.any().optional(),
    location: joi.string().required(),
    country: joi.string().required(),
    price: joi.number().required().min(0),
    owner:joi.string()
});
