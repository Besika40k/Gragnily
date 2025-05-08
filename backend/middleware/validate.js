// eslint-disable-next-line no-unused-vars
const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(d => d.message),
    });
  }
  req.body = value; // use the validated/sanitized value
  next();
};

module.exports = validate;
