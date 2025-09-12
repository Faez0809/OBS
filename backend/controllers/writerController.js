// controllers/writerController.js
const Writer = require('../models/Writer');
const mongoose = require('mongoose');

// Get all writers
const getAllWriters = async (req, res) => {
  try {
    const writers = await Writer.find({ isActive: true }).sort({ name: 1 });
    res.json(writers);
  } catch (err) {
    console.error('Error fetching writers:', err);
    res.status(500).json({ message: 'Failed to fetch writers' });
  }
};

// Get writer by ID
const getWriterById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid writer ID' });
    }

    const writer = await Writer.findById(id);
    
    if (!writer) {
      return res.status(404).json({ message: 'Writer not found' });
    }

    res.json(writer);
  } catch (err) {
    console.error('Error fetching writer:', err);
    res.status(500).json({ message: 'Failed to fetch writer' });
  }
};

// Add new writer (Admin only)
const addWriter = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      imageUrl,
      birthDate,
      nationality,
      genre,
      biography,
      awards,
      website,
      socialMedia
    } = req.body;

    const writer = new Writer({
      name,
      description,
      image,
      imageUrl,
      birthDate,
      nationality,
      genre,
      biography,
      awards: awards || [],
      website,
      socialMedia: socialMedia || {}
    });

    await writer.save();
    res.status(201).json({ message: 'Writer added successfully', writer });
  } catch (err) {
    console.error('Error adding writer:', err);
    res.status(500).json({ message: 'Failed to add writer' });
  }
};

// Update writer (Admin only)
const updateWriter = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid writer ID' });
    }

    const writer = await Writer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!writer) {
      return res.status(404).json({ message: 'Writer not found' });
    }

    res.json({ message: 'Writer updated successfully', writer });
  } catch (err) {
    console.error('Error updating writer:', err);
    res.status(500).json({ message: 'Failed to update writer' });
  }
};

// Delete writer (Admin only)
const deleteWriter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid writer ID' });
    }

    const writer = await Writer.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!writer) {
      return res.status(404).json({ message: 'Writer not found' });
    }

    res.json({ message: 'Writer deleted successfully' });
  } catch (err) {
    console.error('Error deleting writer:', err);
    res.status(500).json({ message: 'Failed to delete writer' });
  }
};

module.exports = {
  getAllWriters,
  getWriterById,
  addWriter,
  updateWriter,
  deleteWriter
};
