import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ViewAllBooks.css";
import { CartContext } from "../../context/CartContext";
import Cart from "../Cart/Cart"; // Import the Cart component

const ViewAllBooks = () => {
  const [books, setBooks] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart } = useContext(CartContext);

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

  const toggleCart = () => {
    setShowCart((prevShowCart) => !prevShowCart);
  };

  // Group books into categories
  const allBooks = books; // All Books section
  const fictionBooks = books.filter(book => book.category === "Fiction & Literature");
  const mysteryBooks = books.filter(book => book.category === "Mystery & Thrillers");
  const skillBooks = books.filter(book => book.category === "Skill Development");
  const novelBooks = books.filter(book => book.category === "Novels");

  // Function to render books in each category
  const renderBooks = (bookList, categoryName) => (
    <div className="book-section">
      <div className="section-title">{categoryName}</div>
      <div className="book-grid">
        {bookList.map((book) => (
          <div className="book-card" key={book._id}>
            <img src={book.coverImage} alt={book.title} />
            <h2>{book.title}</h2>
            <h3>by {book.author}</h3>
            <p>Price: {book.price} Tk</p>
            <p>
              <strong>Publish Date:</strong>{" "}
              {new Date(book.publishDate).toLocaleDateString()}
            </p>
            <button onClick={() => addToCart(book)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="view-all-books">
      <div className="cart-summary" onClick={toggleCart}>
        🛒 Cart: {cart.length} items
      </div>

      {showCart && <Cart onClose={() => setShowCart(false)} />} 

      <h1>All Books</h1>
      {renderBooks(allBooks, "All Books")}

      <h1>Fiction & Literature</h1>
      {renderBooks(fictionBooks, "Fiction & Literature")}

      <h1>Mystery & Thrillers</h1>
      {renderBooks(mysteryBooks, "Mystery & Thrillers")}

      <h1>Skill Development</h1>
      {renderBooks(skillBooks, "Skill Development")}

      <h1>Novels</h1>
      {renderBooks(novelBooks, "Novels")}
    </div>
  );
};

export default ViewAllBooks;
