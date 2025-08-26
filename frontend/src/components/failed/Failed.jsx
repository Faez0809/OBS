// src/pages/Failed.jsx

import React from "react";
import "./Failed.css";

const Failed = () => {
  return (
    <div className="failed-container">
      <h1>Payment Failed!</h1>
      <p>
        Unfortunately, your payment could not be processed. Please try again.
      </p>
      <a href="/home" className="back-to-home">
        Go back to home
      </a>
    </div>
  );
};

export default Failed;
