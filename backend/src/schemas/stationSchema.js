const Joi = require("joi");
const TownUtils = require("../utils/townUtils");

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

// Create Station Schema
const createStationSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  neighborhood: Joi.string().required(),
  baseTown: townSchema.required(),
  destinations: destinationsSchema.default([]),
  agencyId: Joi.string().guid().required(),
  isActive: Joi.boolean().default(true),
});

// Update Station Schema
const updateStationSchema = Joi.object({
  name: Joi.string(),
  address: Joi.string(),
  neighborhood: Joi.string(),
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
