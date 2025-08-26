// Import mongoose (a library for interacting with MongoDB)
const mongoose = require("mongoose");

// Define an asynchronous function to connect to the database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI stored in environment variables (.env)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,  // Uses the new URL string parser to avoid warnings
      useUnifiedTopology: true,  // Enables the new server discovery and monitoring engine
    });

    console.log("Connected to MongoDB");  // Logs success message if connection is established
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);  // Logs error message if connection fails
    process.exit(1);  // Exits the process with failure (useful for preventing the server from running if the database is unreachable)
  }
};

// Export the function so it can be used in other parts of the project
module.exports = connectDB;
