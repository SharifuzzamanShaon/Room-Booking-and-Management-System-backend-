const User = require("../models/user.model");
const error = require("../utils/error");

function registerNewUser({ name, email, password }) {
  try {
    const newUser = new User({
      name,
      email,
      password,
    });

    return newUser.save();
  } catch (error) {
    console.log(error);
  }
}

const putUserById = async (id, data) => {
  const emailExists = await findUserByProperty("email", data.email);
  if (emailExists) throw error("Email alreadt in use", 404);
  return User.findByIdAndUpdate(id, { ...data }, { new: true });
};
const findUserByProperty = (key, value) => {
  try {
    if (key === "_id") {
      return User.findById(value);
    }
    return User.findOne({ [key]: value });
  } catch (error) {
    console.log(error);
  } //it means that the key of the object is dynamic and determined by the value of the key variable.
};

function getUsers() {
  try {
    return User.find();
  } catch (error) {
    console.log(error);
  }
}

function deleteUser(key, value) {
  try {
    return User.findOneAndRemove({ [key]: value });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  registerNewUser,
  putUserById,
  findUserByProperty,
  getUsers,
  deleteUser,
};
