// src/components/BookDetails/BookDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css"; // Add styles if necessary

const BookDetails = () => {
  const { bookId } = useParams(); // Extract bookId from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:3001/api/books/${bookId}`
        );
        setBook(response.data);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setBook(null); // If there's an error, set book to null
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchBookDetails();
  }, [bookId]); // Re-fetch if bookId changes

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (!book) {
    return <div>Book not found</div>; // If no book is found, show this message
  }

  return (
    <div className="book-details">
      <h1>{book.title}</h1>
      <h2>by {book.author}</h2>
      {/* Corrected: The property for the image is `coverImage`, not `coverImageUrl` */}
      <img src={book.coverImage} alt={book.title} />
      <p>{book.description}</p>
      <p>
        <strong>Price:</strong> {book.price} Tk
      </p>
      <p>
        <strong>Category:</strong> {book.category}
      </p>
      <p>
        <strong>Publish Date:</strong>{" "}
        {new Date(book.publishDate).toLocaleDateString()}
      </p>

      <div>
        <h3>Ratings and Reviews</h3>
        {book.reviews && book.reviews.length > 0 ? (
          <ul>
            {book.reviews.map((review, index) => (
              <li key={index}>
                <strong>{review.name}</strong>: {review.comment} <br />
                Rating: {review.rating} stars
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