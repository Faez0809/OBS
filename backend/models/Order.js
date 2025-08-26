const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  stripeSessionId: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
