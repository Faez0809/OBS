// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    const lineItems = products.map((product) => {
      let image = product?.book?.coverImage;
      if (!image || typeof image !== "string" || image.length > 2048) {
        image = "";
      }
      return {
        price_data: {
          currency: "bdt",
          product_data: {
            name: product?.book?.title ?? "Book",
            images: image ? [image] : [],
          },
          unit_amount: Math.round((product?.book?.price ?? 0) * 100),
        },
        quantity: Number(product?.quantity ?? 1),
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/failed",
      // Optionally attach user id from JWT (set by authMiddleware)
      metadata: { userId: req.user?.id || "" },
    });

    return res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;
