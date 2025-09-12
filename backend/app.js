// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const webhookRoutes = require("./routes/webhookRoutes");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const writerRoutes = require("./routes/writerRoutes");
const authMiddleware = require("./middleware/authMiddleware");

// CORS (Bearer token flow doesn't require credentials:true)
app.use(cors());

// ✅ Webhook must be raw BEFORE json()
app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// ✅ Common middlewares (after webhook)
app.use(cookieParser());
app.use(express.json());

// ✅ Public APIs
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/writers", writerRoutes);

// 🔒 Protected: ALL /api/payment/* requires Authorization: Bearer <token>
app.use("/api/payment", authMiddleware, paymentRoutes);

module.exports = app;
