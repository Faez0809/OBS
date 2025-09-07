// src/components/books/ViewAllBooks.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ViewAllBooks.css";
import { CartContext } from "../../context/CartContext";
import Cart from "../Cart/Cart";
import { useLocation } from "react-router-dom"; // ADDED: Import useLocation

const ViewAllBooks = () => {
  const [books, setBooks] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart } = useContext(CartContext);
  const location = useLocation(); // ADDED: Get location object

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

  // ADDED: useEffect to handle scrolling
  useEffect(() => {
    // Check if there is a hash and if books have loaded
    if (location.hash && books.length > 0) {
      // Remove the '#' from the hash to get the ID
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Scroll to the element smoothly
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash, books]); // Rerun this effect if hash or books change

  const toggleCart = () => {
    setShowCart((prevShowCart) => !prevShowCart);
  };

  // Group books into categories
  const allBooks = books;
  const fictionBooks = books.filter(book => book.category === "Fiction & Literature");
  const mysteryBooks = books.filter(book => book.category === "Mystery & Thrillers");
  const skillBooks = books.filter(book => book.category === "Skill Development");
  const novelBooks = books.filter(book => book.category === "Novels");

  // Function to render books in each category
  const renderBooks = (bookList, categoryName) => (
    <div className="book-section">
      <div className="section-title">{categoryName}</div>
      <div className="book-grid">
        {bookList.map((book) => (
          <div className="book-card" key={book._id}>
            <img src={book.coverImage} alt={book.title} />
            <h2>{book.title}</h2>
            <h3>by {book.author}</h3>
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

  return (
    <div className="view-all-books">
      <div className="cart-summary" onClick={toggleCart}>
        🛒 Cart: {cart.length} items
      </div>

      {showCart && <Cart onClose={() => setShowCart(false)} />}

      {/* CHANGED: Wrapped each section in a div with a corresponding ID */}
      <div id="all-books">
        <h1>All Books</h1>
        {renderBooks(allBooks, "All Books")}
      </div>
      
      <div id="fiction-literature">
        <h1>Fiction & Literature</h1>
        {renderBooks(fictionBooks, "Fiction & Literature")}
      </div>
      
      <div id="mystery-thrillers">
        <h1>Mystery & Thrillers</h1>
        {renderBooks(mysteryBooks, "Mystery & Thrillers")}
      </div>
      
      <div id="skill-development">
        <h1>Skill Development</h1>
        {renderBooks(skillBooks, "Skill Development")}
      </div>
      
      <div id="novels">
        <h1>Novels</h1>
        {renderBooks(novelBooks, "Novels")}
      </div>
    </div>
  );
};

export default ViewAllBooks;