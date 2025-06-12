const Joi = require("joi");
const { singleImageSchema } = require("../utils/imageUtils");

// Common schemas
const fileTypeSchema = Joi.string().custom((value, helpers) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/svg",
    "image/ico",
  ];

  if (!allowedTypes.includes(value.toLowerCase())) {
    return helpers.error("any.invalid", {
      message:
        "Invalid file type. Allowed types: PDF, JPEG, PNG, WEBP, SVG, ICO",
    });
  }
  return value;
});

// Create Verification Document Schema
const createVerificationDocumentSchema = Joi.object({
  type: Joi.string().required(),
  fileType: fileTypeSchema.required(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
  url: singleImageSchema.required(),
  agencyId: Joi.string().guid().required(),
});

// Update Verification Document Schema
const updateVerificationDocumentSchema = Joi.object({
  type: Joi.string(),
  fileType: fileTypeSchema,
  status: Joi.string().valid("pending", "approved", "rejected"),
  url: singleImageSchema,
}).min(1); // At least one field must be provided for update

module.exports = {
  createVerificationDocumentSchema,
  updateVerificationDocumentSchema,
};
