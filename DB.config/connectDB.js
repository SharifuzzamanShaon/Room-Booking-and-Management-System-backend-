const { default: mongoose } = require("mongoose");

exports.connectDB = async () => {
  await mongoose.connect(`${process.env.mongoDB_connection_str}`);
};
