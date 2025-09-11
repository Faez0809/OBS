// src/components/books/ViewAllBooks.jsx

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ViewAllBooks.css";
import { CartContext } from "../../context/CartContext";
import Cart from "../Cart/Cart";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../random/DisplayPhoto.jpg";

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

Stars.propTypes = {
  value: PropTypes.number,
};

const ViewAllBooks = () => {
  const [books, setBooks] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    // On first arrival to /allbooks without a hash, force scroll to top
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  // If there is a hash, scroll to that section once content is ready
  useEffect(() => {
    const cached = sessionStorage.getItem("all_books_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length) {
          setBooks(parsed);
        }
      } catch { /* ignore cache parse errors */ }
    }

    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/books/list", { headers: { "Cache-Control": "no-cache" } });
        const data = res.data || [];
        setBooks(data);
        sessionStorage.setItem("all_books_cache", JSON.stringify(data));
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


  // Prefetch cover images to reduce perceived loading
  useEffect(() => {
    if (!books || books.length === 0) return;
    const imgEls = books
      .map((b) => b.coverImage)
      .filter(Boolean)
      .slice(0, 20); // prefetch first 20 to be safe
    imgEls.forEach((src) => {
      const img = new Image();
      img.loading = "eager";
      img.src = src;
    });
  }, [books]);

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
    <div>
      <nav>
        <a href="#" className="logo">
          <img src={logo} alt="logo" />
        </a>
        <ul className="menu">
          <li>
            <Link to="/">Homepage</Link>
          </li>
          <li>
            <a href="/#featured">Featured</a>
          </li>
          <li>
            <Link className="active" to="/allbooks">Books</Link>
          </li>
          <li>
            <a href="/#catagories">Categories</a>
          </li>
          <li>
            <a href="/#writer">Writer</a>
          </li>

          {!isLoggedIn && (
            <>
              <li id="Registerr">
                <Link to="/register">Register</Link>
              </li>
              <li id="Loginn">
                <Link to="/login">Login</Link>
              </li>
            </>
          )}

          {isLoggedIn && (
            <li id="Logoutt">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem("token");
                  alert("You have been logged out.");
                  navigate("/login");
                }}
              >
                Logout
              </a>
            </li>
          )}

          <li
            onClick={() => setShowCart((p) => !p)}
            style={{
              cursor: "pointer",
              color: "#fff",
              fontWeight: "500",
              marginLeft: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            🛒 <span style={{ marginLeft: "6px" }}>Cart: {cart.length} items</span>
          </li>
        </ul>
        <a href="#" className="siteName">
          Book Cafe
        </a>
      </nav>

      <div style={{ height: 80 }} />

      <div className="view-all-books">
        <div className="books-hero">
          <h1>All Books</h1>
          <p>Browse our complete collection and discover your next favorite read.</p>
          <div className="hero-stats">
            <span className="stat-pill">Total books: {allBooks.length}</span>
            <a className="pill-link" href="#fiction-literature">Fiction & Literature</a>
            <a className="pill-link" href="#mystery-thrillers">Mystery & Thrillers</a>
            <a className="pill-link" href="#skill-development">Skill Development</a>
            <a className="pill-link" href="#novels">Novels</a>
          </div>
        </div>

        {showCart && <Cart onClose={() => setShowCart(false)} />}

        <div id="all-books">
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
    </div>
  );
};

export default ViewAllBooks;
