const mongoose = require("mongoose");

let isConnected = false;

exports.connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(`${process.env.mongoDB_connection_str}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      // Remove bufferCommands: false
      maxPoolSize: 10,
    });
    
    isConnected = true;
    console.log('New database connection established');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Export the mongoose instance
exports.mongoose = mongoose;
