const jwt = require("jsonwebtoken");
const { error } = require("../utils/error");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    const validToken = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    if (!validToken) throw error("invalid token", 400);
    const userId = validToken._id; // Assuming the token contains the user's ID as 'id'
    // Find the user in the database
    const validUser = await User.findById({ _id: userId });

    if (!validUser) throw error("invalid user", 400);
    if (!validUser)
      return res
        .status(400)
        .send({ success: false, message: "Unauthenticate user" });

    req.user = validUser;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
