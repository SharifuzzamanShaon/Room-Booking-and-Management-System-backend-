const User = require("../models/user.model");
const error = require("../utils/error");

function registerNewUser({ name, email, password }) {
  const newUser = new User({
    name,
    email,
    password,
  });

  return newUser.save();
}

const putUserById = async (id, data) => {
  const emailExists = await findUserByProperty("email", data.email);
  if (emailExists) throw error("Email alreadt in use", 404);
  return User.findByIdAndUpdate(id, { ...data }, { new: true });
};
const findUserByProperty = async (key, value) => {
  if (key === "_id") {
    return await User.findById(value);
  }
  return await User.findOne({ [key]: value });
};

async function getUsers() {
  return await User.find();
}

async function deleteUser(key, value) {
  return await User.findOneAndRemove({ [key]: value });
}

module.exports = {
  registerNewUser,
  putUserById,
  findUserByProperty,
  getUsers,
  deleteUser,
};
