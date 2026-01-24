const Joi = require('joi');

const matchValidation = Joi.object({
    mode: Joi.string().required(),

    players: Joi.array()
        .items(Joi.string().hex().length(24))
        .min(2)
        .required(),

    winner: Joi.string().hex().length(24).allow(null),

    startTime: Joi.date(),
    endTime: Joi.date(),

    duration: Joi.number().min(0),

    status: Joi.string().valid('completed', 'abandoned', 'draw'),

    resultType: Joi.string().valid('firstCorrect', 'timeout')
});

module.exports = matchValidation;
