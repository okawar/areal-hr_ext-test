const Joi = require('joi');

const fileSchema = Joi.object({
  employee_id: Joi.number().integer().positive().required(),
  file_name: Joi.string().required(),
  file_path: Joi.string().required(),
  comment: Joi.string().allow('').optional(),
});

module.exports = { fileSchema };
