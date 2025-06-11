const { User } = require("../db/models");
const {
  createUserSchema,
  updateUserSchema,
  staffInvitationSchema,
} = require("../schemas/userSchema");
const { validateRequest } = require("../utils/validation");
const { catchAsync } = require("../utils/errorHandling");
const emailService = require("../services/emailService");
const { uploadToCloudinary } = require("../utils/cloudinary");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register a new user
const register = catchAsync(async (req, res) => {
  const { error, value } = validateRequest(req.body, createUserSchema);
  if (error) throw new BadRequestError(error.message);

  console.log(value);

  const { email, password, ...userData } = value;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new BadRequestError("Email already registered");
  }

  // Handle avatar upload if present
  let avatarUrl = null;
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.path);
    avatarUrl = uploadResult.secure_url;
  }

  // Create user
  const user = await User.create({
    ...userData,
    email,
    password,
    avatar: avatarUrl,
  });

  // Generate verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  await user.update({
    emailVerificationCode: verificationCode,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Send verification email
  await emailService.sendEmail({
    to: email,
    subject: "Verify your email",
    template: "emailVerification",
    data: {
      name: user.fullName,
      verificationCode,
    },
  });

  // Generate auth token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
});

// Login user
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new UnauthorizedError("Account is deactivated");
  }

  // Generate token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
});

// Google OAuth login
const googleLogin = catchAsync(async (req, res) => {
  const { token } = req.body;

  // Verify Google token
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  // Find or create user
  let user = await User.findOne({ where: { email } });

  if (!user) {
    // Create new user
    user = await User.create({
      email,
      fullName: name,
      avatar: picture,
      authProvider: "google",
      emailVerified: true,
    });
  } else if (user.authProvider !== "google") {
    throw new BadRequestError(
      "Email already registered with different provider"
    );
  }

  // Generate token
  const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token: authToken,
    },
  });
});

// Verify email
const verifyEmail = catchAsync(async (req, res) => {
  const { code } = req.body;

  const user = await User.findOne({
    where: {
      emailVerificationCode: code,
      emailVerificationExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new BadRequestError("Invalid or expired verification code");
  }

  await user.update({
    emailVerified: true,
    emailVerificationCode: null,
    emailVerificationExpires: null,
  });

  res.json({
    status: "success",
    message: "Email verified successfully",
  });
});

// Request password reset
const requestPasswordReset = catchAsync(async (req, res) => {
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
});

// Reset password
const resetPassword = catchAsync(async (req, res) => {
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
});

// Get current user profile
const getProfile = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });

  res.json({
    status: "success",
    data: { user },
  });
});

// Update user profile
const updateProfile = catchAsync(async (req, res) => {
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
        avatar: user.avatar,
      },
    },
  });
});

// Invite staff member
const inviteStaff = catchAsync(async (req, res) => {
  const { error, value } = validateRequest(req.body, staffInvitationSchema);
  if (error) throw new BadRequestError(error.message);

  const { email, fullName, role } = value;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new BadRequestError("Email already registered");
  }

  // Create invitation
  const invitationToken = Math.random().toString(36).substring(2, 15);
  const user = await User.create({
    email,
    fullName,
    role,
    invitationToken,
    invitationExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    invitedBy: req.user.id,
  });

  // Send invitation email
  await emailService.sendEmail({
    to: email,
    subject: "You've been invited to join OmniBuzz",
    template: "staffInvitation",
    data: {
      name: fullName,
      role,
      invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?token=${invitationToken}`,
    },
  });

  res.json({
    status: "success",
    message: "Staff invitation sent successfully",
  });
});

// Accept staff invitation
const acceptInvitation = catchAsync(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    where: {
      invitationToken: token,
      invitationExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new BadRequestError("Invalid or expired invitation token");
  }

  await user.update({
    password,
    invitationToken: null,
    invitationExpires: null,
    emailVerified: true,
  });

  // Generate auth token
  const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token: authToken,
    },
  });
});

module.exports = {
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
};
