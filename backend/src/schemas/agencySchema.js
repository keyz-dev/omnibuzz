const Joi = require("joi");
const TownUtils = require("../utils/townUtils");
const { singleImageSchema, imageArraySchema } = require("../utils/imageUtils");

// Common schemas
const contactInfoSchema = Joi.array().items(
  Joi.object({
    type: Joi.string().required(),
    value: Joi.string().required(),
  })
);

// Create Agency Schema
const createAgencySchema = Joi.object({
  name: Joi.string().required(),
  headAddress: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  logoURL: singleImageSchema,
  contactInfo: contactInfoSchema.default([]),
  images: imageArraySchema,
  towns: Joi.array()
    .items(Joi.string())
    .required()
    .custom((value, helpers) => {
      if (!TownUtils.validateTowns(value)) {
        return helpers.error("any.invalid", {
          message: "One or more towns are not valid",
        });
      }
      return value;
    }),
  ownerId: Joi.string().guid().required(),
});

// Update Agency Schema
const updateAgencySchema = Joi.object({
  name: Joi.string(),
  headAddress: Joi.string(),
  description: Joi.string().allow(null, ""),
  logoURL: singleImageSchema,
  contactInfo: contactInfoSchema,
  images: imageArraySchema,
  towns: Joi.array()
    .items(Joi.string())
    .custom((value, helpers) => {
      if (!TownUtils.validateTowns(value)) {
        return helpers.error("any.invalid", {
          message: "One or more towns are not valid",
        });
      }
      return value;
    }),
  isPublished: Joi.boolean(),
  isVerified: Joi.boolean(),
}).min(1); // At least one field must be provided for update

module.exports = {
  createAgencySchema,
  updateAgencySchema,
};
