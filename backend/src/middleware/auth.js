require("dotenv").config();
const { User } = require("../db/models");
const { UnauthorizedError, ForbiddenError } = require("../utils/errors");
const { verifyToken } = require("../utils/jwt");

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    // Get user from database
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    // Check email verification
    if (!user.emailVerified) {
      throw new ForbiddenError(
        "Please verify your email to access this resource"
      );
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Token expired"));
    } else {
      next(error);
    }
  }
};

// Role-based authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError("You don't have permission to perform this action")
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
