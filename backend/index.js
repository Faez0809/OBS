// Import necessary modules
const express = require("express");  // Express framework for handling server requests
const cors = require("cors");  // Enables cross-origin requests for frontend/backend communication
require("dotenv").config();  // Loads environment variables from .env file
const mongoose = require("mongoose");  // Handles database operations
const app = require("./app");  // Imports the main app configuration from app.js

// Retrieve MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // if you use cookies or auth headers
  })
);
// Attempt to connect to MongoDB database
mongoose
  .connect(MONGO_URI, {  // Connect using the URI with options
	useNewUrlParser: true,  // Ensures compatibility with MongoDB's latest updates
	useUnifiedTopology: true,  // Optimizes connections
  })
  .then(() => {  
	console.log("Connected to MongoDB");  // Success message when connection is established
  })
  .catch((err) => {  
	console.error("Error connecting to MongoDB:", err);  // Displays error if connection fails
  });

// Define the port for the server (default: 3001 if no value is set in .env)
const PORT = process.env.PORT || 3001;

// Start the server and listen for incoming requests
app.listen(PORT, () => {  
  console.log(`Server listening on http://127.0.0.1:${PORT}`);  // Logs the server URL
});
