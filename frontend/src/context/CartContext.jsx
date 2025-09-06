import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // State for the cart

  // Function to add a book to the cart
  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.book._id === book._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.book._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { book, quantity: 1 }];
      }
    });
  };

  // Function to remove a book from the cart
  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item.book._id !== bookId));
  };

  // Function to increase quantity
  const increaseQuantity = (bookId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.book._id === bookId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Function to decrease quantity
  const decreaseQuantity = (bookId) => {
    setCart((prevCart) => {
      const itemToUpdate = prevCart.find((item) => item.book._id === bookId);

      if (itemToUpdate && itemToUpdate.quantity > 1) {
        return prevCart.map((item) =>
          item.book._id === bookId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter((item) => item.book._id !== bookId);
      }
    });
  };

  // Function to update quantity directly from the input
  const updateQuantity = (bookId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.book._id === bookId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Function to get total price
  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity, // Added updateQuantity method
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
