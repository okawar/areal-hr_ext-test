const Joi = require('joi');

const fileSchema = Joi.object({
  id: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'ID должен быть числом',
      'number.integer': 'ID должен быть целым числом',
      'number.positive': 'ID должен быть положительным числом'
    }),
  employee_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID сотрудника должен быть числом',
      'number.integer': 'ID сотрудника должен быть целым числом',
      'number.positive': 'ID сотрудника должен быть положительным числом',
      'any.required': 'ID сотрудника обязателен для заполнения'
    }),
  file_name: Joi.string().trim().min(1).max(255).optional()
    .messages({
      'string.base': 'Имя файла должно быть строкой',
      'string.empty': 'Имя файла не может быть пустым',
      'string.min': 'Имя файла должно содержать минимум {#limit} символ',
      'string.max': 'Имя файла не может превышать {#limit} символов',
      'any.required': 'Имя файла обязательно для заполнения'
    }),
  file_path: Joi.string().trim().min(1).max(500).required()
    .messages({
      'string.base': 'Путь к файлу должен быть строкой',
      'string.empty': 'Путь к файлу не может быть пустым',
      'string.min': 'Путь к файлу должен содержать минимум {#limit} символ',
      'string.max': 'Путь к файлу не может превышать {#limit} символов',
      'any.required': 'Путь к файлу обязателен для заполнения'
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

module.exports = { fileSchema };