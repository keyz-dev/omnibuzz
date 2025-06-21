const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agencyController");
const { authenticate, authorize } = require("../middleware/auth");
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
  authorize(["agency_owner"]),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "agencyImages", maxCount: 10 },
  ]),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  agencyController.update
);

// Publish and agency
router.patch(
  "/:id/publish",
  authenticate,
  authorize(["agency_admin"]),
  agencyController.publish
);

// Remove agency
router.delete("/:id", authenticate, authorize(["agency_admin", "system_admin"]), agencyController.remove);

module.exports = router;
