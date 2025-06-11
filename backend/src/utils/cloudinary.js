const cloudinary = require("../config/cloudinary").cloudinary;

/**
 * Uploads a buffer to Cloudinary.
 * @param {Buffer} buffer - The file buffer to upload.
 * @param {Object} options - Upload options (e.g., folder, resource_type).
 * @returns {Promise<Object>} - The Cloudinary upload result.
 */
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

module.exports = { uploadToCloudinary };
