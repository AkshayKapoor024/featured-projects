const joi = require('joi');
const User = require('../models/User');

const userValidationSchema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6),
    createdAt: joi.date().default(Date.now),
    rating: joi.number().default(1200),
    matchesPlayed: joi.number().default(0),
    matchesWon: joi.number().default(0),
    matchesLost: joi.number().default(0),
    matchesDrawn: joi.number().default(0),
    matchHistory: joi.array().items(joi.string()),
    lastActive: joi.date().default(Date.now),
    isOnline: joi.boolean().default(false),
    languagesKnown: joi.array().items(joi.string()),
    avatarUrl: joi.string().uri(),
    bio:joi.string(),
    country: joi.string(),
});
module.exports = userValidationSchema;