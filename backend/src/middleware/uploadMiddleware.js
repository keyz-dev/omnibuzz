require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { uploadToCloudinary } = require("../utils/cloudinary");

const inProduction = process.env.NODE_ENV === "production";

// Ensure upload directories exist (only for development)
const createUploadDirs = () => {
  if (inProduction) return;

  const dirs = [
    "uploads",
    "uploads/avatars",
    "uploads/agencies",
    "uploads/stations",
    "uploads/documents",
  ];

  dirs.forEach((dir) => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// Create directories on startup (only in development)
createUploadDirs();

// Configure storage based on environment
const storage = inProduction
  ? multer.memoryStorage() // Use memory storage for production (Cloudinary)
  : multer.diskStorage({
      // Use disk storage for development
      destination: (req, file, cb) => {
        let uploadPath = "uploads/";

        // Determine upload directory based on file type
        if (file.fieldname === "avatar") {
          uploadPath += "avatars/";
        } else if (
          file.fieldname === "agencyLogo" ||
          file.fieldname === "agencyImages"
        ) {
          uploadPath += "agencies/";
        } else if (file.fieldname === "stationImages") {
          uploadPath += "stations/";
        } else if (file.fieldname === "document") {
          uploadPath += "documents/";
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    "image/jpeg": true,
    "image/png": true,
    "image/jpg": true,
    "application/pdf": true,
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, and PDF files are allowed."
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware to handle file upload to Cloudinary in production
const handleCloudinaryUpload = async (req, res, next) => {
  if (!inProduction) {
    return next();
  }

  try {
    if (!req.file && !req.files) {
      return next();
    }

    if (req.file) {
      // Handle single file upload
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: getCloudinaryFolder(req.file.fieldname),
        resource_type: "auto",
      });
      req.file.path = result.secure_url;
    } else if (req.files) {
      // Handle multiple file uploads
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: getCloudinaryFolder(file.fieldname),
          resource_type: "auto",
        })
      );
      const results = await Promise.all(uploadPromises);
      req.files = results.map((result) => ({
        ...result,
        path: result.secure_url,
      }));
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Helper function to determine Cloudinary folder
const getCloudinaryFolder = (fieldname) => {
  switch (fieldname) {
    case "avatar":
      return "avatars";
    case "agencyLogo":
    case "agencyImages":
      return "agencies";
    case "stationImages":
      return "stations";
    case "document":
      return "documents";
    default:
      return "misc";
  }
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

// Middleware to format file paths for response
const formatFilePaths = (req, res, next) => {
  if (req.file) {
    req.file.path = req.file.path.replace(/\\/g, "/");
  }
  if (req.files) {
    req.files = req.files.map((file) => {
      file.path = file.path.replace(/\\/g, "/");
      return file;
    });
  }
  next();
};

// Export middleware chain
module.exports = {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
};
