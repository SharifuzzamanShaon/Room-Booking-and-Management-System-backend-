const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    let connectionString = process.env.mongoDB_connection_str;
    
    if (!connectionString) {
      throw new Error("MongoDB connection string is not defined in environment variables");
    }

    // Remove any potential variable assignment syntax
    connectionString = connectionString.replace(/^.*?=\s*/, '');

    // Remove surrounding quotes if present
    connectionString = connectionString.replace(/^['"](.*)['"]$/, '$1');

    // Ensure the connection string starts with mongodb:// or mongodb+srv://
    if (!connectionString.startsWith("mongodb://") && !connectionString.startsWith("mongodb+srv://")) {
      throw new Error("Invalid MongoDB connection string format");
    }

    // Additional connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true, // Only use this in development
      tlsAllowInvalidHostnames: true, // Only use this in development
    };

    await mongoose.connect(connectionString, options);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};