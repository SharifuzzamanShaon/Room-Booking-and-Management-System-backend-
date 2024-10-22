const { default: mongoose } = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.mongoDB_connection_str}`);
  } catch (error) {
    console.log(error);
  }
};
