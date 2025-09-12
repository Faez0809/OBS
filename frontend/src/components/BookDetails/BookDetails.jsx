// src/components/BookDetails/BookDetails.jsx

import { useEffect, useMemo, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css"; // Add styles if necessary
import { CartContext } from "../../context/CartContext";
import Cart from "../Cart/Cart";
import logo from "../random/DisplayPhoto.jpg";

const BookDetails = () => {
  const { id: routeId, bookId } = useParams(); // support both /books/:id and /bookdetails/:bookId
  const resolvedId = routeId || bookId;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const { addToCart, cart } = useContext(CartContext);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Try API first
        const response = await axios.get(
          `http://127.0.0.1:3001/api/books/${resolvedId}`
        );
        setBook(response.data);
        setError("");
      } catch (err) {
        // Fallback to cached list if direct fetch fails or id is invalid
        try {
          const cached = sessionStorage.getItem("all_books_cache");
          if (cached) {
            const list = JSON.parse(cached);
            const found = list.find((b) => String(b._id) === String(resolvedId));
            if (found) {
              setBook(found);
              setError("");
              return setLoading(false);
            }
          }
        } catch {/* ignore cache errors */}
        console.error("Error fetching book details:", err);
        setBook(null);
        setError("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [resolvedId]); // Re-fetch if id changes

  const averageRating = useMemo(() => {
    if (!book?.reviews?.length) return 0;
    const sum = book.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return sum / book.reviews.length;
  }, [book]);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!resolvedId || resolvedId.length < 12) {
        alert("Invalid book. Please open a valid book from All Books.");
        return;
      }
      if (!token) {
        alert("Please login to submit a review.");
        return;
      }
      await axios.post(
        `http://127.0.0.1:3001/api/books/${resolvedId}/reviews`,
        { rating: ratingInput, comment: commentInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refetch details to show new review
      const refreshed = await axios.get(
        `http://127.0.0.1:3001/api/books/${resolvedId}`
      );
      setBook(refreshed.data);
      setCommentInput("");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message || "Failed to submit review. Please login."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="details-page">Loading...</div>;
  }

  if (!book) {
    return <div className="details-page">Book not found</div>;
  }

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
            <Link to="/allbooks">Books</Link>
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

      {showCart && <Cart onClose={() => setShowCart(false)} />}

      <div className="details-page">
      <div className="top">
        <img
          className="cover"
          src={book.coverImage || book.coverImageUrl}
          alt={book.title}
          loading="eager"
        />
        <div className="meta">
          <h2>{book.title}</h2>
          <p>by {book.author}</p>
          <div className="badges">
            <span className="badge rating-badge">⭐ {averageRating ? averageRating.toFixed(1) : "0.0"} ({book.reviews?.length || 0})</span>
            {book.category && <span className="badge category-badge">{book.category}</span>}
            <span className="badge date-badge">{book.publishDate ? new Date(book.publishDate).toLocaleDateString() : "No date"}</span>
          </div>
          <p className="price">Price: {book.price} Tk</p>

          <div className="meta-actions">
            <button className="btn-primary" onClick={() => addToCart(book)}>Add to Cart</button>
            <button className="btn-secondary" onClick={() => window.history.back()}>Back</button>
          </div>
        </div>
      </div>

      <div className="desc">
        <h3>Description</h3>
        <p>{book.description || "No description provided."}</p>
      </div>

      <div className="add-review">
        <h3>Leave a rating & feedback</h3>
        {isLoggedIn ? (
          <form onSubmit={submitReview}>
            <label>
              Rating:
              <span className="star-input" aria-label="Set rating">
                {[1,2,3,4,5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={r <= ratingInput ? 'active' : ''}
                    onClick={() => setRatingInput(r)}
                    disabled={submitting}
                    aria-label={`${r} star${r>1?'s':''}`}
                  >
                    ★
                  </button>
                ))}
              </span>
            </label>
            <label style={{ marginTop: 12 }}>
              Feedback:
              <textarea
                rows={4}
                placeholder="Share your thoughts about this book"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={submitting}
              />
            </label>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Please <Link to="/login">login</Link> to leave a rating and review.</p>
          </div>
        )}
      </div>

      <div className="reviews">
        <h3>What readers say</h3>
        {book.reviews && book.reviews.length > 0 ? (
          <ul className="review-list">
            {book.reviews.map((review, index) => (
              <li className="review" key={index}>
                <div className="review-head">
                  {review.name} — {Number(review.rating).toFixed(1)}★
                </div>
                <div className="comment">{review.comment}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default BookDetails;