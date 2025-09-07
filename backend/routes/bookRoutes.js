//bookRoutes.js

const express = require("express");
const {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

// Route to add a new book
router.post("/add", addBook);

// Route to get all books
router.get("/list", getAllBooks);

// Route to update a book by ID
router.put("/:id", updateBook);

// Route to delete a book by ID
router.delete("/:id", deleteBook);

module.exports = router;
