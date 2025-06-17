const Joi = require("joi");
const { singleImageSchema } = require("../utils/imageUtils");

// Common schemas
const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string().min(6).max(100);
const phoneSchema = Joi.string().pattern(/^\+?[\d\s-]{10,}$/);
const roleSchema = Joi.string().valid(
  "passenger",
  "system_admin",
  "agency_admin",
  "station_manager",
  "ticket_agent"
);

// Create User Schema
const createUserSchema = Joi.object({
  fullName: Joi.string().required(),
  email: emailSchema,
  phone: phoneSchema.allow(null, ""),
  password: passwordSchema.required(),
  avatar: singleImageSchema,
  authProvider: Joi.string().valid("local", "google").default("local"),
  role: roleSchema.default("passenger"),
  isActive: Joi.boolean().default(true),
  emailVerified: Joi.boolean().default(false),
  phoneVerified: Joi.boolean().default(false),
});

// Update User Schema
const updateUserSchema = Joi.object({
  fullName: Joi.string(),
  email: emailSchema,
  phone: phoneSchema.allow(null, ""),
  password: passwordSchema,
  avatar: singleImageSchema,
  authProvider: Joi.string().valid("local", "google").default("local"),
  role: roleSchema,
  isActive: Joi.boolean(),
  emailVerified: Joi.boolean(),
  phoneVerified: Joi.boolean(),
}).min(1); // At least one field must be provided for update

// Password Reset Schema
const passwordResetSchema = Joi.object({
  code: Joi.string().required(),
  password: passwordSchema.required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});

// Google Login Schema
const googleLoginSchema = Joi.object({
  access_token: Joi.string().required(),
  role: Joi.string().valid("passenger", "agency_admin").default("passenger"),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  passwordResetSchema,
  googleLoginSchema,
};
