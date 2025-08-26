import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const { cart, clearCart } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const navigate = useNavigate();
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

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart }),
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
        console.log("Payment intent created:", data);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError("Failed to initialize payment. Please try again.");
      }
    };

    createPaymentIntent();
  }, [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    console.log("Submitting payment...");

    if (!stripe || !elements) {
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      console.error("Payment failed:", payload.error);
    } else {
      setError(null);
      setSucceeded(true);
      clearCart(); // Clear the cart after successful payment
      console.log("Payment succeeded!", payload);

      // Send the order to the backend to be added to the database
      const orderData = {
        address,
        products: cart.map(item => ({
          productId: item.book._id,
          quantity: item.quantity
        }))
      };
      console.log("Sending order to backend:", orderData);
      try {
        await fetch("/save-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        console.log("Order sent to backend successfully");
      } catch (err) {
        console.error("Error saving order:", err);
      }

      setProcessing(false);
      console.log("Navigating to /success");
      navigate("/success");
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <CardElement className="card-element" />
      {error && <div className="error">{error}</div>}
      <button
        type="submit"
        disabled={processing || !stripe || !elements || succeeded}
      >
        {processing ? "Processing…" : "Pay Now"}
      </button>
      {succeeded && (
        <p className="success-message">
          Payment succeeded! Thank you for your order.
        </p>
      )}
    </form>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
