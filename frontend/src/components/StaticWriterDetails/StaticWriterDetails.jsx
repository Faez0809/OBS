// src/components/StaticWriterDetails/StaticWriterDetails.jsx

import { useParams, Link, useNavigate } from "react-router-dom";
import "./StaticWriterDetails.css";
import logo from "../random/DisplayPhoto.jpg";
import Arif from "../random/arif azad.jpg";
import shamsul from "../random/shamsul arefin.jpg";
import FaezImg from "../random/me.jpg";

const StaticWriterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Static writer data
  const staticWriters = {
    'arif-azad': {
      name: 'Arif Azad',
      description: 'A renowned Bangladeshi author known for his compelling storytelling and deep cultural insights.',
      image: Arif,
      nationality: 'Bangladeshi',
      genre: 'Fiction & Literature',
      birthDate: '1960-01-15',
      biography: 'Arif Azad is one of Bangladesh\'s most celebrated contemporary authors. Born in Dhaka, he has written over 20 novels and numerous short stories that explore themes of social justice, cultural identity, and human relationships. His works have been translated into multiple languages and have won several prestigious literary awards.',
      awards: [
        'Bangla Academy Literary Award (2015)',
        'Ekushey Padak (2018)',
        'Prothom Alo Book of the Year (2019)',
        'Ananda Puraskar (2020)'
      ],
      website: 'https://arifazad.com',
      socialMedia: {
        facebook: 'https://facebook.com/arifazad.author',
        twitter: 'https://twitter.com/arifazad_writer'
      }
    },
    'shamsul-arefin': {
      name: 'Shamsul Arefin',
      description: 'A distinguished writer and intellectual whose works have shaped modern Bangladeshi literature.',
      image: shamsul,
      nationality: 'Bangladeshi',
      genre: 'Academic & Non-fiction',
      birthDate: '1955-03-22',
      biography: 'Shamsul Arefin is a prominent Bangladeshi writer, researcher, and academic. He has made significant contributions to both fiction and non-fiction literature, with a particular focus on historical narratives and social commentary. His scholarly approach to storytelling has earned him recognition both nationally and internationally.',
      awards: [
        'Bangla Academy Award (2012)',
        'National Book Award (2016)',
        'Ekushey Padak (2021)',
        'International Literary Recognition (2019)'
      ],
      website: 'https://shamsularefin.com',
      socialMedia: {
        facebook: 'https://facebook.com/shamsul.arefin',
        linkedin: 'https://linkedin.com/in/shamsul-arefin'
      }
    },
    'faez-mahmud': {
      name: 'Faez Mahmud',
      description: 'An emerging voice in contemporary literature, known for innovative storytelling and fresh perspectives.',
      image: FaezImg,
      nationality: 'Bangladeshi',
      genre: 'Contemporary Fiction',
      birthDate: '1990-07-10',
      biography: 'Faez Mahmud is a rising star in Bangladeshi literature, known for his modern approach to storytelling and exploration of contemporary themes. His works often deal with urban life, technology, and the challenges faced by the younger generation. Despite being relatively new to the literary scene, his unique voice has already garnered significant attention.',
      awards: [
        'Young Writer\'s Award (2022)',
        'Best Debut Novel (2021)',
        'Contemporary Literature Prize (2023)'
      ],
      website: 'https://faezmahmud.com',
      socialMedia: {
        instagram: 'https://instagram.com/faez.mahmud',
        twitter: 'https://twitter.com/faez_writer',
        facebook: 'https://facebook.com/faez.mahmud.author'
      }
    }
  };

  const writer = staticWriters[id];

  if (!writer) {
    return <div className="static-writer-details-page">Writer not found</div>;
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

      <div className="static-writer-details-page">
        <div className="writer-header">
          <img
            className="writer-image"
            src={writer.image}
            alt={writer.name}
            loading="eager"
          />
          <div className="writer-info">
            <h1>{writer.name}</h1>
            <p className="writer-description">{writer.description}</p>
            
            <div className="writer-badges">
              <span className="badge nationality-badge">{writer.nationality}</span>
              <span className="badge genre-badge">{writer.genre}</span>
              <span className="badge date-badge">
                Born: {new Date(writer.birthDate).toLocaleDateString()}
              </span>
            </div>

            <div className="writer-actions">
              <button className="btn-primary" onClick={() => window.history.back()}>
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="writer-biography">
          <h3>Biography</h3>
          <p>{writer.biography}</p>
        </div>

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
              {writer.socialMedia.facebook && (
                <a href={writer.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
              {writer.socialMedia.twitter && (
                <a href={writer.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
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

export default StaticWriterDetails;
