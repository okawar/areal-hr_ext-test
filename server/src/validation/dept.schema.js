const Joi = require("joi");

const deptSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    organization_id: Joi.number().integer().positive().required(),
    parent_id: Joi.number().integer().positive().allow(null).optional(),
    comment: Joi.string().allow("").optional()
});

module.exports = { deptSchema };