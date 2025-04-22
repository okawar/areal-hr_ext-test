const Joi = require('joi');

const userSchema = Joi.object({
  id: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID должен быть числом',
    'number.integer': 'ID должен быть целым числом',
    'number.positive': 'ID должен быть положительным числом',
  }),
  last_name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Фамилия должна быть строкой',
    'string.empty': 'Фамилия не может быть пустой',
    'string.min': 'Фамилия должна содержать минимум {#limit} символа',
    'string.max': 'Фамилия не может превышать {#limit} символов',
    'any.required': 'Фамилия обязательна для заполнения',
  }),
  first_name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Имя должно быть строкой',
    'string.empty': 'Имя не может быть пустым',
    'string.min': 'Имя должно содержать минимум {#limit} символа',
    'string.max': 'Имя не может превышать {#limit} символов',
    'any.required': 'Имя обязательно для заполнения',
  }),
  middle_name: Joi.string().trim().min(2).max(100).allow('').optional().messages({
    'string.base': 'Отчество должно быть строкой',
    'string.min': 'Отчество должно содержать минимум {#limit} символа',
    'string.max': 'Отчество не может превышать {#limit} символов',
  }),
  login: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.base': 'Логин должен быть строкой',
      'string.empty': 'Логин не может быть пустым',
      'string.min': 'Логин должен содержать минимум {#limit} символа',
      'string.max': 'Логин не может превышать {#limit} символов',
      'string.pattern.base':
        'Логин может содержать только латинские буквы, цифры и знак подчеркивания',
      'any.required': 'Логин обязателен для заполнения',
    }),
  password: Joi.when('$isUpdate', {
    is: true,
    then: Joi.string().min(6).max(100).allow('').optional().messages({
      'string.base': 'Пароль должен быть строкой',
      'string.min': 'Пароль должен содержать минимум {#limit} символов',
      'string.max': 'Пароль не может превышать {#limit} символов',
    }),
    otherwise: Joi.string().min(6).max(100).required().messages({
      'string.base': 'Пароль должен быть строкой',
      'string.empty': 'Пароль не может быть пустым',
      'string.min': 'Пароль должен содержать минимум {#limit} символов',
      'string.max': 'Пароль не может превышать {#limit} символов',
      'any.required': 'Пароль обязателен для заполнения',
    }),
  }),
  role: Joi.string().valid('admin', 'user').required().messages({
    'string.base': 'Роль должна быть строкой',
    'string.empty': 'Роль не может быть пустой',
    'any.only': 'Роль может быть только admin или user',
    'any.required': 'Роль обязательна для заполнения',
  }),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  deleted_at: Joi.date().allow(null).optional(),
}).options({ stripUnknown: true, abortEarly: false });

module.exports = { userSchema };
