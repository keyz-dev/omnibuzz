const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stationController");
const { authenticate } = require("../middleware/auth");
const { isAgencyAdmin, isAgencyOwner } = require("../middleware/agencyAuth");
const {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
} = require("../middleware/uploadMiddleware");

// Get all stations
router.get("/", stationController.getAll);

// Get station by ID
router.get("/:id", stationController.getById);

// Create new station (requires authentication)
router.post(
  "/",
  authenticate,
  isAgencyOwner,
  upload.fields([{ name: "images", maxCount: 10 }]),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  stationController.create
);

// Update station (requires authentication)
router.put(
  "/:id",
  authenticate,
  upload.fields([{ name: "images", maxCount: 5 }]),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  stationController.update
);

// Delete station (requires authentication)
router.delete("/:id", authenticate, stationController.remove);

// Worker management routes
router.post(
  "/workers/assign",
  authenticate,
  isAgencyOwner,
  stationController.assignWorker
);
router.get("/:id/workers", authenticate, stationController.getWorkers);

// Get station by agency ID
router.get(
  "/by-agency/:agencyId",
  authenticate,
  stationController.getByAgencyId
);

module.exports = router;
