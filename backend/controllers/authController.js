// controllers/authController.js
const jwt = require("jsonwebtoken");
const FormDataModel = require("../models/FormData");

// Admin email configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bookcafe.com";

// Sign a JWT for the user
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await FormDataModel.findOne({ email });
    if (existing) return res.json("Already registered");

    // Determine role based on email
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';

    // NOTE: plaintext password (matches your current DB)
    // Later: switch to bcrypt.hash() and compare on login.
    const newUser = await FormDataModel.create({ name, email, password, role });
    return res.json(newUser);
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await FormDataModel.findOne({ email });
    if (!user) return res.json("No records found!");

    // plaintext compare (as your DB currently stores)
    if (user.password !== password) return res.json("Wrong password");

    // Update user role if they match admin email (for existing users)
    if (email === ADMIN_EMAIL && user.role !== 'admin') {
      await FormDataModel.findByIdAndUpdate(user._id, { role: 'admin' });
      user.role = 'admin';
    }

    const token = signToken(user);

    // Keep your frontend logic happy:
    // It checks for result.data === "Success" in older version,
    // BUT we'll also return token for new flows.
    return res.json({ message: "Success", token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
};

// Create admin user function
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Only allow admin creation if the email matches admin email
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "Only admin email can be used for admin creation" });
    }

    const existing = await FormDataModel.findOne({ email });
    if (existing) {
      // Update existing user to admin
      await FormDataModel.findByIdAndUpdate(existing._id, { role: 'admin' });
      return res.json({ message: "Existing user updated to admin", user: existing });
    }

    const newAdmin = await FormDataModel.create({ 
      name, 
      email, 
      password, 
      role: 'admin' 
    });
    return res.json({ message: "Admin created successfully", user: newAdmin });
  } catch (err) {
    console.error("Create admin error:", err);
    return res.status(500).json({ error: "Admin creation failed" });
  }
};

module.exports = { register, login, createAdmin };
