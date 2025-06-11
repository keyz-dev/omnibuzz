const Joi = require("joi");

const validateRequest = (data, schema) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  return { error, value };
};

module.exports = { validateRequest };
