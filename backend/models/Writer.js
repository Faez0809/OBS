// models/Writer.js
const mongoose = require('mongoose');

const writerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    birthDate: { type: Date },
    nationality: { type: String, default: '' },
    genre: { type: String, default: '' },
    biography: { type: String, default: '' },
    awards: [{ type: String }],
    website: { type: String, default: '' },
    socialMedia: {
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Writer', writerSchema);
