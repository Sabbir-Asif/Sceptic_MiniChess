const Joi = require('joi');

const gameSchema = Joi.object({
    user: Joi.string().required().messages({
        'string.empty': 'User ID cannot be empty',
        'any.required': 'User ID is required'
    }),
    result: Joi.string().valid('win', 'lose', 'draw').required().messages({
        'any.only': 'Result must be either win, lose, or draw',
        'any.required': 'Result is required'
    }),
    history: Joi.array().items(
        Joi.object({
            move: Joi.string().required(),
            timestamp: Joi.date()
        })
    ).messages({
        'array.base': 'History must be an array'
    })
});

const validateGame = (gameData) => {
    return gameSchema.validate(gameData, { abortEarly: false });
};

module.exports = validateGame;