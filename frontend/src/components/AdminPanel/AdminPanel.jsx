//AdminPanel.jsx


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");  // Add category state
  const [price, setPrice] = useState(""); 
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/books/list");
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBook = {
        title,
        author,
        description,
        publishDate,
        coverImage,
        price,
        category,  // Ensure category is included here
      };
      if (editingBook) {
        // Update the book if in editing mode
        await axios.put(
          `http://127.0.0.1:3001/api/books/${editingBook._id}`,
          newBook
        );
        alert("Book updated successfully!");
        setEditingBook(null);
      } else {
        // Add new book
        await axios.post("http://127.0.0.1:3001/api/books/add", newBook);
        alert("Book added successfully!");
      }

      // Clear the form fields
      setTitle("");
      setAuthor("");
      setDescription("");
      setPublishDate("");
      setCoverImage("");
      setCategory("");  // Clear the category
      setPrice("");

      // Refresh the list of books
      const res = await axios.get("http://127.0.0.1:3001/api/books/list");
      setBooks(res.data);
    } catch (err) {
      console.error("Error adding/updating book:", err);
      alert("Failed to add/update book");
    }
  };

  const handleEdit = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setPublishDate(book.publishDate);
    setCoverImage(book.coverImage);
    setCategory(book.category);  // Set the selected category
    setPrice(book.price);
    setEditingBook(book);
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/api/books/${bookId}`);
      alert("Book deleted successfully!");

      // Refresh the list of books
      const res = await axios.get("http://127.0.0.1:3001/api/books/list");
      setBooks(res.data);
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed to delete book");
    }
  };

  return (
    <div>
      <div>
        <h1 className="topAdmin">Admin Panel</h1>
      </div>
      <div className="admin-panel">
        <form onSubmit={handleSubmit}>
          <div>
            <h1>{editingBook ? "Edit Book" : "Add a New Book"}</h1>
          </div>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Publish Date:</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </div>
          <div>
            <label>Cover Image URL:</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          {/* Category Select Dropdown */}
          <div>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Fiction & Literature">Fiction & Literature</option>
              <option value="Mystery & Thrillers">Mystery & Thrillers</option>
              <option value="Skill Development">Skill Development</option>
              <option value="Novels">Novels</option>
              <option value="All Books">All Books</option>
            </select>
          </div>

          <button type="submit">
            {editingBook ? "Update Book" : "Add Book"}
          </button>
        </form>

        <ul>
          <h2>Book List</h2>
          {books.map((book) => (
            <li key={book._id}>
              <strong>{book.title}</strong> by {book.author}
              <button onClick={() => handleEdit(book)}>Edit</button>
              <button onClick={() => handleDelete(book._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
