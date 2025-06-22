const Joi = require('joi');

const createRouteSchema = Joi.object({
    originStationId: Joi.string().uuid().required().messages({
        'string.guid': 'Origin station ID must be a valid UUID.',
        'any.required': 'Origin station is required.',
    }),
    destinationStationId: Joi.string().uuid().required().messages({
        'string.guid': 'Destination station ID must be a valid UUID.',
        'any.required': 'Destination station is required.',
    }),
    distance: Joi.number().positive().required().messages({
        'number.base': 'Distance must be a number.',
        'number.positive': 'Distance must be a positive number.',
        'any.required': 'Distance is required.',
    }),
    estimatedDuration: Joi.number().positive().required().messages({
        'number.base': 'Estimated duration must be a number.',
        'number.positive': 'Estimated duration must be a positive number.',
        'any.required': 'Estimated duration is required.',
    }),
    basePrice: Joi.number().positive().required().messages({
        'number.base': 'Base price must be a number.',
        'number.positive': 'Base price must be a positive number.',
        'any.required': 'Base price is required.',
    }),
    status: Joi.string().valid('Active', 'Inactive').optional().messages({
        'any.only': 'Status must be one of [Active, Inactive].',
    }),
});

const updateRouteSchema = Joi.object({
    originStationId: Joi.string().uuid().messages({
        'string.guid': 'Origin station ID must be a valid UUID.',
    }),
    destinationStationId: Joi.string().uuid().messages({
        'string.guid': 'Destination station ID must be a valid UUID.',
    }),
    distance: Joi.number().positive().messages({
        'number.base': 'Distance must be a number.',
        'number.positive': 'Distance must be a positive number.',
    }),
    estimatedDuration: Joi.number().positive().messages({
        'number.base': 'Estimated duration must be a number.',
        'number.positive': 'Estimated duration must be a positive number.',
    }),
    basePrice: Joi.number().positive().messages({
        'number.base': 'Base price must be a number.',
        'number.positive': 'Base price must be a positive number.',
    }),
    status: Joi.string().valid('Active', 'Inactive').messages({
        'any.only': 'Status must be one of [Active, Inactive].',
    }),
}).min(1);

module.exports = {
    createRouteSchema,
    updateRouteSchema,
};
