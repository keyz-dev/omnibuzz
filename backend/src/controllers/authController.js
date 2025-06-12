require("dotenv").config();
const { User, Station, StationWorker } = require("../db/models");
const { createUserSchema } = require("../schemas/userSchema");
const { validateRequest } = require("../utils/validation");
const emailService = require("../services/emailService");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { OAuth2Client } = require("google-auth-library");
const { generateToken } = require("../utils/jwt");
const { isLocalImageUrl } = require("../utils/imageUtils");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to format avatar URL
const formatAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (isLocalImageUrl(avatar)) {
    return `${process.env.SERVER_URL}${avatar}`;
  }
  return avatar;
};

// Register a new user
const register = async (req, res) => {
  const { error, value } = validateRequest(req.body, createUserSchema);
  if (error) throw new BadRequestError(error.message);

  const { email, password, ...userData } = value;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new BadRequestError("Email already registered");
  }

  // Handle avatar upload if present
  let avatarUrl = null;
  if (req.file) {
    avatarUrl = req.file.path;
  }

  // Create user
  const user = await User.create({
    ...userData,
    email,
    password,
    avatar: avatarUrl,
    emailVerified: false,
  });

  // Generate verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  await user.update({
    emailVerificationCode: verificationCode,
    emailVerificationExpires: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
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

  // Generate temporary token (expires in 1 hour)
  const token = generateToken({ userId: user.id, isTemporary: true }, "1h");

  res.status(201).json({
    status: "success",
    message: "Registration successful. Please verify your email.",
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: formatAvatarUrl(user.avatar),
        emailVerified: false,
      },
      token,
      requiresVerification: true,
    },
  });
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // Find user with their stations
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: StationWorker,
        as: "workingStations",
        include: [{ model: Station, as: "station" }],
      },
    ],
  });

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
  const token = generateToken({ userId: user.id }, "7d");

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
      token,
    },
  });
};

// Google OAuth login
const googleLogin = async (req, res) => {
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
      },
      token: authToken,
    },
  });
};

module.exports = {
  register,
  login,
  googleLogin,
};
