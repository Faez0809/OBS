// Import the Book model to interact with the database
const Book = require("../models/Book");

// Function to add a new book to the database
const addBook = async (req, res) => {
  try {
    // Extract book details from request body
    const { title, author, description, publishDate, coverImage, price } = req.body;

    // Create a new book instance with provided details
    const newBook = new Book({
      title,
      author,
      description,
      publishDate,
      coverImage,
      price, 
    });

    // Save the new book to MongoDB
    const savedBook = await newBook.save();
    res.status(201).json(savedBook); // Send back the saved book data as JSON
  } catch (err) {
    res.status(500).json({ error: "Failed to add book" }); // Handle errors gracefully
  }
};

// Function to retrieve all books from the database
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books
    res.json(books); // Return the list of books
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve books" }); // Handle errors
  }
};

// Function to update a book by its ID
const updateBook = async (req, res) => {
  try {
    const { id } = req.params; // Get book ID from request parameters
    const { title, author, description, publishDate, coverImage, price } = req.body;

    // Find book by ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" }); // Return error if book doesn't exist
    }

    // Update fields only if they are provided
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.publishDate = publishDate || book.publishDate;
    book.coverImage = coverImage || book.coverImage;
    book.price = price || book.price; 

    // Save the updated book data
    const updatedBook = await book.save();
    res.json(updatedBook); // Return the updated book data
  } catch (err) {
    res.status(500).json({ error: "Failed to update book" }); // Handle errors
  }
};

// Function to delete a book by its ID
const deleteBook = async (req, res) => {
  const { id } = req.params; // Extract book ID from request parameters

  try {
    console.log(`Attempting to delete book with ID: ${id}`);

    // Validate if ID is a proper MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid book ID: ${id}`);
      return res.status(400).json({ error: "Invalid book ID" });
    }

    // Find the book by ID
    const book = await Book.findById(id);
    if (!book) {
      console.log(`Book not found with ID: ${id}`);
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete the book from the database
    await Book.deleteOne({ _id: id });
    console.log(`Book with ID: ${id} deleted successfully`);
    res.json({ message: "Book deleted successfully" }); // Confirm deletion
  } catch (err) {
    console.error(`Error deleting book with ID: ${id}`, err);
    res.status(500).json({ error: "Failed to delete book" }); // Handle errors
  }
};

// Export controller functions for use in routes
module.exports = { addBook, getAllBooks, updateBook, deleteBook };
