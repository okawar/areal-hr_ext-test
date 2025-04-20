const Joi = require('joi');

const EmpSchema = Joi.object({
  id: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'ID должен быть числом',
      'number.integer': 'ID должен быть целым числом',
      'number.positive': 'ID должен быть положительным числом'
    }),
  first_name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Имя должно быть строкой',
      'string.empty': 'Имя не может быть пустым',
      'string.min': 'Имя должно содержать минимум {#limit} символа',
      'string.max': 'Имя не может превышать {#limit} символов',
      'any.required': 'Имя обязательно для заполнения'
    }),
  last_name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Фамилия должна быть строкой',
      'string.empty': 'Фамилия не может быть пустой',
      'string.min': 'Фамилия должна содержать минимум {#limit} символа',
      'string.max': 'Фамилия не может превышать {#limit} символов',
      'any.required': 'Фамилия обязательна для заполнения'
    }),
  middle_name: Joi.string().trim().min(2).max(100).allow('').optional()
    .messages({
      'string.base': 'Отчество должно быть строкой',
      'string.min': 'Отчество должно содержать минимум {#limit} символа',
      'string.max': 'Отчество не может превышать {#limit} символов'
    }),
  birth_date: Joi.date().iso().required()
    .messages({
      'date.base': 'Дата рождения должна быть датой',
      'date.format': 'Дата рождения должна быть в формате YYYY-MM-DD',
      'any.required': 'Дата рождения обязательна для заполнения'
    }),
  passport_series: Joi.string().trim().pattern(/^\d{4}$/).required()
    .messages({
      'string.base': 'Серия паспорта должна быть строкой',
      'string.empty': 'Серия паспорта не может быть пустой',
      'string.pattern.base': 'Серия паспорта должна состоять из 4 цифр',
      'any.required': 'Серия паспорта обязательна для заполнения'
    }),
  passport_number: Joi.string().trim().pattern(/^\d{6}$/).required()
    .messages({
      'string.base': 'Номер паспорта должен быть строкой',
      'string.empty': 'Номер паспорта не может быть пустым',
      'string.pattern.base': 'Номер паспорта должен состоять из 6 цифр',
      'any.required': 'Номер паспорта обязателен для заполнения'
    }),
  passport_issue_date: Joi.date().iso().required()
    .messages({
      'date.base': 'Дата выдачи паспорта должна быть датой',
      'date.format': 'Дата выдачи паспорта должна быть в формате YYYY-MM-DD',
      'any.required': 'Дата выдачи паспорта обязательна для заполнения'
    }),
  passport_issued_by: Joi.string().trim().min(5).max(200).required()
    .messages({
      'string.base': 'Орган выдачи должен быть строкой',
      'string.empty': 'Орган выдачи не может быть пустым',
      'string.min': 'Орган выдачи должен содержать минимум {#limit} символов',
      'string.max': 'Орган выдачи не может превышать {#limit} символов',
      'any.required': 'Орган выдачи обязателен для заполнения'
    }),
  region: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Регион должен быть строкой',
      'string.empty': 'Регион не может быть пустым',
      'string.min': 'Регион должен содержать минимум {#limit} символа',
      'string.max': 'Регион не может превышать {#limit} символов',
      'any.required': 'Регион обязателен для заполнения'
    }),
  locality: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Населённый пункт должен быть строкой',
      'string.empty': 'Населённый пункт не может быть пустым',
      'string.min': 'Населённый пункт должен содержать минимум {#limit} символа',
      'string.max': 'Населённый пункт не может превышать {#limit} символов',
      'any.required': 'Населённый пункт обязателен для заполнения'
    }),
  street: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Улица должна быть строкой',
      'string.empty': 'Улица не может быть пустой',
      'string.min': 'Улица должна содержать минимум {#limit} символа',
      'string.max': 'Улица не может превышать {#limit} символов',
      'any.required': 'Улица обязательна для заполнения'
    }),
  house: Joi.string().trim().max(10).required()
    .messages({
      'string.base': 'Дом должен быть строкой',
      'string.empty': 'Дом не может быть пустым',
      'string.max': 'Дом не может превышать {#limit} символов',
      'any.required': 'Дом обязателен для заполнения'
    }),
  building: Joi.string().trim().max(10).allow('').optional()
    .messages({
      'string.base': 'Корпус должен быть строкой',
      'string.max': 'Корпус не может превышать {#limit} символов'
    }),
  apartment: Joi.string().trim().max(10).allow('').optional()
    .messages({
      'string.base': 'Квартира должна быть строкой',
      'string.max': 'Квартира не может превышать {#limit} символов'
    }),
  department_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID отдела должен быть числом',
      'number.integer': 'ID отдела должен быть целым числом',
      'number.positive': 'ID отдела должен быть положительным числом',
      'any.required': 'ID отдела обязателен для заполнения'
    }),
  position_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID должности должен быть числом',
      'number.integer': 'ID должности должен быть целым числом',
      'number.positive': 'ID должности должен быть положительным числом',
      'any.required': 'ID должности обязателен для заполнения'
    }),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  deleted_at: Joi.date().allow(null).optional()
}).options({ stripUnknown: true, abortEarly: false });

module.exports = { EmpSchema };