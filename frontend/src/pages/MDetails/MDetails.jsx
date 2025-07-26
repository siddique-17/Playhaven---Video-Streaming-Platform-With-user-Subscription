import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./MDetails.css";
import AnimatedText from "../../components/Animations/AnimatedText";
import leftArrow from "../../assets/WBArrow.png";

const API_KEY = "e54183d24dbf9253e2d1ad0a51cee717";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "https://via.placeholder.com/300x450?text=No+Image";
const STREAM_API_URL = "https://vidlink.pro/movie/";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: {
            api_key: API_KEY,
            language: "en-US",
            append_to_response: "credits,videos"
          },
        });

        setMovieDetails(response.data);
        
        // Fetch related movies based on first genre
        if (response.data.genres && response.data.genres.length > 0) {
          const genreId = response.data.genres[0].id;
          fetchRelatedMovies(genreId);
        }
      } catch (err) {
        setError(err.message || "Movie details not found");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    // Reset streaming state when movie changes
    setIsStreaming(false);
  }, [id]);

  const fetchRelatedMovies = async (genreId) => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          language: "en-US",
          with_genres: genreId,
          page: 1,
          sort_by: "popularity.desc",
          include_adult: false
        },
      });

      if (response.data.results) {
        const filtered = response.data.results
          .filter((movie) => movie.id !== parseInt(id))
          .slice(0, 5);
        setRelatedMovies(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch related movies:", err);
    }
  };

  // Handle streaming button click
  const handleStreamMovie = () => {
    setIsStreaming(true);
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  // Get director names from credits
  const getDirectors = (credits) => {
    if (!credits || !credits.crew) return "N/A";
    const directors = credits.crew.filter(crew => crew.job === "Director");
    return directors.map(director => director.name).join(", ") || "N/A";
  };

  // Get writer names from credits
  const getWriters = (credits) => {
    if (!credits || !credits.crew) return "N/A";
    const writers = credits.crew.filter(crew => 
      crew.job === "Screenplay" || crew.job === "Writer" || crew.job === "Story"
    );
    return writers.map(writer => writer.name).join(", ") || "N/A";
  };

  // Get main cast names
  const getCast = (credits) => {
    if (!credits || !credits.cast) return "N/A";
    return credits.cast.slice(0, 5).map(actor => actor.name).join(", ") || "N/A";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="error-container">
        <div className="error-message">{error || "Movie details not available"}</div>
        <Link to="/movies" className="back-button">
          <img src={leftArrow} alt="Back" /> Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      {isStreaming ? (
        <div className="stream-container">
          <div className="stream-header">
            <button className="back-button" onClick={() => setIsStreaming(false)}>
              <img src={leftArrow} alt="Back" /> Back to Details
            </button>
            <h2>Now Playing: {movieDetails.title}</h2>
          </div>
          <div className="video-container">
            <iframe
              src={`${STREAM_API_URL}${id}`}
              title={`Stream ${movieDetails.title}`}
              allowFullScreen
              frameBorder="0"
              className="movie-stream"
            ></iframe>
          </div>
        </div>
      ) : (
        <>
          <div 
            className="hero-backdrop" 
            style={{ 
              backgroundImage: `url(${movieDetails.backdrop_path ? 
                IMAGE_BASE_URL + movieDetails.backdrop_path : 
                (movieDetails.poster_path ? POSTER_BASE_URL + movieDetails.poster_path : FALLBACK_IMAGE)})` 
            }}
          >
            <div className="backdrop-overlay"></div>
          </div>

          <div className="details-content">
            <Link to="/movies" className="back-button">
              <img src={leftArrow} alt="Back" /> 
            </Link>

            <div className="movie-header">
              <div className="poster-container">
                <img 
                  src={movieDetails.poster_path ? POSTER_BASE_URL + movieDetails.poster_path : FALLBACK_IMAGE} 
                  alt={movieDetails.title}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                  className="movie-poster" 
                />
              </div>

              <div className="movie-info">
                <h1><AnimatedText text={movieDetails.title} /></h1>
                
                <div className="meta-info">
                  <span className="imdb-rating">TMDB {movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : "N/A"}</span>
                  <span className="runtime">{formatRuntime(movieDetails.runtime)}</span>
                  <span className="year">{movieDetails.release_date ? movieDetails.release_date.split("-")[0] : "N/A"}</span>
                  {movieDetails.adult !== undefined && <span className="rated">{movieDetails.adult ? "Adult" : "PG"}</span>}
                  <span className="prime-badge">PlayHaven</span>
                </div>

                <div className="genres">
                  {movieDetails.genres && movieDetails.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>

                <p className="plot">{movieDetails.overview}</p>

                <div className="cast-info">
                  <p><span className="info-label">Director:</span> {getDirectors(movieDetails.credits)}</p>
                  <p><span className="info-label">Cast:</span> {getCast(movieDetails.credits)}</p>
                  <p><span className="info-label">Writers:</span> {getWriters(movieDetails.credits)}</p>
                </div>

                <div className="actions">
                  <button className="action-button primary" onClick={handleStreamMovie}>Watch with Haven</button>
                  {/* <button className="action-button secondary">
                    Rent UHD ₹{movieDetails.revenue ? '199' : '99'}
                  </button>
                  <button className="action-button tertiary">
                    More purchase options
                  </button> */}
                </div>

                <div className="rental-info">
                  <span className="prime-icon">🏆</span>
                  <span>Watch with your Haven membership</span>
                </div>
                <div className="rental-terms">
                  Rentals include 30 days to start watching this video and 48 hours to finish once started.
                </div>
              </div>
            </div>

            <div className="tabs">
              <button className="tab-button active">Related</button>
            </div>

            <div className="related-movies">
              <h2>Related Movies</h2>
              <div className="related-movies-container">
                {relatedMovies.length > 0 ? (
                  relatedMovies.map((movie) => (
                    <Link to={`/movies/${movie.id}`} key={movie.id} className="related-movie-card">
                      <img 
                        src={movie.poster_path ? POSTER_BASE_URL + movie.poster_path : FALLBACK_IMAGE} 
                        alt={movie.title}
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                      <p className="related-movie-title">{movie.title} ({movie.release_date ? movie.release_date.split("-")[0] : "Unknown"})</p>
                    </Link>
                  ))
                ) : (
                  <div className="no-related">No related movies found</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;