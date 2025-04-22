const Joi = require('joi');

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID должен быть числом',
    'number.integer': 'ID должен быть целым числом',
    'number.positive': 'ID должен быть положительным числом',
    'any.required': 'ID обязателен для заполнения',
  }),
}).options({ stripUnknown: true });

module.exports = { idSchema };
