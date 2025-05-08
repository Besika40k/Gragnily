const Joi = require("joi");

exports.createVal = Joi.object({
  title: Joi.string().required(),
  title_ge: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  genre_ge: Joi.string().required(),
  publisher_name: Joi.string().required(),
  publication_year: Joi.number()
    .integer()
    .max(new Date().getFullYear())
    .required(),
  description: Joi.string().optional(),
  description_ge: Joi.string().optional(),
  language: Joi.string().required(),
  language_ge: Joi.string().optional(),
});
