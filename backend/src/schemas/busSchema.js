const Joi = require('joi');

const createBusSchema = Joi.object({
    plateNumber: Joi.string().trim().required().messages({
        'string.base': 'Plate number must be a string.',
        'string.empty': 'Plate number is required.',
        'any.required': 'Plate number is required.',
    }),
    busType: Joi.string().valid('Classic', 'VIP', 'Standard').required().messages({
        'any.only': 'Bus type must be one of [Classic, VIP, Standard].',
        'any.required': 'Bus type is required.',
    }),
    capacity: Joi.number().integer().min(10).required().messages({
        'number.base': 'Capacity must be a number.',
        'number.integer': 'Capacity must be an integer.',
        'number.min': 'Capacity must be at least 10.',
        'any.required': 'Capacity is required.',
    }),
    seatLayout: Joi.string().trim().required().messages({
        'string.empty': 'Seat layout is required.',
        'any.required': 'Seat layout is required.',
    }),
    baseStationId: Joi.string().uuid().required().messages({
        'string.guid': 'Base station ID must be a valid UUID.',
        'any.required': 'Base station is required.',
    }),
    amenities: Joi.array().optional(),
    agencyId: Joi.string().uuid().required().messages({
        'string.guid': 'Agency ID must be a valid UUID.',
        'any.required': 'Agency ID is required.',
    }),
});

const updateBusSchema = Joi.object({
    plateNumber: Joi.string().trim(),
    busType: Joi.string().valid('Classic', 'VIP', 'Standard'),
    capacity: Joi.number().integer().min(10),
    seatLayout: Joi.string().trim(),
    baseStationId: Joi.string().uuid(),
    status: Joi.string().valid('Active', 'Available', 'Under Maintenance', 'Inactive'),
    amenities: Joi.object(),
    agencyId: Joi.string().uuid().optional().messages({
        'string.guid': 'Agency ID must be a valid UUID.',
    }),
}).min(1);

module.exports = {
    createBusSchema,
    updateBusSchema,
};
