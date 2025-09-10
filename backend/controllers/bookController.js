const Book = require("../models/Book");
const mongoose = require("mongoose");

// Add a new book
const addBook = async (req, res) => {
  try {
    const { title, author, description, publishDate, coverImage, price, category } = req.body;

    console.log("Received data for adding book:", req.body);

    const newBook = new Book({
      title,
      author,
      description,
      publishDate,
      coverImage,
      price,
      category,
    });

    const savedBook = await newBook.save();
    console.log("Saved book:", savedBook);

    res.status(201).json(savedBook);
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ error: "Failed to add book" });
  }
};

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Failed to retrieve books" });
  }
};

// Update a book by ID
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(updatedBook);
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ error: "Failed to update book" });
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

// ================= NEW CONTROLLERS ================= //

// Get single book by ID (with reviews)
const getBookById = async (req, res) => {
  try {
    // Ensure the bookId passed in the URL is cast to ObjectId
    const bookId = mongoose.Types.ObjectId(req.params.id);  // Convert to ObjectId for MongoDB query
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);  // Return the book details
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(400).json({ message: "Invalid book ID" });  // If invalid ID, return an error message
  }
};

// Add review to a book (requires auth middleware to set req.user)
const addBookReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if user already reviewed this book
    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this book" });
    }

    // Add the new review
    const review = {
      user: req.user.id,
      name: req.user.name || req.user.email,
      rating: Number(rating),
      comment,
    };

    book.reviews.push(review);

    // Update rating and number of reviews
    book.numReviews = book.reviews.length;
    book.rating = book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length;

    await book.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookById,
  addBookReview,
};
