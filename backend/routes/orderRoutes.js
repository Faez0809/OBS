const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  const { stripeSessionId, email, amount, paymentStatus } = req.body;

  try {
    const newOrder = new Order({
      stripeSessionId,
      email,
      amount,
      paymentStatus,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order saved", order: newOrder });
  } catch (error) {
    console.log("Failed to save : ", error);
    res.status(500).json({ error: "server error. Order not saved." });
  }
});

module.exports = router;
