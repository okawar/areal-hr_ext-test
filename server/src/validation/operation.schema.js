const Joi = require('joi');

const operationSchema = Joi.object({
  id: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID должен быть числом',
    'number.integer': 'ID должен быть целым числом',
    'number.positive': 'ID должен быть положительным числом',
  }),
  employee_id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID сотрудника должен быть числом',
    'number.integer': 'ID сотрудника должен быть целым числом',
    'number.positive': 'ID сотрудника должен быть положительным числом',
    'any.required': 'ID сотрудника обязателен для заполнения',
  }),
  department_id: Joi.alternatives().conditional('action_type', {
    is: Joi.valid('hire', 'change_department'),
    then: Joi.number().integer().positive().required().messages({
      'number.base': 'ID отдела должен быть числом',
      'number.integer': 'ID отдела должен быть целым числом',
      'number.positive': 'ID отдела должен быть положительным числом',
      'any.required': 'ID отдела обязателен при приеме на работу или переводе',
    }),
    otherwise: Joi.number().integer().positive().allow(null).optional().messages({
      'number.base': 'ID отдела должен быть числом',
      'number.integer': 'ID отдела должен быть целым числом',
      'number.positive': 'ID отдела должен быть положительным числом',
    }),
  }),
  position_id: Joi.alternatives().conditional('action_type', {
    is: Joi.valid('hire', 'change_department'),
    then: Joi.number().integer().positive().required().messages({
      'number.base': 'ID должности должен быть числом',
      'number.integer': 'ID должности должен быть целым числом',
      'number.positive': 'ID должности должен быть положительным числом',
      'any.required': 'ID должности обязателен при приеме на работу или переводе',
    }),
    otherwise: Joi.number().integer().positive().allow(null).optional().messages({
      'number.base': 'ID должности должен быть числом',
      'number.integer': 'ID должности должен быть целым числом',
      'number.positive': 'ID должности должен быть положительным числом',
    }),
  }),
  action_type: Joi.string()
    .valid('hire', 'department_change', 'change_salary', 'dismissal')
    .required()
    .messages({
      'string.base': 'Тип операции должен быть строкой',
      'string.empty': 'Тип операции не может быть пустым',
      'any.only':
        'Тип операции должен быть одним из следующих: прием на работу, перевод, изменение оклада, увольнение',
      'any.required': 'Тип операции обязателен для заполнения',
    }),
  salary: Joi.alternatives().conditional('action_type', {
    is: Joi.valid('hire', 'change_salary'),
    then: Joi.number().precision(2).positive().required().messages({
      'number.base': 'Оклад должен быть числом',
      'number.positive': 'Оклад должен быть положительным числом',
      'number.precision': 'Оклад должен иметь не более 2 десятичных знаков',
      'any.required': 'Оклад обязателен при приеме на работу или изменении оклада',
    }),
    otherwise: Joi.number().precision(2).positive().allow(null).optional().messages({
      'number.base': 'Оклад должен быть числом',
      'number.positive': 'Оклад должен быть положительным числом',
      'number.precision': 'Оклад должен иметь не более 2 десятичных знаков',
    }),
  }),
  operation_date: Joi.date().iso().required().messages({
    'date.base': 'Дата операции должна быть датой',
    'date.format': 'Дата операции должна быть в формате YYYY-MM-DD',
    'any.required': 'Дата операции обязательна для заполнения',
  }),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  deleted_at: Joi.date().allow(null).optional(),
}).options({ stripUnknown: true, abortEarly: false });

module.exports = { operationSchema };
