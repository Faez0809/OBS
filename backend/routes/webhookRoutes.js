const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("✅ Stripe event received:", event.type);
    } catch (err) {
      console.error("❌ Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(session);

      try {
        const response = await axios.post("http://localhost:3001/api/orders", {
          stripeSessionId: session.id,
          email: session.customer_details.email,
          amount: session.amount_total/100,
          paymentStatus: session.payment_status,
        });

        console.log("📦 Order saved via internal POST:", response.data);
      } catch (err) {
        console.error(
          "❌ Failed to call /api/orders:",
          err.response?.data || err.message
        );
        return res.status(500).send("Failed to post order");
      }
    }

    res.status(200).json({ received: true });
  }
);

module.exports = router;
