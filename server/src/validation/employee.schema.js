const Joi = require("joi");

const EmpSchema = Joi.object({
    last_name: Joi.string().min(2).max(50).required(),
    first_name: Joi.string().min(2).max(50).required(),
    middle_name: Joi.string().allow(null, "").optional(),

    birth_date: Joi.date().required(),

    passport_series: Joi.string().pattern(/^\d{4}$/).required(),
    passport_number: Joi.string().pattern(/^\d{6}$/).required(),
    passport_issue_date: Joi.date().required(),
    passport_issued_by: Joi.string().min(5).max(100).required(),

    region: Joi.string().min(2).max(50).required(),
    locality: Joi.string().min(2).max(50).required(),
    street: Joi.string().min(2).max(50).required(),
    house: Joi.string().min(1).max(10).required(),
    building: Joi.string().allow(null, "").optional(),
    apartment: Joi.string().allow(null, "").optional(),

    department_id: Joi.number().integer().positive().required(),
    position_id: Joi.number().integer().positive().required(),

    is_deleted: Joi.boolean().default(false),

    created_at: Joi.date().default(() => new Date()),
    updated_at: Joi.date().default(() => new Date()),
    deleted_at: Joi.date().allow(null).optional()
}).unknown(true);

module.exports = { EmpSchema };