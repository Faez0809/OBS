// controllers/authController.js
const jwt = require("jsonwebtoken");
const FormDataModel = require("../models/FormData");

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

    // NOTE: plaintext password (matches your current DB)
    // Later: switch to bcrypt.hash() and compare on login.
    const newUser = await FormDataModel.create({ name, email, password });
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

    const token = signToken(user);

    // Keep your frontend logic happy:
    // It checks for result.data === "Success" in older version,
    // BUT we'll also return token for new flows.
    return res.json({ message: "Success", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { register, login };
