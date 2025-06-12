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

// Get station destinations
router.get("/:id/destinations", stationController.getDestinations);

// Create new station (requires authentication)
router.post(
  "/",
  authenticate,
  isAgencyAdmin,
  upload.fields([{ name: "stationImages", maxCount: 5 }]),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  stationController.create
);

// Update station (requires authentication)
router.put(
  "/:id",
  authenticate,
  upload.fields([{ name: "stationImages", maxCount: 5 }]),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  stationController.update
);

// Delete station (requires authentication)
router.delete("/:id", authenticate, stationController.remove);

// Add destination to station (requires authentication)
router.post(
  "/:id/destinations",
  authenticate,
  stationController.addDestination
);

// Remove destination from station (requires authentication)
router.delete(
  "/:id/destinations",
  authenticate,
  stationController.removeDestination
);

// Worker management routes
router.post(
  "/workers/assign",
  authenticate,
  isAgencyOwner,
  stationController.assignWorker
);
router.get("/:id/workers", authenticate, stationController.getWorkers);

module.exports = router;
