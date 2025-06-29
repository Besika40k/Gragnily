const Joi = require("joi");

exports.createVal = Joi.object({
  name: Joi.string().min(2).required(),
  birth_year: Joi.number().integer().max(new Date().getFullYear()).optional(),
  nationality: Joi.string().optional(),
  biography: Joi.string().optional(),
});
