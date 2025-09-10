// src/components/books/ViewAllBooks.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ViewAllBooks.css";
import { CartContext } from "../../context/CartContext";
import Cart from "../Cart/Cart";
import { useLocation, Link } from "react-router-dom";

// small helper to draw ★ stars from average rating (0..5)
const Stars = ({ value = 0 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span aria-label={`rating ${value} out of 5`}>
      {"★".repeat(full)}
      {half ? "☆" : ""}
      {"☆".repeat(empty)}
    </span>
  );
};

const ViewAllBooks = () => {
  const [books, setBooks] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/books/list");
        setBooks(res.data || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setBooks([]);
      }
    };
    fetchBooks();
  }, []);

  // scroll to a section when hash exists
  useEffect(() => {
    if (location.hash && books.length > 0) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash, books]);

  const toggleCart = () => setShowCart((prev) => !prev);

  // Groups
  const allBooks = books;
  const fictionBooks = books.filter((b) => b.category === "Fiction & Literature");
  const mysteryBooks = books.filter((b) => b.category === "Mystery & Thrillers");
  const skillBooks = books.filter((b) => b.category === "Skill Development");
  const novelBooks = books.filter((b) => b.category === "Novels");

  // one renderer for any group
  const renderBooks = (bookList, categoryName) => (
    <div className="book-section">
      <div className="section-title">{categoryName}</div>
      <div className="book-grid">
        {bookList.map((book) => {
          const avg = Number(book.rating || 0);
          const count = Number(book.numReviews || 0);
          const pub =
            book.publishDate ? new Date(book.publishDate).toLocaleDateString() : "-";

          return (
            <div className="book-card" key={book._id}>
              <img src={book.coverImage} alt={book.title} />
              <h2>{book.title}</h2>
              <h3>by {book.author}</h3>

              {/* NEW: rating + number of reviews */}
              <p style={{ marginTop: 6 }}>
                <Stars value={avg} />{" "}
                <span style={{ color: "#666" }}>
                  {avg ? avg.toFixed(1) : "0.0"} ({count})
                </span>
              </p>

              <p>Price: {book.price} Tk</p>
              <p>
                <strong>Publish Date:</strong> {pub}
              </p>

              {/* NEW: See Details button (navigates to /books/:id) */}
              <Link
                to={`/books/${book._id}`}
                className="details-link"
                style={{
                  display: "block",
                  marginBottom: 10,
                  padding: "10px 20px",
                  borderRadius: 30,
                  border: "1px solid #ddd",
                  textDecoration: "none",
                  color: "#333",
                }}
              >
                See Details
              </Link>

              <button onClick={() => addToCart(book)}>Add to Cart</button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="view-all-books">
      <div className="cart-summary" onClick={toggleCart}>
        🛒 Cart: {cart.length} items
      </div>

      {showCart && <Cart onClose={() => setShowCart(false)} />}

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
