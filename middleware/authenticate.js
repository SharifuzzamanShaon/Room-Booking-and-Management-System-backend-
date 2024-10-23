const jwt = require("jsonwebtoken");
const { error } = require("../utils/error");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token ;
    const tokenString = token ? String(token) : '';
    const validToken = jwt.verify(tokenString, process.env.ACCESS_TOKEN_KEY); //verify the token

    const userId = validToken?._id;
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
