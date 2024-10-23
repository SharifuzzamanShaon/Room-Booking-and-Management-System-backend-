const bcrypt = require("bcrypt");
const saltRounds = 10;
const { registerNewUser, findUserByProperty } = require("./user");
const { error } = require("../utils/error");
const sendToken = require("../utils/token.jwt");

// Roles & accountStatus using by admin function
async function registerService({ name, email, password }) {
    const isEmailExists = await findUserByProperty("email", email);
    if (isEmailExists) throw error("User alreay exists", 400);
    const hash = await bcrypt.hash(password, saltRounds);
    return await registerNewUser({
      name,
      email,
      password: hash,
    });
 
}
async function loginService({ email, password, res, next }) {
    const validUser = await findUserByProperty("email", email);
    if (!validUser) throw error("User not registered yet", 400);

    const isValidPassword = await bcrypt.compare(password, validUser.password);
    if (!isValidPassword) throw error("Invaid Password", 401);
    const payload = {
      _id: validUser._id,
      username: validUser.username,
      email: validUser.email,
      role: validUser.role,
    };
    sendToken(payload, 200, res, next);
}
module.exports = { registerService, loginService };
