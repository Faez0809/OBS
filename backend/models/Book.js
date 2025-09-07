// models/Book.js

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  publishDate: Date,
  coverImage: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },  // category is a required field
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
