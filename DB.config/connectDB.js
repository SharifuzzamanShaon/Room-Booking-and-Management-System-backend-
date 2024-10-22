const { default: mongoose } = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.mongoDB_connection_str}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
      socketTimeoutMS: 45000,
      // Add these options:
      connectTimeoutMS: 30000,
      bufferCommands: false, // Disable buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });
  } catch (error) {
    console.log(error);
  }
};
