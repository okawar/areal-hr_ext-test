const Joi = require('joi');

const loginSchema = Joi.object({
  login: Joi.string().required().messages({
    'string.empty': 'Логин не может быть пустым',
    'any.required': 'Логин обязателен',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Пароль не может быть пустым',
    'any.required': 'Пароль обязателен',
  }),
});

module.exports = {
  loginSchema,
};
