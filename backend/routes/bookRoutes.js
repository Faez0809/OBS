const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookById,
  addBookReview,
} = require("../controllers/bookController");

// More specific routes should come first
router.post("/add", addBook);
router.post("/:id/reviews", verifyToken, addBookReview);
router.get("/list", getAllBooks);

// More general routes come after
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);


module.exports = router;