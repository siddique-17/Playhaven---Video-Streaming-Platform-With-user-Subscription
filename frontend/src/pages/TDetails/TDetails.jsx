import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./TDetails.css";
import AnimatedText from "../../components/Animations/AnimatedText";
import AnimatedText2 from "../../components/Animations/AnimatedText2";
import leftArrow from "../../assets/WBArrow.png";

const API_KEY = "e54183d24dbf9253e2d1ad0a51cee717";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "https://via.placeholder.com/300x450?text=No+Image";
const STREAM_API_URL = "https://vidlink.pro";

const TVShowDetails = () => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedShows, setRelatedShows] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isAnime, setIsAnime] = useState(false);
  const [malId, setMalId] = useState(null);
  const [subOrDub, setSubOrDub] = useState("sub"); // Default to subbed version

  useEffect(() => {
    const fetchShowDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/tv/${id}`, {
          params: {
            api_key: API_KEY,
            language: "en-US",
            append_to_response: "credits,videos,keywords"
          },
        });

        setShowDetails(response.data);
        
        // Check if the show is anime by looking at keywords or genres
        const isAnimeShow = checkIfAnime(response.data);
        setIsAnime(isAnimeShow);
        
        if (isAnimeShow) {
          // Try to fetch MAL ID for anime (this is a simplified approach)
          try {
            // Set TMDB ID as MalID for testing purposes
            // In a real implementation, you would use a proper API or mapping
            setMalId(id); 
          } catch (err) {
            console.error("Failed to fetch MAL ID:", err);
          }
        }
        
        // Fetch related shows based on first genre
        if (response.data.genres && response.data.genres.length > 0) {
          const genreId = response.data.genres[0].id;
          fetchRelatedShows(genreId);
        }
      } catch (err) {
        setError(err.message || "Show details not found");
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
    // Reset streaming state and selected season/episode when show changes
    setIsStreaming(false);
    setSelectedSeason(1);
    setSelectedEpisode(1);
  }, [id]);

  // Function to check if a show is anime based on keywords or genres
  const checkIfAnime = (show) => {
    // Check keywords
    if (show.keywords && show.keywords.results) {
      const animeKeywords = ["anime", "japanese animation", "manga"];
      for (const keyword of show.keywords.results) {
        if (animeKeywords.includes(keyword.name.toLowerCase())) {
          return true;
        }
      }
    }
    
    // Check genres
    if (show.genres) {
      // Animation genre ID is 16
      const hasAnimation = show.genres.some(genre => genre.id === 16);
      
      // Check if it's animation and has Japanese origin
      if (hasAnimation && show.origin_country && show.origin_country.includes("JP")) {
        return true;
      }
    }
    
    // Additional check: if the show name contains "anime" or common anime terms
    if (show.name) {
      const animeTitles = ["anime", "naruto", "one piece", "dragon ball", "doraemon", "pokemon"];
      const lowerCaseName = show.name.toLowerCase();
      if (animeTitles.some(term => lowerCaseName.includes(term))) {
        return true;
      }
    }
    
    return false;
  };

  const fetchRelatedShows = async (genreId) => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/tv`, {
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
          .filter((show) => show.id !== parseInt(id))
          .slice(0, 5);
        setRelatedShows(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch related shows:", err);
    }
  };

  // Handle streaming button click
  const handleStreamShow = () => {
    setIsStreaming(true);
  };

  // Get streaming URL based on show type
  const getStreamUrl = () => {
    if (isAnime) {
      // Use the anime streaming URL format
      return `${STREAM_API_URL}/anime/${malId || id}/${selectedEpisode}/${subOrDub}`;
    } else {
      // Use the regular TV show streaming URL format
      return `${STREAM_API_URL}/tv/${id}/${selectedSeason}/${selectedEpisode}`;
    }
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes || minutes.length === 0) return "N/A";
    const avgRuntime = Array.isArray(minutes) ? minutes[0] : minutes;
    const hrs = Math.floor(avgRuntime / 60);
    const mins = avgRuntime % 60;
    return `${hrs}h ${mins}m`;
  };

  // Extract year from date
  const extractYear = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("-")[0];
  };

  // Get creator names from credits
  const getCreators = () => {
    if (!showDetails || !showDetails.created_by || showDetails.created_by.length === 0) return "N/A";
    return showDetails.created_by.map(creator => creator.name).join(", ");
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
      crew.job === "Writer" || crew.job === "Screenplay" || crew.job === "Story"
    );
    return writers.map(writer => writer.name).join(", ") || "N/A";
  };

  // Get main cast names
  const getCast = (credits) => {
    if (!credits || !credits.cast) return "N/A";
    return credits.cast.slice(0, 5).map(actor => actor.name).join(", ") || "N/A";
  };

  // Get episode count for a specific season
  const getEpisodeCount = (seasonNumber) => {
    if (!showDetails.seasons || seasonNumber > showDetails.seasons.length) return 10;
    const season = showDetails.seasons.find(s => s.season_number === seasonNumber);
    return season?.episode_count || 10;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !showDetails) {
    return (
      <div className="error-container">
        <div className="error-message">{error || "Show details not available"}</div>
        <Link to="/tvshows" className="back-button">
          <img src={leftArrow} alt="Back" /> Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="tvshow-details-page">
      {isStreaming ? (
        <div className="stream-container">
          <div className="stream-header">
            <button className="back-button" onClick={() => setIsStreaming(false)}>
              <img src={leftArrow} alt="Back" /> Back to Details
            </button>
            <h2>Now Playing: {showDetails.name} {isAnime ? 
                `Episode ${selectedEpisode}` : 
                `Season ${selectedSeason} Episode ${selectedEpisode}`}
            </h2>
            
            <div className="stream-controls">
  {!isAnime && (
    <div className="season-selector">
      <label>Season:</label>
      <select 
        value={selectedSeason}
        onChange={(e) => {
          const newSeason = Number(e.target.value);
          setSelectedSeason(newSeason);
          setSelectedEpisode(1); // Reset episode to 1 when season changes
        }}
      >
        {showDetails.seasons && showDetails.seasons
          .filter(season => season.season_number > 0) // Filter out season 0 (specials)
          .map(season => (
            <option key={season.season_number} value={season.season_number}>
              {season.name}
            </option>
          ))}
      </select>
    </div>
  )}
  
  <div className="episode-selector">
    <label>Episode:</label>
    <select 
      value={selectedEpisode}
      onChange={(e) => setSelectedEpisode(Number(e.target.value))}
    >
      {Array.from({ length: isAnime ? 
        (showDetails.number_of_episodes || 24) : // Use number_of_episodes for anime or default to 24
        getEpisodeCount(selectedSeason) // Get correct episode count for the selected season
      }, (_, i) => (
        <option key={i+1} value={i+1}>Episode {i+1}</option>
      ))}
    </select>
  </div>
  
  {isAnime && (
    <div className="language-selector">
      <label>Language:</label>
      <select 
        value={subOrDub}
        onChange={(e) => setSubOrDub(e.target.value)}
      >
        <option value="sub">Subbed</option>
        <option value="dub">Dubbed</option>
      </select>
    </div>
  )}
</div>
          </div>
          <div className="video-container">
            <iframe
              src={getStreamUrl()}
              title={`Stream ${showDetails.name}`}
              allowFullScreen
              frameBorder="0"
              className="show-stream"
            ></iframe>
          </div>
        </div>
      ) : (
        <>
          <div 
            className="hero-backdrop" 
            style={{ 
              backgroundImage: `url(${showDetails.backdrop_path ? 
                IMAGE_BASE_URL + showDetails.backdrop_path : 
                (showDetails.poster_path ? POSTER_BASE_URL + showDetails.poster_path : FALLBACK_IMAGE)})` 
            }}
          >
            <div className="backdrop-overlay"></div>
          </div>

          <div className="details-content">
            <Link to="/tvshows" className="back-button">
              <img src={leftArrow} alt="Back" /> 
            </Link>

            <div className="show-header">
              <div className="poster-container">
                <img 
                  src={showDetails.poster_path ? POSTER_BASE_URL + showDetails.poster_path : FALLBACK_IMAGE} 
                  alt={showDetails.name}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                  className="show-poster" 
                />
              </div>

              <div className="show-info">
                <h1><AnimatedText text={showDetails.name} /></h1>
                
                <div className="meta-info">
                  <span className="imdb-rating">TMDB {showDetails.vote_average ? showDetails.vote_average.toFixed(1) : "N/A"}</span>
                  <span className="runtime">{formatRuntime(showDetails.episode_run_time)}</span>
                  <span className="year">{extractYear(showDetails.first_air_date)} - {showDetails.status === "Ended" ? extractYear(showDetails.last_air_date) : "Present"}</span>
                  <span className="seasons">{showDetails.number_of_seasons} Seasons</span>
                  <span className="prime-badge">PlayHaven</span>
                </div>

                <div className="genres">
                  {showDetails.genres && showDetails.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>

                <p className="plot">{showDetails.overview}</p>

                <div className="cast-info">
                  <p><span className="info-label">Creator:</span> {getCreators()}</p>
                  <p><span className="info-label">Director:</span> {getDirectors(showDetails.credits)}</p>
                  <p><span className="info-label">Cast:</span> {getCast(showDetails.credits)}</p>
                  <p><span className="info-label">Writers:</span> {getWriters(showDetails.credits)}</p>
                </div>

                <div className="actions">
                  <button className="action-button primary" onClick={handleStreamShow}>Watch with Haven</button>
                  {/* <button className="action-button secondary">
                    Rent UHD ₹{showDetails.popularity > 100 ? '199' : '99'}
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

            <div className="related-shows">
              <h2>Related Shows</h2>
              <div className="related-shows-container">
                {relatedShows.length > 0 ? (
                  relatedShows.map((show) => (
                    <Link to={`/tvshows/${show.id}`} key={show.id} className="related-show-card">
                      <img 
                        src={show.poster_path ? POSTER_BASE_URL + show.poster_path : FALLBACK_IMAGE} 
                        alt={show.name}
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                      <p className="related-show-title">
                        <AnimatedText2 text={`${show.name} (${extractYear(show.first_air_date)})`} />
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="no-related">No related shows found</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TVShowDetails;