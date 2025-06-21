const express = require("express");
const router = express.Router();
const verificationDocumentController = require("../controllers/verificationDocumentController");
const { protect, admin } = require("../middleware/auth");

const { authenticate, authorize } = require("../middleware/auth");
const documentController = require("../controllers/verificationDocumentController");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
} = require("../middleware/uploadMiddleware");

router.use(authenticate);
router.post(
  "/",
  authorize(["agency_admin", "system_admin"]),
  upload.array("documents", 10),
  handleCloudinaryUpload,
  formatFilePaths,
  documentController.uploadDocument
);

router.patch(
  "/:id/approve",
  authorize(["system_admin"]),
  documentController.approveDocument
);

router.patch(
  "/:id/reject",
  authorize(["system_admin"]),
  documentController.rejectDocument
);

router.patch(
  "/:id/remark",
  authorize(["system_admin"]),
  documentController.addRemark
);

router.get("/", authorize(["system_admin"]), verificationDocumentController.getDocuments);

router.get("/stats", authorize(["system_admin"]), verificationDocumentController.getDocumentStats);

router.patch("/:id/status", authorize(["system_admin"]), verificationDocumentController.updateDocumentStatus);

module.exports = router;
