const logger = require("../utils/logger");
const Joi = require("joi");
const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require("sequelize");
const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, {
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    stack: err.stack,
  });

  // Handle Joi validation errors
  if (err instanceof Joi.ValidationError) {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: err.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  // Handle Sequelize validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle Sequelize unique constraint errors
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      status: false,
      message: "Duplicate entry",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: `${e.path} already exists`,
      })),
    });
  }

  // Handle Sequelize foreign key constraint errors
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      status: false,
      message: "Reference error",
      error: "Referenced record does not exist",
    });
  }

  // Handle file upload errors
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "File size too large. Maximum size is 8MB",
      LIMIT_FILE_COUNT: "Too many files uploaded",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field",
    };

    return res.status(400).json({
      status: false,
      message: "File upload error",
      error: messages[err.code] || err.message,
    });
  }

  // Handle custom application errors
  if (err.status) {
    return res.status(err.status).json({
      status: false,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Handle all other errors
  return res.status(500).json({
    status: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

module.exports = errorHandler;
