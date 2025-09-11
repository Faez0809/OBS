import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { CartContext } from "../../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css";
import { loadStripe } from "@stripe/stripe-js";

const apiURL = import.meta.env.VITE_API_URL;

const Cart = ({ onClose }) => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
    setCart,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (cart.length === 0 && typeof onClose === "function") {
      onClose();
    }
  }, [cart.length, onClose]);

  // Handle quantity change directly from the input
  const handleQuantityChange = (e, bookId) => {
    const value = e.target.value.trim();  // Trim spaces if any

    if (value === "") {
      // If the input is cleared (backspace), set quantity to 0
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.book._id === bookId ? { ...item, quantity: "" } : item
        )
      );
    } else {
      const numericValue = parseInt(value, 10);  // Parse the input as a number
      if (!isNaN(numericValue) && numericValue >= 0) {
        // If the value is valid (positive number), update the cart with the new quantity
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.book._id === bookId ? { ...item, quantity: numericValue } : item
          )
        );
      }
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must login first");
        navigate("/login", { state: { from: location } });
        return;
      }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

      const response = await fetch(`${apiURL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products: cart }),
      });

      if (response.status === 401 || response.status === 403) {
        alert("Session expired. Please login again.");
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
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.book._id}>
                <img src={item.book.coverImage} alt={item.book.title} />
                <div className="item-details">
                  <h3>{item.book.title}</h3>
                  <p>by {item.book.author}</p>
                  <p>Price: {item.book.price.toFixed(2)} Tk</p>

                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.book._id)}>-</button>

                    <input
                      type="text"                          // Changed from number to text
                      inputMode="numeric"                   // Makes the keyboard show numbers (on mobile)
                      value={item.quantity === "" ? "" : item.quantity}  // Allow empty if cleared
                      onChange={(e) => handleQuantityChange(e, item.book._id)}  // Handle input 
                      className="quantity-input"  // Custom styling for the input field
                    />

                    <button onClick={() => increaseQuantity(item.book._id)}>+</button>
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


          <button
            className="checkout-btn"
            onClick={handleCheckout}
            title="Proceed to Checkout"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

Cart.propTypes = {
  onClose: PropTypes.func,
};

export default Cart;
