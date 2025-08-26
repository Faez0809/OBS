


// Import Express framework to define routes
const express = require("express");

// Import authentication controller functions (register and login)
const { register, login } = require("../controllers/authController");

// Create a new router instance to handle authentication-related routes
const router = express.Router();

// Define the user registration route
// When a POST request is made to "/register", the `register` function from authController is executed
router.post("/register", register);

// Define the user login route
// When a POST request is made to "/login", the `login` function from authController is executed
router.post("/login", login);

// Export the router so it can be used in app.js
module.exports = router;
