require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { BadRequestError } = require("../utils/errors");

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
    const dirPath = path.join(process.cwd(), "src", dir);
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
      // Determine subdirectory based on file fieldname
      const subDir =
        file.fieldname === "avatar"
          ? "avatars"
          : file.fieldname === "logo" || file.fieldname === "agencyImages"
            ? "agencies"
            : file.fieldname === "images"
              ? "stations"
              : file.fieldname === "documents"
                ? "documents"
                : "others";

      // Set the folderName on the file object
      file.folderName = subDir;

      const uploadDir = path.join(__dirname, "../uploads", subDir);

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with UUID for better uniqueness
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueId}${ext}`);
    },
  });

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname == "documents") {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|avif|pdf)$/)) {
      return cb(new BadRequestError("Only valid documents are allowed!"), false);
    }
  }
  else if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$/)) {
    return cb(new BadRequestError("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// File filter to accept only excel and csv files
const bulkUploadFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'), false);
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


// Configure multer
const bulkUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: bulkUploadFileFilter,
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
      // Set folderName for Cloudinary uploads
      const folderName = getCloudinaryFolder(req.file.fieldname);
      req.file.folderName = folderName;

      // Handle single file upload
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: folderName,
        resource_type: "auto",
      });
      req.file.path = result.secure_url;
    } else if (req.files && req.files.length > 0) {
      // Handle multiple file uploads
      const uploadPromises = req.files.map((file) => {
        const folderName = getCloudinaryFolder(file.fieldname);
        file.folderName = folderName;

        return uploadToCloudinary(file.buffer, {
          folder: folderName,
          resource_type: "auto",
        });
      });
      const results = await Promise.all(uploadPromises);
      req.files = results.map((result, index) => ({
        ...result,
        path: result.secure_url,
        folderName: req.files[index].folderName,
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
    case "images":
      return "stations";
    case "documents":
      return "documents";
    default:
      return "misc";
  }
};

// Format file paths for response
const formatFilePaths = (req, res, next) => {
  if (req.file) {
    // In development, return the local URL
    if (process.env.NODE_ENV !== "production") {
      req.file.path = `/uploads/${req.file.folderName}/${path.basename(req.file.path)}`;
    }
  }
  if (req.files && Object.keys(req.files).length > 0) {
    Object.keys(req.files).forEach((key) => {
      if (Array.isArray(req.files[key])) {
        req.files[key] = req.files[key].map((file) => {
          if (process.env.NODE_ENV !== "production") {
            file.path = `/uploads/${file.folderName}/${path.basename(file.path)}`;
          }
          file.path = file.path.replace(/\\/g, "/");
          return file;
        });
      } else {
        req.files[key].path = `/uploads/${req.files[key].folderName}/${path.basename(req.files[key].path)}`
      }
    });
  }
  next();
};

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new BadRequestError("File size too large. Maximum size is 5MB.")
      );
    }
    return next(new BadRequestError(err.message));
  }
  next(err);
};

// Export middleware chain
module.exports = {
  upload,
  bulkUpload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
};
