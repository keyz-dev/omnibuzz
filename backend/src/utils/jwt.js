const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("./errors");

const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
