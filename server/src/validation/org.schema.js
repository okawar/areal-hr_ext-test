const Joi = require('joi');

const orgSchema = Joi.object({
  id: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'ID должен быть числом',
      'number.integer': 'ID должен быть целым числом',
      'number.positive': 'ID должен быть положительным числом'
    }),
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Название должно быть строкой',
      'string.empty': 'Название не может быть пустым',
      'string.min': 'Название должно содержать минимум {#limit} символа',
      'string.max': 'Название не может превышать {#limit} символов',
      'any.required': 'Название обязательно для заполнения'
    }),
  comment: Joi.string().trim().allow('').max(500).optional()
    .messages({
      'string.base': 'Комментарий должен быть строкой',
      'string.max': 'Комментарий не может превышать {#limit} символов'
    }),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  deleted_at: Joi.date().allow(null).optional()
}).options({ stripUnknown: true, abortEarly: false });

module.exports = { orgSchema };