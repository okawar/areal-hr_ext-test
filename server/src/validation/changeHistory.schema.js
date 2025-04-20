const Joi = require('joi');

const ChangeHistorySchema = Joi.object({
  change_time: Joi.date().default(() => new Date()),
  change_by: Joi.number().integer().positive().default(1),
  object_type: Joi.string().valid('organization', 'department', 'position', 'employee', 'hr_operations').required(),
  object_id: Joi.number().integer().positive().required(),
  changed_fields: Joi.object().required(),
  created_at: Joi.date().default(() => new Date()),
}).unknown(true);

module.exports = { ChangeHistorySchema };
