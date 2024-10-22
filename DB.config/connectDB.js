const { default: mongoose } = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.mongoDB_connection_str}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
  } catch (error) {
    console.log(error);
  }
};
