require("dotenv").config();
const { User, Station, StationWorker } = require("../db/models");
const {
  createUserSchema,
  googleLoginSchema,
} = require("../schemas/userSchema");
const { validateRequest } = require("../utils/validation");
const emailService = require("../services/emailService");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");
const { generateToken } = require("../utils/jwt");
const { isLocalImageUrl } = require("../utils/imageUtils");
const axios = require("axios");

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
    isActive: false,
  });

  // Generate verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await user.update({
    emailVerificationCode: verificationCode,
    emailVerificationExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
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

  res.status(201).json({
    status: "success",
    message: "Registration successful. Please verify your email.",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
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
  });
  if (!user) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  console.log("\n\nuser: ", user)

  if (user.role === "station_manager" || user.role === "ticket_agent") {
    await user.reload({
      include: [
        {
          model: StationWorker,
          as: "worker",
          include: [{ model: Station, as: "station" }],
        },
      ],
    });
  }

  console.log("\n\nuser after reload: ", user)
  if (user.authProvider === "google" && !user.password) {
    throw new UnauthorizedError("Please Continue with Google Sign In");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new UnauthorizedError("Account is deactivated");
  }

  // Generate verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  await user.update({
    emailVerificationCode: verificationCode,
    emailVerificationExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
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

  res.status(209).json({
    status: "success",
    message: "Login successful. Please verify your email.",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
    },
  });
};

// Google OAuth login
const googleLogin = async (req, res) => {
  const { error, value } = validateRequest(req.body, googleLoginSchema);
  if (error) throw new BadRequestError(error.message);

  const { access_token, role } = value;

  if (!access_token) {
    throw new NotFoundError("Access token not found");
  }

  // 1. Validate token & get user profile from Google
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );
  const { email, name, picture } = response.data;
  if (!email) {
    throw new NotFoundError("Email not available from Google");
  }

  let user = await User.findOne({ where: { email } });

  if (!user) {
    // Create new user
    user = await User.create({
      email,
      fullName: name,
      avatar: picture,
      authProvider: "google",
      emailVerified: true,
      isActive: true,
      role,
    });
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

// Verify token and get user data
const verifyToken = async (req, res) => {
  // User data is already attached to req.user by the authenticate middleware
  const user = req.user;

  res.json({
    status: "success",
    valid: true,
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: formatAvatarUrl(user.avatar),
        emailVerified: user.emailVerified,
      },
    },
  });
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  // Find user
  const user = await User.findOne({
    where: {
      email,
      emailVerified: false,
      isActive: false,
    },
  });

  if (!user) {
    throw new BadRequestError("No unverified account found with this email");
  }

  // Generate new verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  await user.update({
    emailVerificationCode: verificationCode,
    emailVerificationExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
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

  res.json({
    status: "success",
    message: "New verification code sent. Please check your email.",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
    },
  });
};

module.exports = {
  register,
  login,
  googleLogin,
  verifyToken,
  resendVerificationCode,
};
