const jwt = require("jsonwebtoken");
const { error } = require("../utils/error");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      throw error("No token provided", 401);
    }

    let validToken;
    try {
      validToken =jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    } catch (jwtError) {
      throw error("Invalid or expired token", 401);
    }

    const userId = validToken._id;
    const validUser = await User.findById(userId);

    if (!validUser) {
      throw error("User not found", 401);
    }

    req.user = validUser;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
