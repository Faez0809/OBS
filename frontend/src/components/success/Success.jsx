// src/pages/Success.jsx

import React from "react";
import "./Success.css";

const Success = () => {
  return (
    <div className="success-container">
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your order is being processed.</p>
      <a href="/home" className="back-to-home">
        Go back to home
      </a>
    </div>
  );
};

export default Success;
