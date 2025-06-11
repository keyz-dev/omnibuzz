const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      // Determine folder based on file type
      if (file.fieldname === "avatar") {
        return "avatars";
      } else if (
        file.fieldname === "agencyLogo" ||
        file.fieldname === "agencyImages"
      ) {
        return "agencies";
      } else if (file.fieldname === "stationImages") {
        return "stations";
      } else if (file.fieldname === "document") {
        return "documents";
      }
      return "misc";
    },
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    transformation: [
      { width: 1000, height: 1000, crop: "limit" }, // Limit image dimensions
      { quality: "auto" }, // Optimize quality
      { fetch_format: "auto" }, // Optimize format
    ],
  },
});

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Specific upload configurations
const uploadConfigs = {
  // User avatar upload
  avatar: upload.single("avatar"),

  // Agency uploads
  agencyLogo: upload.single("agencyLogo"),
  agencyImages: upload.array("agencyImages", 5), // Max 5 images

  // Station uploads
  stationImages: upload.array("stationImages", 5), // Max 5 images

  // Document upload
  document: upload.single("document"),
};

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({
      error: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      error: err.message,
    });
  }

  next();
};

module.exports = {
  cloudinary,
  uploadConfigs,
  handleUploadError,
};
