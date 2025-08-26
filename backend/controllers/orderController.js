const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

// Create Stripe Checkout Session
const createCheckoutSession = async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => {
    let image = product.book.coverImage;
    if (!image || typeof image !== "string" || image.length > 2048) {
      image = "";
    }
    return {
      price_data: {
        currency: "bdt",
        product_data: {
          name: product.book.title,
          images: image ? [image] : [],
        },
        unit_amount: Math.round(product.book.price * 100),
      },
      quantity: product.quantity,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failed",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation failed:", error);
    res.status(500).json({ error: "Checkout session creation failed" });
  }
};

module.exports = {
  createCheckoutSession,
};
