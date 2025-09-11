//src/components/order/order.jsx


import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import "./Order.css";

// Load Stripe with the environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Order = () => {
  const { cart } = useContext(CartContext);
  const [address, setAddress] = useState({
    name: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    e.target.setCustomValidity(""); // Clear custom validity message on change
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!e.target.checkValidity()) {
      return;
    }

    try {
      // Send cart and customer info to the backend to create a checkout session
      const stripe = await stripePromise;
      const response = await axios.post(
        "http://127.0.0.1:3001/api/payment/create-checkout-session",
        {
          items: cart.map((item) => ({
            productId: item.book._id,
            title: item.book.title,
            price: item.book.price,
            quantity: item.quantity,
          })),
          customerEmail: address.email,
        }
      );

      const { url } = response.data;

      // Redirect to the Stripe Checkout page
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to initiate checkout process. Please try again.");
    }
  };

  return (
    <div className="order">
      <h2>Checkout</h2>
      <form className="order-form" onSubmit={handleOrderSubmit}>
        {/* Form fields for address */}
        <div
          className={`form-group ${submitted && !address.name ? "error" : ""}`}
        >
          <label htmlFor="name">
            Name
            {submitted && !address.name && <span className="required">*</span>}
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={address.name}
            onChange={handleChange}
            required
          />
        </div>
        <div
          className={`form-group ${submitted && !address.email ? "error" : ""}`}
        >
          <label htmlFor="email">
            Email
            {submitted && !address.email && <span className="required">*</span>}
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={address.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* Other address fields... */}


        <button className="order-btn" type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Order;
