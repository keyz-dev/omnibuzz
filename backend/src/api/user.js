const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
} = require("../middleware/uploadMiddleware");
const {
  register,
  login,
  googleLogin,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
  inviteStaff,
  acceptInvitation,
} = require("../controllers/userController");

// Public routes
router.post(
  "/register",
  upload.single("avatar"),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  register
);

router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/verify-email", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/accept-invitation", acceptInvitation);

// Protected routes
router.use(authenticate);
router.get("/profile", getProfile);

router.patch(
  "/profile",
  upload.single("avatar"),
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
  updateProfile
);

// Admin only routes
router.post(
  "/invite-staff",
  authorize(["system_admin", "agency_admin"]),
  inviteStaff
);

module.exports = router;
