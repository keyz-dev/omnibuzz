const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");
const { uploadToCloudinary } = require("../utils/cloudinary");

class UploadService {
  constructor() {
    if (process.env.NODE_ENV === "production") {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    } else {
      // Local storage configuration
      this.storage = multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(__dirname, "../../uploads");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              "-" +
              uniqueSuffix +
              path.extname(file.originalname)
          );
        },
      });
    }
  }

  getUploadMiddleware() {
    if (process.env.NODE_ENV === "production") {
      return multer({ storage: multer.memoryStorage() });
    }
    return multer({ storage: this.storage });
  }

  async uploadFile(file, folder = "general") {
    try {
      if (process.env.NODE_ENV === "production") {
        // Upload to Cloudinary using the shared utility
        const buffer = fs.readFileSync(file.path);
        const result = await uploadToCloudinary(buffer, {
          folder,
          resource_type: "auto",
        });
        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } else {
        // Return local file path
        return {
          url: `/uploads/${path.basename(file.path)}`,
          publicId: null,
        };
      }
    } catch (error) {
      logger.error("Error uploading file", { error });
      throw error;
    }
  }

  async deleteFile(publicId) {
    try {
      if (process.env.NODE_ENV === "production") {
        await cloudinary.uploader.destroy(publicId);
      } else {
        const filePath = path.join(__dirname, "../../uploads", publicId);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      logger.error("Error deleting file", { error });
      throw error;
    }
  }
}

module.exports = new UploadService();
