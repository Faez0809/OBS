// src/components/Home.jsx

//import React from "react";
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
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { useNavigate } from "react-router-dom";

import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import Cart from "./Cart/Cart";




function BookCafe() {
  const { addToCart } = useContext(CartContext);
  const { cart } = useContext(CartContext);
  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => setShowCart((prev) => !prev);


  const navigate = useNavigate();

  // ✅ check auth once to decide which nav items to show
  const isLoggedIn = !!localStorage.getItem("token");

  return (

    <body>
      <section className="main">
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

            {/* 👇 show Register/Login only when NOT logged in */}
            {!isLoggedIn && (
              <>
                <li id="Registerr">
                  <a href="./register">Register</a>
                </li>
                <li id="Loginn">
                  <a href="./login">Login</a>
                </li>
              </>
            )}

            {/* 👇 show Logout only when logged in (as a link) */}
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
              onClick={toggleCart}
              style={{
                cursor: "pointer",
                color: "#fff",        // white text so it’s visible on dark nav background
                fontWeight: "500",
                marginLeft: "1rem",    // spacing from other nav items
                display: "flex",
                alignItems: "center"
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




        <section className="hero" id="home">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>
              Find Your <span>Ideal</span> Books Here
            </h1>
            <p className="details">
              “A book is a gift you can open again and again.” ― Garrison
              Keillor
            </p>
            {/* <a href="#featured" className="btn hero-btn">
              Explore Now
            </a> */}
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
              Uncover the top picks in our collection—an exclusive selection
              of the most enjoyable and exciting reads!
            </p>

            {/* <button type="button" class="btn ">Success</button> */}
          </div>
          <div className="box">
            <img src={delivary} alt="delivary" />
            <h3>Fast Delivery</h3>
            <p>
              Swift deliveries, because your next great read shouldn't wait.
              Get your books in a flash!
            </p>

          </div>
          <div className="box">
            <img src={payment} alt="payment" />
            <h3>Easy Payment</h3>
            <p>
              Quick and easy checkout. Spend less time paying, more time
              reading. Simple as that
            </p>

          </div>
        </div>
      </section>

      <section className="product" id="product">
        <h1 className="heading">
          Our<span>Products</span>
        </h1>
        <div className="product-slider">
          <div className="wrapper">
            <div className="box">
              <img src={ckt} alt="ckt theory" />
              <h3>Electronic Devices and Circuit Theory</h3>
              <div className="price">BDT 450 taka</div>
              <div className="stars">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>


              <a
                href="#"
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    _id: "static-ckt",                          // any unique id
                    title: "Electronic Devices and Circuit Theory",
                    author: "Boylestad & Nashelsky",
                    price: 450,
                    coverImage: ckt,
                  });
                }}
              >
                Add to cart
              </a>



            </div>
            <div className="box">
              <img src={sadiku} alt="sadiku" />
              <h3>Fundamentals of Electric Circuits</h3>
              <div className="price">BDT 500 taka</div>
              <div className="stars">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>

              <a
                href="#"
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    _id: "static-fec",
                    title: "Fundamentals of Electric Circuits",
                    author: "Alexander & Sadiku",
                    price: 500,
                    coverImage: sadiku,
                  });
                }}
              >
                Add to cart
              </a>



            </div>

            <div className="box">
              <img src={Ansi} alt="Ansi" />
              <h3>Ansi C</h3>
              <div className="price">BDT 250 taka</div>
              <div className="stars">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>

              <a
                href="#"
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    _id: "static-ansi",
                    title: "Ansi C",
                    author: "E. Balagurusamy",
                    price: 250,
                    coverImage: Ansi,
                  });
                }}
              >
                Add to cart
              </a>

            </div>
            {/* Add more product boxes as needed */}
          </div>
        </div>{" "}
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

      {/* ==================== CHANGED SECTION STARTS HERE ==================== */}
      <section className="catagories" id="catagories">
        <h1 className="heading">
          Product<span>Categories</span>
        </h1>
        <div className="box-container">
          <div className="box">
            <img src={Fic} alt="Fiction and literature" />
            <h3>Fiction & Literature </h3>
            <p>Up to 80% off</p>
            {/* CHANGED: Replaced <a> with <Link> */}
            <Link to="/allbooks#fiction-literature" className="btn">
              Shop now
            </Link>
          </div>
          <div className="box">
            <img src={mystery} alt="mystery" />
            <h3>Mystery & Thrillers</h3>
            <p>Up to 50% off</p>
            {/* CHANGED: Replaced <a> with <Link> */}
            <Link to="/allbooks#mystery-thrillers" className="btn">
              Shop now
            </Link>
          </div>
          <div className="box">
            <img src={skill} alt="skill" />
            <h3>Skill Development</h3>
            <p>Up to 60% off</p>
            {/* CHANGED: Replaced <a> with <Link> */}
            <Link to="/allbooks#skill-development" className="btn">
              Shop now
            </Link>
          </div>
          <div className="box">
            <img src={novel} alt="novel" />
            <h3>Novels</h3>
            <p>Up to 40% off</p>
            {/* CHANGED: Replaced <a> with <Link> */}
            <Link to="/allbooks#novels" className="btn">
              Shop now
            </Link>
          </div>
        </div>
      </section>
      {/* ==================== CHANGED SECTION ENDS HERE ==================== */}


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