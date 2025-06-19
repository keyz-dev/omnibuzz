const Joi = require("joi");
const TownUtils = require("../utils/townUtils");
const { singleImageSchema, imageArraySchema } = require("../utils/imageUtils");
const { noEmojiString } = require("../utils/validationUtils");

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
  logo: singleImageSchema,
  contactInfo: contactInfoSchema.default([]),
  agencyImages: imageArraySchema,
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
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }),
});

// Update Agency Schema
const updateAgencySchema = Joi.object({
  name: Joi.string(),
  headAddress: Joi.string(),
  description: Joi.string().allow(null, ""),
  logo: singleImageSchema,
  contactInfo: contactInfoSchema,
  agencyImages: imageArraySchema,
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
  ownerId: Joi.string().guid(),
  coordinates: Joi.object({
    lat: Joi.number(),
    lng: Joi.number(),
  }),
}).min(1); // At least one field must be provided for update

module.exports = {
  createAgencySchema,
  updateAgencySchema,
};
