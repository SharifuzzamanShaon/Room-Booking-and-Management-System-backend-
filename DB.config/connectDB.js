const { default: mongoose } = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.mongoDB_connection_str}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, // Increase to 60 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 60000, // Increase to 60 seconds
      // bufferCommands: false, // Disable buffering (commented out)
      maxPoolSize: 10,
      // Add these options:
      keepAlive: true,
      keepAliveInitialDelay: 300000, // 5 minutes
      retryWrites: true,
      w: "majority",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
