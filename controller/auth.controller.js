const User = require("../models/user.model");
const { registerService, loginService } = require("../services/authServices");
const validateEmail = require("../utils/emailValidator");
const { error } = require("../utils/error");
const sendToken = require("../utils/token.jwt");
const bcrypt = require("bcrypt");

const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const requiredFields = [
      { value: name, field: "username" },
      { value: email, field: "email" },
      { value: password, field: "password" },
    ];

    for (const { value, field } of requiredFields) {
      if (!value) throw error(`${field} is required`, 400);
    }

    if (!validateEmail(email)) throw error("Invalid email format", 400);
    const newUser = await registerService({ name, email, password }); // register the new user module
    return res
      .status(200)
      .send({ success: true, message: "New user created", newUser });
  } catch (error) {
    next(error);
  }
};
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) throw error("email is required", 400);
    if (!password) throw error("password is required", 400);
    await loginService({ email, password, res, next });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });
    res.status(200).send({ success: true, message: "Logout Success" });
  } catch (error) {
    next(error);
  }
};

const updateToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    const decode = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    if (!decode) throw error("invalid token", 400);
    const validUser = await User.get(`"${decode._id}"`);
    if (!validUser)
      return res
        .status(400)
        .send({ success: false, message: "could not refresh token" });
    const payload = {
      _id: validUser._id,
      username: validUser.username,
      email: validUser.email,
      avatar: validUser.avatar,
      role: validUser.role,
    };
    sendToken(payload, 200, res, next);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerController,
  loginController,
  logout,
  updateToken,
};
