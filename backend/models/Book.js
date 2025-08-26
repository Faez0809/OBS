const mongoose = require("mongoose"); // Add this line

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  publishDate: Date,
  coverImage: String, 
  price: { type: Number, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
