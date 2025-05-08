const Joi = require("joi");

exports.createVal = Joi.object({
  name: Joi.string().alphanum().min(2).required(),
  name_ge: Joi.string().alphanum().min(2).required(),
  birth_year: Joi.number().integer().max(new Date().getFullYear()).optional(),
  nationality: Joi.string().alphanum().optional(),
  biography: Joi.string().optional(),
  biography_ge: Joi.string().optional(),
});
