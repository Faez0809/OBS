import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ViewAllBooks.css";
import { CartContext } from "../../context/CartContext";
import Cart from "../Cart/Cart"; // Import the Cart component

const ViewAllBooks = () => {
  const [books, setBooks] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchBooks = async () => { 
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/books/list");
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  const toggleCart = () => {
    setShowCart((prevShowCart) => !prevShowCart);
  };

  return (
    <div className="view-all-books">
      <div className="cart-summary" onClick={toggleCart}>
        🛒 Cart: {cart.length} items
      </div>
      
      {showCart && <Cart onClose={() => setShowCart(false)} />} 
      {/* Show Cart component if showCart is true  and This lets the Cart tell the parent to hide itself.*/}
      <h1>All Books</h1>
      <div className="book-list">
        {books.map((book) => (
          <div className="book-card" key={book._id}>
            <img src={book.coverImage} alt={book.title} />
            <h2>{book.title}</h2>
            <h3>by {book.author}</h3>
            <p>Description: {book.description}</p>
            <p>Price: {book.price} Tk</p>
            <p>
              <strong>Publish Date:</strong>{" "}
              {new Date(book.publishDate).toLocaleDateString()}
            </p>
            <button onClick={() => addToCart(book)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllBooks;
