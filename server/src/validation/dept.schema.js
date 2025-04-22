const Joi = require('joi');

const deptSchema = Joi.object({
  id: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID должен быть числом',
    'number.integer': 'ID должен быть целым числом',
    'number.positive': 'ID должен быть положительным числом',
  }),
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Название должно быть строкой',
    'string.empty': 'Название не может быть пустым',
    'string.min': 'Название должно содержать минимум {#limit} символа',
    'string.max': 'Название не может превышать {#limit} символов',
    'any.required': 'Название обязательно для заполнения',
  }),
  organization_id: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'ID организации должен быть числом',
    'number.integer': 'ID организации должен быть целым числом',
    'number.positive': 'ID организации должен быть положительным числом',
  }),
  parent_id: Joi.number().integer().positive().allow(null).optional().messages({
    'number.base': 'ID родительского отдела должен быть числом',
    'number.integer': 'ID родительского отдела должен быть целым числом',
    'number.positive': 'ID родительского отдела должен быть положительным числом',
  }),
  comment: Joi.string().allow('').allow(null).optional().messages({
    'string.base': 'Комментарий должен быть строкой',
  }),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  deleted_at: Joi.date().allow(null).optional(),
}).options({ stripUnknown: true, abortEarly: false });

module.exports = { deptSchema };
