// src/components/Home.jsx

import { useContext, useState, useEffect, useMemo } from "react";
import "./style.css";
import FaezImg from "./random/me.jpg";
import shamsul from "./random/shamsul arefin.jpg";
import Arif from "./random/arif azad.jpg";
import novel from "./random/novel.jpg";
import skill from "./random/skill.png";
import mystery from "./random/mystery.jpg";
import Fic from "./random/Fiction and literature.jpg";
import Ansi from "./random/Ansi.jpg";
import sadiku from "./random/sadiku.jpg";
import ckt from "./random/ckt theory.jpg";
import payment from "./random/payment.webp";
import delivary from "./random/delivary.avif";
import Origin from "./random/Origin.jpg";
import logo from "./random/DisplayPhoto.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

import { CartContext } from "../context/CartContext";
import Cart from "./Cart/Cart";

/** Tiny star renderer (0..5) */
const Stars = ({ value = 0 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span aria-label={`rating ${value} out of 5`} className="stars-inline">
      {"★".repeat(full)}
      {half ? "☆" : ""}
      {"☆".repeat(empty)}
    </span>
  );
};

function BookCafe() {
  const { addToCart, cart } = useContext(CartContext);
  const [showCart, setShowCart] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // auth flag for nav
  const isLoggedIn = !!localStorage.getItem("token");

  // fetch all books once, so "featured" can pull real rating/review/ids
  useEffect(() => {
    const cached = sessionStorage.getItem("all_books_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setBooks(parsed);
      } catch {}
    }

    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/books/list", { headers: { "Cache-Control": "no-cache" } });
        const data = res.data || [];
        setBooks(data);
        sessionStorage.setItem("all_books_cache", JSON.stringify(data));
      } catch (e) {
        console.error("Home: could not load books list", e);
        setBooks([]);
      }
    };
    fetchBooks();
  }, []);

  const toggleCart = () => setShowCart((prev) => !prev);

  // Tries to find a DB book by loose title match; fallback returns null
  const findBook = (needle) =>
    books.find(
      (b) =>
        (b.title || "").toLowerCase().includes(needle.toLowerCase()) ||
        (b.title || "").toLowerCase() === needle.toLowerCase()
    ) || null;

  // Prepare 3 featured items (prefer DB when available)
  const featured = useMemo(
    () => [
      {
        fallback: {
          _id: "static-ckt",
          title: "Electronic Devices and Circuit Theory",
          author: "Boylestad & Nashelsky",
          price: 450,
          coverImage: ckt,
        },
        db: findBook("Electronic Devices and Circuit Theory"),
      },
      {
        fallback: {
          _id: "static-fec",
          title: "Fundamentals of Electric Circuits",
          author: "Alexander & Sadiku",
          price: 500,
          coverImage: sadiku,
        },
        db: findBook("Fundamentals of Electric Circuits"),
      },
      {
        fallback: {
          _id: "static-ansi",
          title: "Ansi C",
          author: "E. Balagurusamy",
          price: 250,
          coverImage: Ansi,
        },
        db: findBook("Ansi C"),
      },
    ],
    [books, findBook]
  );

  const pick = (item) => item.db || item.fallback;

  const handleAddToCart = (item) => {
    const book = pick(item);
    addToCart({
      _id: book._id,
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage || book.coverImageUrl || "",
    });
  };

  // Smooth scroll to sections (like ViewAllBooks)
  useEffect(() => {
    const onClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#' ) return;
      const id = href.slice(1);
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Handle hash in URL on page load (like ViewAllBooks)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return (
    <body>
      <section className="main" id="home">
        <nav>
          <a href="#" className="logo">
            <img src={logo} alt="logo" />
          </a>
          <ul className="menu">
            <li>
              <a href="#home" className="active">
                Homepage
              </a>
            </li>
            <li>
              <a href="#featured">Featured</a>
            </li>
            <li>
              <Link to="/allbooks">Books</Link>
            </li>
            <li>
              <a href="#catagories">Categories</a>
            </li>
            <li>
              <a href="#writer">Writer</a>
            </li>

            {!isLoggedIn && (
              <>
                <li id="Registerr">
                  <Link to="/register">Register</Link>
                </li>
                <li id="Loginn">
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}

            {isLoggedIn && (
              <li id="Logoutt">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.removeItem("token");
                    alert("You have been logged out.");
                    navigate("/login");
                  }}
                >
                  Logout
                </a>
              </li>
            )}

            <li
              onClick={() => setShowCart((p) => !p)}
              style={{
                cursor: "pointer",
                color: "#fff",
                fontWeight: "500",
                marginLeft: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              🛒 <span style={{ marginLeft: "6px" }}>Cart: {cart.length} items</span>
            </li>
          </ul>
          <a href="#" className="siteName">
            Book Cafe
          </a>
        </nav>

        {showCart && <Cart onClose={() => setShowCart(false)} />}

        <section className="hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>
              Find Your <span>Ideal</span> Books Here
            </h1>
            <p className="details">
              “A book is a gift you can open again and again.” ― Garrison Keillor
            </p>
          </div>
        </section>
      </section>

      <section className="featured" id="featured">
        <h1 className="heading">
          Our<span>Features</span>
        </h1>
        <div className="box-container">
          <div className="box">
            <img src={Origin} alt="Origin" />
            <h3>Best and Cool</h3>
            <p>
              Uncover the top picks in our collection—an exclusive selection of the
              most enjoyable and exciting reads!
            </p>
          </div>
          <div className="box">
            <img src={delivary} alt="delivary" />
            <h3>Fast Delivery</h3>
            <p>
              Swift deliveries, because your next great read shouldn&apos;t wait. Get your
              books in a flash!
            </p>
          </div>
          <div className="box">
            <img src={payment} alt="payment" />
            <h3>Easy Payment</h3>
            <p>
              Quick and easy checkout. Spend less time paying, more time reading.
              Simple as that
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS (3 featured) */}
      <section className="product" id="product">
        <h1 className="heading">
          Our<span>Products</span>
        </h1>

        <div className="product-slider">
          <div className="wrapper">
            {featured.map((item) => {
              const book = pick(item);
              const avg = Number(book.rating || 0);
              const count = Number(book.numReviews || 0);
              const hasDetails = !!item.db?._id;

              return (
                <div className="box" key={book._id}>
                  <img
                    src={book.coverImage || book.coverImageUrl || ckt}
                    alt={book.title}
                  />
                  <h3>{book.title}</h3>
                  <div className="price">BDT {Number(book.price).toFixed(0)} taka</div>

                  {/* rating + count */}
                  <div className="rating-row">
                    <Stars value={avg} />
                    <span className="rating-text">
                      {avg ? avg.toFixed(1) : "0.0"} ({count})
                    </span>
                  </div>

                  {/* details link: to real book details if we matched a DB book,
                      otherwise send user to All Books page */}
                  {hasDetails ? (
                    <Link to={`/books/${item.db._id}`} className="details-link">
                      See Details
                    </Link>
                  ) : (
                    <Link to="/allbooks#all-books" className="details-link">
                      See Details
                    </Link>
                  )}

                  <a
                    href="#"
                    className="btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(item);
                    }}
                  >
                    Add to cart
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mb-5">
          <h1>
            <Link
              to="/allbooks"
              className="text-decoration-none fw-bold text-primary"
            >
              View All Books
            </Link>
          </h1>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="catagories" id="catagories">
        <h1 className="heading">
          Product<span>Categories</span>
        </h1>
        <div className="box-container">
          <div className="box">
            <img src={Fic} alt="Fiction and literature" />
            <h3>Fiction & Literature </h3>
            <p>Up to 80% off</p>
            <Link to="/allbooks#fiction-literature" className="btn">
              Shop now
            </Link>
          </div>
          <div className="box">
            <img src={mystery} alt="mystery" />
            <h3>Mystery & Thrillers</h3>
            <p>Up to 50% off</p>
            <Link to="/allbooks#mystery-thrillers" className="btn">
              Shop now
            </Link>
          </div>
          <div className="box">
            <img src={skill} alt="skill" />
            <h3>Skill Development</h3>
            <p>Up to 60% off</p>
            <Link to="/allbooks#skill-development" className="btn">
              Shop now
            </Link>
          </div>
          <div className="box">
            <img src={novel} alt="novel" />
            <h3>Novels</h3>
            <p>Up to 40% off</p>
            <Link to="/allbooks#novels" className="btn">
              Shop now
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== WRITERS ==================== */}
      <section className="writer" id="writer">
        <h1 className="heading">
          Best <span>Writers</span>
        </h1>
        <div className="box-container">
          <div className="box">
            <img src={Arif} alt="arif azad" />
            <h3>Arif Azad</h3>
            <div className="stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
            </div>
            <a href="#" className="btn">
              View More
            </a>
          </div>
          <div className="box">
            <img src={shamsul} alt="shamsul arefin" />
            <h3>Shamsul Arefin</h3>
            <div className="stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
            </div>
            <a href="#" className="btn">
              View More
            </a>
          </div>
          <div className="box">
            <img src={FaezImg} alt="faez faiz" />
            <h3>Faez Mahmud</h3>
            <div className="stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
            </div>
            <a href="#" className="btn newtest">
              View More
            </a>
          </div>
        </div>
      </section>

      <footer className="footer bg-dark text-light py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0 text-center text-md-start">
              <h2 className="mb-3">
                Book Cafe <FontAwesomeIcon icon={faBook} />
              </h2>
              <p className="mb-0">
                “A room without books is like a body without a soul.”
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="social-icons list-inline mb-3">
                <li className="list-inline-item">
                  <a href="#" className="text-light">
                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-light">
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-light">
                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-light">
                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                  </a>
                </li>
              </ul>
              <p className="copyright mb-0">
                &copy; {new Date().getFullYear()} Book Cafe. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </body>
  );
}

export default BookCafe;