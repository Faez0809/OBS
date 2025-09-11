// src/components/BookDetails/BookDetails.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css"; // Add styles if necessary

const BookDetails = () => {
  const { id: routeId, bookId } = useParams(); // support both /books/:id and /bookdetails/:bookId
  const resolvedId = routeId || bookId;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");

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
        } catch {}
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
      const res = await axios.post(
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
          <p className="price">Price: {book.price} Tk</p>
          <p className="pubdate">
            Publish Date: {book.publishDate ? new Date(book.publishDate).toLocaleDateString() : "-"}
          </p>
          <p>Category: {book.category}</p>
          <p>
            <strong>Rating:</strong> {averageRating ? averageRating.toFixed(1) : "0.0"} ({book.reviews?.length || 0})
          </p>
        </div>
      </div>

      <div className="desc">
        <h3>Description</h3>
        <p>{book.description || "No description provided."}</p>
      </div>

      <div className="add-review">
        <h3>Leave a rating & feedback</h3>
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
  );
};

export default BookDetails;