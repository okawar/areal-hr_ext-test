const Joi = require("joi");


const orgSchema = Joi.object({
    id: Joi.number().integer().optional(),
    name: Joi.string().min(2).max(100).required(),
    comment: Joi.string().allow("").optional()
});

module.exports = {orgSchema}