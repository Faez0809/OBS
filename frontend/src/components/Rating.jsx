// src/components/Rating.jsx
import React from 'react';
import './rating.css';

export default function Rating({ value = 0, count = 0, size = 16 }) {
  const stars = [1, 2, 3, 4, 5].map((i) => (
    <span
      key={i}
      className={value >= i ? 'star filled' : 'star'}
      style={{ fontSize: size }}
    >
      ★
    </span>
  ));

  return (
    <div className="rating">
      <span className="stars">{stars}</span>
      <span className="count">({count})</span>
    </div>
  );
}
