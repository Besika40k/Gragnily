const Joi = require("joi");

const ragDataItemSchema = Joi.object({
  text: Joi.string().required(),
  source: Joi.string().required(),
});

exports.ragValidation = Joi.array().items(ragDataItemSchema).required();
