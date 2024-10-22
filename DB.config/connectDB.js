const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    let connectionString = process.env.mongoDB_connection_str;
    
    if (!connectionString) {
      throw new Error("MongoDB connection string is not defined in environment variables");
    }

    // Remove surrounding quotes if present (helpful for development environments)
    connectionString = connectionString.replace(/^['"](.*)['"]$/, '$1');

    await mongoose.connect(connectionString);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};