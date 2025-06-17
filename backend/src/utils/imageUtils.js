const Joi = require("joi");

const isLocalImageUrl = (url) => {
  // Check if it's a local file path (development)
  return url.startsWith("src/uploads/") || url.startsWith("/uploads/");
};

const isCloudinaryUrl = (url) => {
  // Check if it's a Cloudinary URL (production)
  return url.includes("cloudinary.com");
};

const validateImageUrl = (url, helpers) => {
  if (process.env.NODE_ENV === "production") {
    if (!isCloudinaryUrl(url)) {
      return helpers.error("any.invalid", {
        message: "Image must be uploaded to Cloudinary in production",
      });
    }
  } else {
    if (!isLocalImageUrl(url)) {
      return helpers.error("any.invalid", {
        message: "Image must be uploaded to local storage in development",
      });
    }
  }
  return url;
};

// Joi extension for image validation
const imageUrlSchema = Joi.string().custom(validateImageUrl);

// Schema for single image
const singleImageSchema = imageUrlSchema.allow(null, "").optional();

// Schema for array of images
const imageArraySchema = Joi.array().items(imageUrlSchema).allow(null);

module.exports = {
  isLocalImageUrl,
  isCloudinaryUrl,
  validateImageUrl,
  singleImageSchema,
  imageArraySchema,
};
