const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agencyController");
const { authenticate } = require("../middleware/auth");
const { isAgencyAdmin, isAgencyOwner } = require("../middleware/agencyAuth");
const {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
} = require("../middleware/uploadMiddleware");

// Get all agencies (public)
router.get("/", agencyController.getAll);

// Get agency by user ID
router.get("/me", authenticate, isAgencyOwner, agencyController.getByUserId);

// Create agency
router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "agencyImages", maxCount: 10 },
  ]),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  agencyController.create
);

// Get agency by ID
router.get("/:id", authenticate, agencyController.getById);

// Update agency
router.put(
  "/:id",
  authenticate,
  isAgencyOwner,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "agencyImages", maxCount: 10 },
  ]),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  agencyController.update
);

// Remove agency
router.delete("/:id", authenticate, isAgencyAdmin, agencyController.remove);

module.exports = router;
