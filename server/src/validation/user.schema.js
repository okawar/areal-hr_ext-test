const Joi = require('joi');

const userSchema = Joi.object({
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  middle_name: Joi.string().allow(null, ''),
  login: Joi.string().required(),
  password: Joi.string().when('$isUpdate', {
    is: true,
    then: Joi.string().allow(null, ''),
    otherwise: Joi.string().required(),
  }),
  role: Joi.string().valid('admin', 'hr_manager').required(),
}).options({ stripUnknown: true });

module.exports = { userSchema };
