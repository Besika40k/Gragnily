const Joi = require("joi");
const subjects = require("../constants/subjects");

exports.createVal = Joi.object({
  title: Joi.string().required(),
  subject: Joi.string().valid(subjects).required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  publisher_name: Joi.string().required(),
  publication_year: Joi.number()
    .integer()
    .max(new Date().getFullYear())
    .required(),
  description: Joi.string().optional(),
  language: Joi.string().required(),
});
