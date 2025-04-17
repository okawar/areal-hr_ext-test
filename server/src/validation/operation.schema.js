const Joi = require("joi");


const operationSchema = Joi.object({
  employee_id: Joi.number().integer().positive().required(),
  department_id: Joi.number().integer().positive().optional(),
  position_id: Joi.number().integer().positive().optional(),
  action_type: Joi.string().valid(
    'hire',
    'change_department',
    'change_salary',
    'dismissal'
  ).required(),
  salary: Joi.number().positive().optional(),
  operation_date: Joi.date().required(),
});

module.exports = {operationSchema}