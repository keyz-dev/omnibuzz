require("dotenv").config();
const { User, Station, StationWorker } = require("../db/models");
const {
  updateUserSchema,
  staffInvitationSchema,
  acceptInvitationSchema,
} = require("../schemas/userSchema");
const { validateRequest } = require("../utils/validation");
const emailService = require("../services/emailService");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { Op } = require("sequelize");
const { generateToken } = require("../utils/jwt");
const { isLocalImageUrl } = require("../utils/imageUtils");

// Helper function to format avatar URL
const formatAvatarUrl = (avatar) => {
  if (!avatar) return null;

  if (isLocalImageUrl(avatar)) {
    return `${process.env.SERVER_URL}${avatar}`;
  }
  return avatar;
};

// Verify email
const verifyEmail = async (req, res) => {
  const { code } = req.body;

  // Find user by verification code
  const user = await User.findOne({
    where: {
      emailVerificationCode: code,
      emailVerificationExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new BadRequestError("Invalid or expired verification code");
  }

  // Update user verification status
  await user.update({
    emailVerified: true,
    emailVerificationCode: null,
    emailVerificationExpires: null,
  });

  // Generate new token if user was authenticated
  let token = null;
  if (req.user && req.user.id === user.id) {
    token = generateToken({ userId: user.id, isTemporary: false }, "7d");
  }

  res.json({
    status: "success",
    message: "Email verified successfully",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: formatAvatarUrl(user.avatar),
        emailVerified: true,
      },
      ...(token && { token }), // Only include token if it was generated
    },
  });
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Generate reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  await user.update({
    emailVerificationCode: resetCode,
    emailVerificationExpires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
  });

  // Send reset email
  await emailService.sendEmail({
    to: email,
    subject: "Reset your password",
    template: "passwordReset",
    data: {
      name: user.fullName,
      resetCode,
    },
  });

  res.json({
    status: "success",
    message: "Password reset instructions sent to your email",
  });
};

// Reset password
const resetPassword = async (req, res) => {
  const { code, password } = req.body;

  const user = await User.findOne({
    where: {
      emailVerificationCode: code,
      emailVerificationExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new BadRequestError("Invalid or expired reset code");
  }

  await user.update({
    password,
    emailVerificationCode: null,
    emailVerificationExpires: null,
  });

  res.json({
    status: "success",
    message: "Password reset successful",
  });
};

// Get current user profile
const getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });

  const userData = user.toJSON();
  if (userData.avatar && !userData.avatar.startsWith("http")) {
    userData.avatar = `${process.env.SERVER_URL}${userData.avatar}`;
  }

  res.json({
    status: "success",
    data: { user: userData },
  });
};

// Update user profile
const updateProfile = async (req, res) => {
  const { error, value } = validateRequest(req.body, updateUserSchema);
  if (error) throw new BadRequestError(error.message);

  const user = await User.findByPk(req.user.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Handle avatar upload
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.path);
    value.avatar = uploadResult.secure_url;
  }

  // Update user
  await user.update(value);

  res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: formatAvatarUrl(user.avatar),
      },
    },
  });
};

// Invite staff member
const inviteStaff = async (req, res) => {
  const { error, value } = validateRequest(req.body, staffInvitationSchema);
  if (error) throw new BadRequestError(error.message);

  const { email, fullName, role, stationId, agencyId } = value;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new BadRequestError("Email already registered");
  }

  // Verify station belongs to agency
  const station = await Station.findOne({
    where: { id: stationId, agencyId },
  });
  if (!station) {
    throw new BadRequestError("Invalid station for this agency");
  }

  // Create user with invitation
  const user = await User.create({
    email,
    fullName,
    role,
    status: "pending",
    invitedBy: req.user.id,
  });

  // Create station worker record
  await StationWorker.create({
    userId: user.id,
    stationId,
    role,
    isActive: true,
  });

  // Send invitation email
  await emailService.sendEmail({
    to: email,
    subject: "You've been invited to join OmniBuzz",
    template: "staffInvitation",
    data: {
      name: fullName,
      role,
      stationName: station.name,
      invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?token=${user.invitationToken}`,
    },
  });

  res.json({
    status: "success",
    message: "Staff invitation sent successfully",
  });
};

// Accept staff invitation
const acceptInvitation = async (req, res) => {
  const { error, value } = validateRequest(req.body, acceptInvitationSchema);
  if (error) throw new BadRequestError(error.message);

  const { token, password } = value;

  const user = await User.findOne({
    where: {
      invitationToken: token,
      invitationExpires: { [Op.gt]: new Date() },
      status: "pending",
    },
    include: [
      {
        model: StationWorker,
        as: "workingStations",
        include: [{ model: Station, as: "station" }],
      },
    ],
  });

  if (!user) {
    throw new BadRequestError("Invalid or expired invitation token");
  }

  // Update user
  await user.update({
    password,
    invitationToken: null,
    invitationExpires: null,
    emailVerified: true,
    status: "active",
  });

  // Generate auth token
  const authToken = generateToken({ userId: user.id }, "7d");

  res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: formatAvatarUrl(user.avatar),
        stations: user.workingStations.map((sw) => ({
          id: sw.station.id,
          name: sw.station.name,
          role: sw.role,
        })),
      },
      token: authToken,
    },
  });
};

// Delete user account
const deleteAccount = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Delete user (this will trigger the beforeDestroy hook to clean up files)
  await user.destroy();

  res.json({
    status: "success",
    message: "Account deleted successfully",
  });
};

module.exports = {
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
  inviteStaff,
  acceptInvitation,
  deleteAccount,
};
