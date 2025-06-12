const express = require("express");
const router = express.Router();
const { authenticate, authorize, optionalAuth } = require("../middleware/auth");
const {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
} = require("../middleware/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  deleteAccount,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  inviteStaff,
  acceptInvitation,
} = require("../controllers/userController");
const {
  register,
  login,
  googleLogin,
} = require("../controllers/authController");

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
router.post("/verify-email", optionalAuth, verifyEmail);
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

// Delete account route
router.delete("/account", deleteAccount);

// Admin only routes
router.post(
  "/invite-staff",
  authorize(["system_admin", "agency_admin"]),
  inviteStaff
);

module.exports = router;
