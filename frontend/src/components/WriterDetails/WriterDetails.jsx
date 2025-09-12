// src/components/WriterDetails/WriterDetails.jsx

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./WriterDetails.css";
import logo from "../random/DisplayPhoto.jpg";

const WriterDetails = () => {
  const { id } = useParams();
  const [writer, setWriter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWriterDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:3001/api/writers/${id}`
        );
        setWriter(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching writer details:", err);
        setWriter(null);
        setError("Failed to load writer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWriterDetails();
  }, [id]);

  if (loading) {
    return <div className="writer-details-page">Loading...</div>;
  }

  if (!writer) {
    return <div className="writer-details-page">Writer not found</div>;
  }

  return (
    <div>
      <nav>
        <a href="#" className="logo">
          <img src={logo} alt="logo" />
        </a>
        <ul className="menu">
          <li>
            <Link to="/">Homepage</Link>
          </li>
          <li>
            <a href="/#featured">Featured</a>
          </li>
          <li>
            <Link to="/allbooks">Books</Link>
          </li>
          <li>
            <a href="/#catagories">Categories</a>
          </li>
          <li>
            <a href="/#writer">Writer</a>
          </li>
        </ul>
        <a href="#" className="siteName">
          Book Cafe
        </a>
      </nav>

      <div style={{ height: 80 }} />

      <div className="writer-details-page">
        <div className="writer-header">
          <img
            className="writer-image"
            src={writer.image || writer.imageUrl || "/api/placeholder/200/200"}
            alt={writer.name}
            loading="eager"
          />
          <div className="writer-info">
            <h1>{writer.name}</h1>
            <p className="writer-description">{writer.description}</p>
            
            <div className="writer-badges">
              {writer.nationality && (
                <span className="badge nationality-badge">{writer.nationality}</span>
              )}
              {writer.genre && (
                <span className="badge genre-badge">{writer.genre}</span>
              )}
              {writer.birthDate && (
                <span className="badge date-badge">
                  Born: {new Date(writer.birthDate).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="writer-actions">
              <button className="btn-primary" onClick={() => window.history.back()}>
                Back
              </button>
            </div>
          </div>
        </div>

        {writer.biography && (
          <div className="writer-biography">
            <h3>Biography</h3>
            <p>{writer.biography}</p>
          </div>
        )}

        {writer.awards && writer.awards.length > 0 && (
          <div className="writer-awards">
            <h3>Awards & Recognition</h3>
            <ul className="awards-list">
              {writer.awards.map((award, index) => (
                <li key={index} className="award-item">
                  🏆 {award}
                </li>
              ))}
            </ul>
          </div>
        )}

        {writer.website && (
          <div className="writer-links">
            <h3>Links</h3>
            <a href={writer.website} target="_blank" rel="noopener noreferrer" className="website-link">
              Official Website
            </a>
          </div>
        )}

        {writer.socialMedia && Object.values(writer.socialMedia).some(link => link) && (
          <div className="writer-social">
            <h3>Follow {writer.name}</h3>
            <div className="social-links">
              {writer.socialMedia.twitter && (
                <a href={writer.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {writer.socialMedia.facebook && (
                <a href={writer.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
              {writer.socialMedia.instagram && (
                <a href={writer.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              {writer.socialMedia.linkedin && (
                <a href={writer.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriterDetails;
