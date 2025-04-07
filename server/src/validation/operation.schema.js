const Joi = require("joi");


const operationSchema = Joi.object({
  employee_id: Joi.number().integer().positive().required(),
  department_id: Joi.number().integer().positive().optional(),
  position_id: Joi.number().integer().positive().optional(),
  operation_type: Joi.string().valid(
    'hire',
    'change_department',
    'change_salary',
    'dissmissal'
  ).required(),
  salary: Joi.number().positive().optional(),
  operation_date: Joi.date().required(),
  comment: Joi.string().allow("").optional()
});

module.exports = {operationSchema}