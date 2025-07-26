import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "./Movies.css";

// Import animated text components
import AnimatedText from "../../components/Animations/AnimatedText";
import AnimatedText2 from "../../components/Animations/AnimatedText2";

// Import videos and arrow images
import video1 from "../../assets/FC.mp4";
import video2 from "../../assets/NFS.mp4";
import video3 from "../../assets/INC.mp4";
import video4 from "../../assets/DOJ.mp4";
import leftArrow from "../../assets/WBArrow.png";
import rightArrow from "../../assets/WFArrow.png";

const API_KEY = "e54183d24dbf9253e2d1ad0a51cee717";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const FALLBACK_IMAGE = "https://via.placeholder.com/1280x720?text=No+Image";

const genres = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Science Fiction" },
];

const Movies = () => {
  const [genreMovies, setGenreMovies] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();

  const videos = [video1, video2, video3, video4];
  const videoTitles = ["Fight Club", "Need For Speed", "Inception", "Batman v Superman: Dawn of Justice"];
  const videoDescriptions = [
    "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    "Fresh from prison, a street racer who was framed by a wealthy business associate joins a cross-country race with revenge in mind...",
    "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O....",
    "Batman is manipulated by Lex Luthor to fear Superman. The heroes clash and force the neutral Wonder Woman to reemerge."
  ];

  // Create an array of refs for each genre plus one for search results
  const scrollRefs = useRef([...genres.map(() => React.createRef()), React.createRef()]);

  const fetchMoviesByGenre = async (genreId, genreName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          with_genres: genreId,
          language: "en-US",
          sort_by: "popularity.desc",
          include_adult: false,
          include_video: false,
          page: 1,
        },
      });

      if (response.data?.results.length > 0) {
        setGenreMovies((prev) => ({ ...prev, [genreName]: response.data.results }));
      } else {
        setGenreMovies((prev) => ({ ...prev, [genreName]: [] }));
      }
    } catch (err) {
      setError(`Failed to fetch ${genreName} movies. Please try again.`);
      setGenreMovies((prev) => ({ ...prev, [genreName]: [] }));
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = async (id) => {
    const shareURL = `${window.location.origin}/movies/${id}`;
    try {
      await navigator.clipboard.writeText(shareURL);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Fetch movies based on search query
  const fetchMoviesBySearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      setHasSearchResults(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          language: "en-US",
          page: 1,
          include_adult: false,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        setSearchResults(response.data.results);
        setHasSearchResults(true);
      } else {
        setSearchResults([]);
        setHasSearchResults(false);
      }
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      setSearchResults([]);
      setHasSearchResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  // Effect to handle search parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      fetchMoviesBySearch(searchParam);
    } else {
      setSearchQuery("");
      setHasSearchResults(false);
      genres.forEach((genre) => {
        fetchMoviesByGenre(genre.id, genre.name);
      });
    }
  }, [location.search]);
  
  // Add event listener for search events from navbar
  useEffect(() => {
    const handleSearchEvent = (event) => {
      const { query } = event.detail;
      setSearchQuery(query);
      
      if (query) {
        fetchMoviesBySearch(query);
      } else {
        setHasSearchResults(false);
        genres.forEach((genre) => {
          fetchMoviesByGenre(genre.id, genre.name);
        });
      }
    };
    
    window.addEventListener('searchQueryChanged', handleSearchEvent);
    
    return () => {
      window.removeEventListener('searchQueryChanged', handleSearchEvent);
    };
  }, []);
  
  // Initial data load
  useEffect(() => {
    if (!searchQuery) {
      genres.forEach((genre) => {
        fetchMoviesByGenre(genre.id, genre.name);
      });
    }
  }, []);

  return (
    <div className="netflix-page">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Hero Banner Section */}
      <div className="hero-banner">
        <video
          key={videos[currentVideoIndex]}
          autoPlay
          muted
          loop
          playsInline
          src={videos[currentVideoIndex]}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>
            <AnimatedText text={videoTitles[currentVideoIndex]} />
          </h1>
          <p className="video-description">
            <AnimatedText2 text={videoDescriptions[currentVideoIndex]} />
          </p>
        </div>

        <button className="nav-button left" onClick={handlePreviousVideo}>
          <img src={leftArrow} alt="Previous" />
        </button>
        <button className="nav-button right" onClick={handleNextVideo}>
          <img src={rightArrow} alt="Next" />
        </button>
      </div>

      {/* Show search results if there is a search query */}
      {searchQuery && (
        <div className="genre-section">
          <h2 className="genre-title">Movie Results for "{searchQuery}"</h2>
          {hasSearchResults ? (
            <div className="movie-carousel">
              <button className="carousel-button left" onClick={() => scrollRefs.current[genres.length].current.scrollLeft -= 300}>
                <img src={leftArrow} alt="Previous" />
              </button>
              <div className="movie-scroll-container" ref={scrollRefs.current[genres.length]} style={{ overflow: 'hidden' }}>
                <div className="movies-list">
                  {searchResults.map((movie) => (
                    <div key={movie.id} className="movie-card">
                      <Link to={`/movies/${movie.id}`}>
                        <img 
                          src={movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : FALLBACK_IMAGE} 
                          alt={movie.title}
                          loading="lazy"
                        />
                        <p className="movie-title">
                          <AnimatedText2 text={`${movie.title} (${movie.release_date ? movie.release_date.split("-")[0] : "Unknown"})`} />
                        </p>
                      </Link>
                      <button
                        className="share-button"
                        onClick={() => handleShare(movie.id)}
                        title="Copy shareable link"
                      >
                        🔗
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button className="carousel-button right" onClick={() => scrollRefs.current[genres.length].current.scrollLeft += 300}>
                <img src={rightArrow} alt="Next" />
              </button>
            </div>
          ) : (
            <p className="no-results">No movie results found. Try checking the TV Shows page.</p>
          )}
        </div>
      )}

      {/* Show genre sections when there's no search query */}
      {!searchQuery && genres.map((genre, index) => (
        <div key={genre.id} className="genre-section">
          <h2 className="genre-title">{genre.name}</h2>
          <div className="movie-carousel">
            <button className="carousel-button left" onClick={() => scrollRefs.current[index].current.scrollLeft -= 300}>
              <img src={leftArrow} alt="Previous" />
            </button>
            <div 
              className="movie-scroll-container" 
              ref={scrollRefs.current[index]} 
              style={{ overflow: 'hidden' }}
            >
              <div className="movies-list">
                {genreMovies[genre.name]?.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <Link to={`/movies/${movie.id}`}>
                      <img
                        src={movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : FALLBACK_IMAGE}
                        alt={movie.title}
                        loading="lazy"
                      />
                      <p className="movie-title">
                        <AnimatedText2 text={`${movie.title} (${movie.release_date ? movie.release_date.split("-")[0] : "Unknown"})`} />
                      </p>
                    </Link>
                    <button
                      className="share-button"
                      onClick={() => handleShare(movie.id)}
                      title="Copy shareable link"
                    >
                      🔗
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-button right" onClick={() => scrollRefs.current[index].current.scrollLeft += 300}>
              <img src={rightArrow} alt="Next" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Movies;