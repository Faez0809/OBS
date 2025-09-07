const Book = require("../models/Book");

// Add a new book
const addBook = async (req, res) => {
  try {
    // Destructure the incoming data from the request body
    const { title, author, description, publishDate, coverImage, price, category } = req.body;

    // Log the incoming data to confirm it's received correctly
    console.log("Received data for adding book:", req.body);

    // Create a new book instance with all provided details
    const newBook = new Book({
      title,
      author,
      description,
      publishDate,
      coverImage,
      price,
      category,
    });

    // Save the new book to MongoDB
    const savedBook = await newBook.save();

    // Log the saved book data to verify all fields, including category, are present
    console.log("Saved book:", savedBook);

    // Return the saved book with all details
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

module.exports = { addBook, getAllBooks, updateBook, deleteBook };