const Joi = require("joi");
const { singleImageSchema } = require("../utils/imageUtils");
const { noEmojiString } = require("../utils/validationUtils");

// Assign worker schema
const passwordSchema = Joi.string().min(6).max(100);

const assignWorkerSchema = Joi.object({
  stationId: Joi.string().uuid().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("station_manager", "ticket_agent").required(),
  phone: Joi.string().required(),
});

// Accept invitation schema
const acceptInvitationSchema = Joi.object({
  token: Joi.string().required(),
  password: passwordSchema.required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
  avatar: singleImageSchema,
});

// Schema for updating an existing worker
const updateWorkerSchema = Joi.object({
  role: Joi.string().valid("station_manager", "ticket_agent").optional(),
  stationId: Joi.string().uuid().optional(),
}).min(1); // Requires at least one field to be updated

module.exports = {
  assignWorkerSchema,
  acceptInvitationSchema,
  updateWorkerSchema,
};
