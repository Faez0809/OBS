// models/Book.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },       // reviewer display name
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },       // aka name
    author: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    price: { type: Number, required: true, default: 0 },
    publishDate: { type: Date },
    coverImage: { type: String, default: '' },
    coverImageUrl: { type: String, default: '' },

    // NEW:
    rating: { type: Number, required: true, default: 0 },      // average
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
