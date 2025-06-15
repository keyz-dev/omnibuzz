const Joi = require("joi");

const documentSchema = Joi.object({
  type: Joi.string()
    .valid(
      "business_registration",
      "tax_clearance",
      "operating_license",
      "insurance_certificate",
      "safety_certificate",
      "vehicle_registration",
      "driver_license",
      "other"
    )
    .required(),
  fileType: Joi.string()
    .valid("application/pdf", "image/jpeg", "image/png")
    .required(),
  file: Joi.object({
    filename: Joi.string().required(),
    originalname: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number()
      .max(10 * 1024 * 1024)
      .required(),
    path: Joi.string().required(),
  }).required(),
});

module.exports = { documentSchema };
