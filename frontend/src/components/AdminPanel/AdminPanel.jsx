//AdminPanel.jsx


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [writers, setWriters] = useState([]);
  const [activeTab, setActiveTab] = useState("books"); // "books" or "writers"
  
  // Book states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(""); 
  const [editingBook, setEditingBook] = useState(null);
  
  // Writer states
  const [writerName, setWriterName] = useState("");
  const [writerDescription, setWriterDescription] = useState("");
  const [writerImage, setWriterImage] = useState("");
  const [writerImageUrl, setWriterImageUrl] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationality, setNationality] = useState("");
  const [genre, setGenre] = useState("");
  const [biography, setBiography] = useState("");
  const [awards, setAwards] = useState("");
  const [website, setWebsite] = useState("");
  const [editingWriter, setEditingWriter] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/books/list");
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    const fetchWriters = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/writers/list");
        setWriters(res.data);
      } catch (err) {
        console.error("Error fetching writers:", err);
      }
    };

    fetchBooks();
    fetchWriters();
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

  // Writer management functions
  const handleWriterSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const newWriter = {
        name: writerName,
        description: writerDescription,
        image: writerImage,
        imageUrl: writerImageUrl,
        birthDate,
        nationality,
        genre,
        biography,
        awards: awards.split(',').map(award => award.trim()).filter(award => award),
        website,
      };

      if (editingWriter) {
        await axios.put(`http://127.0.0.1:3001/api/writers/${editingWriter._id}`, newWriter, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://127.0.0.1:3001/api/writers/add", newWriter, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Clear form
      clearWriterForm();

      // Refresh the list of writers
      const res = await axios.get("http://127.0.0.1:3001/api/writers/list");
      setWriters(res.data);
    } catch (err) {
      console.error("Error adding/updating writer:", err);
      alert("Failed to add/update writer");
    }
  };

  const handleWriterEdit = (writer) => {
    setWriterName(writer.name);
    setWriterDescription(writer.description);
    setWriterImage(writer.image);
    setWriterImageUrl(writer.imageUrl);
    setBirthDate(writer.birthDate ? writer.birthDate.split('T')[0] : "");
    setNationality(writer.nationality);
    setGenre(writer.genre);
    setBiography(writer.biography);
    setAwards(writer.awards ? writer.awards.join(', ') : "");
    setWebsite(writer.website);
    setEditingWriter(writer);
  };

  const handleWriterDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:3001/api/writers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWriters(writers.filter((writer) => writer._id !== id));
    } catch (err) {
      console.error("Error deleting writer:", err);
      alert("Failed to delete writer");
    }
  };

  const clearWriterForm = () => {
    setWriterName("");
    setWriterDescription("");
    setWriterImage("");
    setWriterImageUrl("");
    setBirthDate("");
    setNationality("");
    setGenre("");
    setBiography("");
    setAwards("");
    setWebsite("");
    setEditingWriter(null);
  };

  return (
    <div>
      <div>
        <h1 className="topAdmin">Admin Panel</h1>
      </div>
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          Manage Books
        </button>
        <button 
          className={`tab-button ${activeTab === 'writers' ? 'active' : ''}`}
          onClick={() => setActiveTab('writers')}
        >
          Manage Writers
        </button>
      </div>

      <div className="admin-panel">
        {activeTab === 'books' && (
          <>
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
        </>
        )}

        {activeTab === 'writers' && (
          <form onSubmit={handleWriterSubmit}>
            <div>
              <h1>{editingWriter ? "Edit Writer" : "Add a New Writer"}</h1>
            </div>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={writerDescription}
                onChange={(e) => setWriterDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                value={writerImageUrl}
                onChange={(e) => setWriterImageUrl(e.target.value)}
              />
            </div>
            <div>
              <label>Birth Date:</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div>
              <label>Nationality:</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              />
            </div>
            <div>
              <label>Genre:</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div>
              <label>Biography:</label>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <label>Awards (comma-separated):</label>
              <input
                type="text"
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
                placeholder="Award 1, Award 2, Award 3"
              />
            </div>
            <div>
              <label>Website:</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <button type="submit">
              {editingWriter ? "Update Writer" : "Add Writer"}
            </button>
            {editingWriter && (
              <button type="button" onClick={clearWriterForm}>
                Cancel
              </button>
            )}
          </form>
        )}

        {activeTab === 'writers' && (
          <ul>
            <h2>Writer List</h2>
            {writers.map((writer) => (
              <li key={writer._id}>
                <strong>{writer.name}</strong> - {writer.nationality || 'Unknown'}
                <button onClick={() => handleWriterEdit(writer)}>Edit</button>
                <button onClick={() => handleWriterDelete(writer._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
