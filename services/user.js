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
const findUserByProperty = (key, value) => {
  if (key === "_id") {
    return User.findById(value);
  }
  return User.findOne({ [key]: value }); //it means that the key of the object is dynamic and determined by the value of the key variable.
};

function getUsers() {
  return User.find();
}

function deleteUser(key, value) {
  return User.findOneAndRemove({ [key]: value });
}

module.exports = {
  registerNewUser,
  putUserById,
  findUserByProperty,
  getUsers,
  deleteUser,
};
