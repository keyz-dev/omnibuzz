const Joi = require("joi");
const TownUtils = require("../utils/townUtils");
const { imageArraySchema } = require("../utils/imageUtils");
const { noEmojiString } = require("../utils/validationUtils");

// Common schemas
const townSchema = Joi.string().custom((value, helpers) => {
  const town = TownUtils.getTownByName(value);
  if (!town) {
    return helpers.error("any.invalid", { message: "Invalid town" });
  }
  return value;
});

const destinationsSchema = Joi.array()
  .items(Joi.string())
  .custom((value, helpers) => {
    if (!Array.isArray(value)) {
      return helpers.error("any.invalid", {
        message: "Destinations must be an array",
      });
    }

    const baseTown = helpers.state.ancestors[0].baseTown;
    const invalidTowns = value.filter((town) => {
      const townInfo = TownUtils.getTownByName(town);
      return (
        !townInfo || townInfo.name.toLowerCase() === baseTown.toLowerCase()
      );
    });

    if (invalidTowns.length > 0) {
      return helpers.error("any.invalid", {
        message: `Invalid destinations: ${invalidTowns.join(", ")}`,
      });
    }

    return value;
  });

const coordinatesSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

const contactInfoSchema = Joi.array().items(
  Joi.object({
    type: Joi.string().required(),
    value: Joi.string().required(),
  })
);

const paymentMethodSchema = Joi.object({
  method: Joi.string().valid("OM", "MoMo").required(),
  value: Joi.object({
    accountName: Joi.string().required(),
    accountNumber: Joi.string().required(),
  }).required(),
});

// Create Station Schema
const createStationSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().allow("", null),
  address: Joi.string().required(),
  coordinates: coordinatesSchema.required(),
  contactInfo: contactInfoSchema.required(),
  neighborhood: Joi.string().required(),
  baseTown: townSchema.required(),
  destinations: destinationsSchema.default([]),
  images: imageArraySchema,
  isActive: Joi.boolean().default(false),
  paymentMethods: Joi.array().items(paymentMethodSchema).min(1).required(),
});

// Update Station Schema
const updateStationSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().allow("", null),
  address: Joi.string(),
  neighborhood: Joi.string(),
  coordinates: coordinatesSchema,
  contactInfo: contactInfoSchema,
  images: imageArraySchema,
  paymentMethods: Joi.array().items(paymentMethodSchema).min(1),
  baseTown: townSchema,
  destinations: destinationsSchema,
  isActive: Joi.boolean(),
}).min(1); // At least one field must be provided for update

// Add Destination Schema
const addDestinationSchema = Joi.object({
  destinationTown: townSchema.required(),
});

// Remove Destination Schema
const removeDestinationSchema = Joi.object({
  destinationTown: Joi.string().required(),
});

module.exports = {
  createStationSchema,
  updateStationSchema,
  addDestinationSchema,
  removeDestinationSchema,
};
