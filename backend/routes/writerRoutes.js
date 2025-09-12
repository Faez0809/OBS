// routes/writerRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllWriters,
  getWriterById,
  addWriter,
  updateWriter,
  deleteWriter
} = require('../controllers/writerController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/list', getAllWriters);
router.get('/:id', getWriterById);

// Protected routes (Admin only)
router.post('/add', authMiddleware, addWriter);
router.put('/:id', authMiddleware, updateWriter);
router.delete('/:id', authMiddleware, deleteWriter);

module.exports = router;
