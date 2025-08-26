import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  console.log(cart);

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

  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item.book._id !== bookId));
  };

  const increaseQuantity = (bookId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.book._id === bookId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

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
        // Remove item if quantity is 1 and we try to decrease
        return prevCart.filter((item) => item.book._id !== bookId);
      }
    });
  };
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
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
