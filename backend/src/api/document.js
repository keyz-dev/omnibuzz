const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const { isAgencyAdmin } = require("../middleware/agencyAuth");
const documentController = require("../controllers/verificationDocumentController");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
} = require("../middleware/uploadMiddleware");

router.post(
  "/",
  authenticate,
  isAgencyAdmin,
  upload.array("documents", 10),
  handleCloudinaryUpload,
  formatFilePaths,
  documentController.uploadDocument
);

router.patch(
  "/:id/approve",
  authenticate,
  authorize(["system_admin"]),
  documentController.approveDocument
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize(["system_admin"]),
  documentController.rejectDocument
);

router.get(
  "/status/:agencyId",
  authenticate,
  isAgencyAdmin,
  documentController.getVerificationStatus
);

router.patch(
  "/:id/remark",
  authenticate,
  authorize(["system_admin"]),
  documentController.updateRemark
);

module.exports = router;
