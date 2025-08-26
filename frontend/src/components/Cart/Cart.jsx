import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css";
import { loadStripe } from "@stripe/stripe-js";

const apiURL = import.meta.env.VITE_API_URL; // e.g., http://localhost:3001/api/payment

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleCheckout = async () => {
    try {
      // Require auth before hitting protected payment route
      const token = localStorage.getItem("token");
      if (!token) {
        // send the user to login and return back here after success
        navigate("/login", { state: { from: location } });
        return;
      }

      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );

      const body = { products: cart };

      const response = await fetch(`${apiURL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <<-- protected route
        },
        body: JSON.stringify(body),
      });

      // If token is invalid/expired, backend will send 401/403 → push to login
      if (response.status === 401 || response.status === 403) {
        navigate("/login", { state: { from: location } });
        return;
      }

      const session = await response.json();

      if (!session?.id) {
        console.error("Checkout session not created:", session);
        alert(session?.error || "Unable to create checkout session.");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error);
        alert("Stripe redirect failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.book._id}>
              <img src={item.book.coverImage} alt={item.book.title} />
              <div className="item-details">
                <h3>{item.book.title}</h3>
                <p>by {item.book.author}</p>
                <p>Price: {item.book.price.toFixed(2)} Tk</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.book._id)}>
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.book._id)}>
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.book._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary">
        <h3>Total Price: {getTotalPrice().toFixed(2)} Tk</h3>
      </div>

      <button
        className="checkout-btn"
        onClick={handleCheckout}
        disabled={cart.length === 0}
        title={cart.length === 0 ? "Cart is empty" : "Proceed to Checkout"}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
