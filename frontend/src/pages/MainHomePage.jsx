import React, { useState, useEffect } from "react";
import video1 from "../assets/GOT.mp4"
import video2 from "../assets/CHB.mp4"
import video3 from "../assets/FC.mp4"
import { Link } from "react-router-dom";

import moviePoster1 from "../assets/home1.jpg";
import moviePoster2 from "../assets/home2.jpg";
import moviePoster3 from "../assets/home3.jpg";
import moviePoster4 from "../assets/home4.jpg";
import moviePoster5 from "../assets/home5.jpg";

// Add CSS styles
const styles = `
/* Main Container */
.home-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: white;
}

/* Background Video */
.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

/* Smooth fade transition between videos */
.fade-video {
  animation: fadeVideo 1.5s ease-in-out;
}

@keyframes fadeVideo {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Hero Section */
.hero {
  position: relative;
  text-align: center;
  padding-top: 8%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Hero Title */
.hero-title {
  font-size: 3rem;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  margin-bottom: 1px;
}

/* Hero Description */
.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 800px;
}

/* Call-to-Action Button */
.cta-button {
  background-color: #ffcc00;
  color: black;
  border: none;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  margin-top:-10px;
  margin-bottom:10px;
  transition: transform 0.2s ease-in-out;
}

.cta-button:hover {
  transform: scale(1.12);
}

/* Featured Sections */
.featured-section {
  padding: 40px 20px;
  text-align: center;
  margin-top: 2rem;
}

/* Featured Title */
.featured-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

/* Movie List */
.hmovie-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap; /* Ensure cards wrap on smaller screens */
}

/* Movie Card */
.hmovie-card {
  width: 180px;
  height: 260px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease-in-out;
  position: relative;
}

.hmovie-card:hover {
  transform: scale(1.05); /* Add a slight scale effect on hover */
}

/* Movie Image */
.hmovie-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Text Animations */
.fade-in {
  animation: fadeIn 1.5s ease-in-out;
}

.slide-in {
  animation: slideIn 1.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`;

const videos = [video1, video2, video3];
const moviePosters = [moviePoster1, moviePoster2, moviePoster3, moviePoster4, moviePoster5];
const youtubeLinks = [
  "https://youtu.be/Z_PODraXg4E?si=5PGvY5jj18nSY5Hw",
  "https://www.youtube.com/watch?v=HhesaQXLuRY",
  "https://youtu.be/hsoGpoDxyKg?si=p9tje7s_gO4reOYp",
  "https://youtu.be/-G9BqkgZXRA?si=1M3NGKVrDx_FT7Wy",
  "https://youtu.be/pbgvTikmIMk?si=hVwwLJjCSZOdvy-O"
];

const MainHomePage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Add styles */}
      <style>{styles}</style>
      
      <div className="home-container">
        {/* Background Video */}
        <video
          className="background-video fade-video"
          src={videos[currentVideoIndex]}
          autoPlay
          muted
          loop
        />

        {/* Hero Section */}
        <div className="hero">
          <h1 className="hero-title fade-in">
            Unlimited Entertainment, Anytime, Anywhere
          </h1>

          <p className="hero-description slide-in">
            Stream your favorite movies, TV shows, and exclusive content on PlayHaven.
          </p>

          <Link to="/movies">
            <button className="cta-button">
              Start Watching
            </button>
          </Link>
        </div>

        {/* Movie List */}
        <div className="hmovie-list">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              onClick={() => window.open(youtubeLinks[index], '_blank')}
              className="hmovie-card cursor-pointer"
            >
              <img
                src={moviePosters[index]}
                alt={`Movie ${index + 1}`}
                className="hmovie-image"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainHomePage;