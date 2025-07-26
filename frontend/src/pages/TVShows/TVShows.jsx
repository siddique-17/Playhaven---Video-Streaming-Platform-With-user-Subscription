// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "./TVShows.css";
// import AnimatedText from "../../components/Animations/AnimatedText";
// import AnimatedText2 from "../../components/Animations/AnimatedText2";
// import video1 from "../../assets/BB.mp4";
// import video2 from "../../assets/CHB.mp4";
// import video3 from "../../assets/AOT.mp4";
// import video4 from "../../assets/GOT.mp4";
// import leftArrow from "../../assets/WBArrow.png";
// import rightArrow from "../../assets/WFArrow.png";

// const API_KEY = "6e593b7";
// const BASE_URL = "https://www.omdbapi.com/";
// const FALLBACK_IMAGE = "https://via.placeholder.com/300x450?text=No+Image";

// const genres = ["Action", "Comedy", "Drama", "Sci-Fi"];

// const TVShows = ({ searchTerm }) => {
//   const [genreTVShows, setGenreTVShows] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [searchResults, setSearchResults] = useState([]);

//   const videos = [video1, video2, video3, video4];
//   const videoTitles = ["Breaking Bad", "Chernobyl", "Attack On Titan", "Game Of Thrones"];
//   const videoDescriptions = [
//     "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future...",
//     "In April 1986, the city of Chernobyl in the Soviet Union suffers one of the worst nuclear disasters in the history of mankind....",
//     "Young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction...",
//     "Nine noble families fight for control over Westeros...",
//   ];

//   const scrollRefs = useRef(genres.map(() => React.createRef()));

//   const fetchTVShowsByGenre = async (genre) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(BASE_URL, {
//         params: {
//           apikey: API_KEY,
//           s: genre,
//           type: "series",
//         },
//       });

//       if (response.data.Response === "False") {
//         throw new Error(response.data.Error || `No ${genre} shows found`);
//       }

//       setGenreTVShows((prev) => ({ ...prev, [genre]: response.data.Search || [] }));
//     } catch (err) {
//       setError(err.message);
//       setGenreTVShows((prev) => ({ ...prev, [genre]: [] }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSearchResults = async (searchTerm) => {
//     if (!searchTerm.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(BASE_URL, {
//         params: {
//           apikey: API_KEY,
//           s: searchTerm,
//           type: "series",
//         },
//       });

//       if (response.data.Response === "False") {
//         throw new Error(response.data.Error || "No results found");
//       }

//       setSearchResults(response.data.Search || []);
//     } catch (err) {
//       setError(err.message);
//       setSearchResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (searchTerm) {
//       fetchSearchResults(searchTerm);
//     } else {
//       genres.forEach((genre) => {
//         fetchTVShowsByGenre(genre);
//       });
//     }
//   }, [searchTerm]);

//   const displayShows = (genre) => {
//     const shows = searchTerm ? searchResults : genreTVShows[genre] || [];
    
//     if (shows.length === 0) {
//       return <div className="no-results">No shows found</div>;
//     }
//     const handleShare = async (id) => {
//       const shareURL = `${window.location.origin}/tvshows/${id}`;
//       try {
//         await navigator.clipboard.writeText(shareURL);
//         alert("Link copied to clipboard!");
//         window.location.href = "/homepage";
//       } catch (err) {
//         console.error("Failed to copy: ", err);
//       }
//     };

//     return shows.map((show) => (
//       <div className="tvshow-card-wrapper" key={show.imdbID}>
//         <Link to={`/tvshows/${show.imdbID}`} className="tvshow-card">
//           <img 
//             src={show.Poster !== "N/A" ? show.Poster : FALLBACK_IMAGE} 
//             alt={show.Title}
//             onError={(e) => {
//               e.target.src = FALLBACK_IMAGE;
//             }}
//           />
//           <p className="tvshow-title">
//             <AnimatedText2 text={`${show.Title} (${show.Year})`} />
//           </p>
//         </Link>
//         <button
//           className="share-button"
//           onClick={() => handleShare(show.imdbID)}
//           title="Copy shareable link"
//         >
//           🔗
//         </button>
//       </div>
//     ));
    
//   };

//   return (
//     <div className="tvshows-page">
//       {loading && <div className="loading">Loading...</div>}
//       {error && <div className="error-message">{error}</div>}
      
//       <div className="hero-banner">
//         <video
//           key={videos[currentVideoIndex]}
//           autoPlay
//           muted
//           loop
//           playsInline
//           src={videos[currentVideoIndex]}
//           style={{ width: "100%", height: "100%", objectFit: "cover" }}
//         />
//         <div className="hero-content">
//           <h1><AnimatedText text={videoTitles[currentVideoIndex]} /></h1>
//           <p><AnimatedText2 text={videoDescriptions[currentVideoIndex]} /></p>
//         </div>
//         <button 
//           className="nav-button left" 
//           onClick={() => setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)}
//           aria-label="Previous video"
//         >
//           <img src={leftArrow} alt="Previous" />
//         </button>
//         <button 
//           className="nav-button right" 
//           onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)}
//           aria-label="Next video"
//         >
//           <img src={rightArrow} alt="Next" />
//         </button>
//       </div>

//       {!searchTerm && genres.map((genre, index) => (
//         <div key={genre} className="genre-section">
//           <h2 className="genre-title">{genre} TV Shows</h2>
//           <div className="tvshow-carousel">
//             <button 
//               className="carousel-button left" 
//               onClick={() => scrollRefs.current[index].current.scrollLeft -= 300}
//               aria-label={`Scroll ${genre} left`}
//             >
//               <img src={leftArrow} alt="Previous" />
//             </button>
//             <div className="tvshow-scroll-container" ref={scrollRefs.current[index]}>
//               <div className="tvshow-list">
//                 {displayShows(genre)}
//               </div>
//             </div>
//             <button 
//               className="carousel-button right" 
//               onClick={() => scrollRefs.current[index].current.scrollLeft += 300}
//               aria-label={`Scroll ${genre} right`}
//             >
//               <img src={rightArrow} alt="Next" />
//             </button>
//           </div>
//         </div>
//       ))}

//       {searchTerm && (
//         <div className="genre-section">
//           <h2 className="genre-title">Search Results</h2>
//           <div className="tvshow-scroll-container">
//             <div className="tvshow-list">
//               {displayShows()}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TVShows;


import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./TVShows.css";
import AnimatedText from "../../components/Animations/AnimatedText";
import AnimatedText2 from "../../components/Animations/AnimatedText2";
import video1 from "../../assets/BB.mp4";
import video2 from "../../assets/CHB.mp4";
import video3 from "../../assets/AOT.mp4";
import video4 from "../../assets/GOT.mp4";
import leftArrow from "../../assets/WBArrow.png";
import rightArrow from "../../assets/WFArrow.png";

// TMDB API Constants
const API_KEY = "e54183d24dbf9253e2d1ad0a51cee717";
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "https://via.placeholder.com/300x450?text=No+Image";

// Genre IDs mapping for TMDB API
const genreMapping = {
  "Action": 10759, // Action & Adventure for TV
  "Comedy": 35,
  "Drama": 18,
  "Sci-Fi": 10765 // Sci-Fi & Fantasy for TV
};

const genres = ["Action", "Comedy", "Drama", "Sci-Fi"];

const TVShows = () => {
  const [genreTVShows, setGenreTVShows] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();

  const videos = [video1, video2, video3, video4];
  const videoTitles = ["Breaking Bad", "Chernobyl", "Attack On Titan", "Game Of Thrones"];
  const videoDescriptions = [
    "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future...",
    "In April 1986, the city of Chernobyl in the Soviet Union suffers one of the worst nuclear disasters in the history of mankind....",
    "Young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction...",
    "Nine noble families fight for control over Westeros...",
  ];

  const scrollRefs = useRef(genres.map(() => React.createRef()));

  const fetchTVShowsByGenre = async (genre) => {
    setLoading(true);
    setError(null);
    try {
      const genreId = genreMapping[genre];
      
      const response = await axios.get(`${BASE_URL}/discover/tv`, {
        params: {
          api_key: API_KEY,
          language: "en-US",
          with_genres: genreId,
          sort_by: "popularity.desc",
          page: 1
        },
      });

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error(`No ${genre} shows found`);
      }

      // Format the data to match the structure expected by the existing code
      const formattedResults = response.data.results.map(show => ({
        imdbID: show.id,
        Title: show.name,
        Year: show.first_air_date ? show.first_air_date.substring(0, 4) : "N/A",
        Poster: show.poster_path ? `${POSTER_BASE_URL}${show.poster_path}` : "N/A"
      }));

      setGenreTVShows((prev) => ({ ...prev, [genre]: formattedResults || [] }));
    } catch (err) {
      setError(err.message);
      setGenreTVShows((prev) => ({ ...prev, [genre]: [] }));
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/search/tv`, {
        params: {
          api_key: API_KEY,
          language: "en-US",
          query: searchTerm,
          page: 1
        },
      });

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error("No results found");
      }

      // Format the data to match the structure expected by the existing code
      const formattedResults = response.data.results.map(show => ({
        imdbID: show.id,
        Title: show.name,
        Year: show.first_air_date ? show.first_air_date.substring(0, 4) : "N/A",
        Poster: show.poster_path ? `${POSTER_BASE_URL}${show.poster_path}` : "N/A"
      }));

      setSearchResults(formattedResults || []);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle search parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      fetchSearchResults(searchParam);
    } else {
      setSearchQuery("");
      genres.forEach((genre) => {
        fetchTVShowsByGenre(genre);
      });
    }
  }, [location.search]);
  
  // Add event listener for search events from navbar
  useEffect(() => {
    const handleSearchEvent = (event) => {
      const { query } = event.detail;
      setSearchQuery(query);
      
      if (query) {
        fetchSearchResults(query);
      } else {
        genres.forEach((genre) => {
          fetchTVShowsByGenre(genre);
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
        fetchTVShowsByGenre(genre);
      });
    }
  }, []);

  const handleShare = async (id) => {
    const shareURL = `${window.location.origin}/tvshows/${id}`;
    try {
      await navigator.clipboard.writeText(shareURL);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const displayShows = (shows) => {
    if (!shows || shows.length === 0) {
      return <div className="no-results">No shows found</div>;
    }
    
    return shows.map((show) => (
      <div className="tvshow-card-wrapper" key={show.imdbID}>
        <Link to={`/tvshows/${show.imdbID}`} className="tvshow-card">
          <img 
            src={show.Poster !== "N/A" ? show.Poster : FALLBACK_IMAGE} 
            alt={show.Title}
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />
          <p className="tvshow-title">
            <AnimatedText2 text={`${show.Title} (${show.Year})`} />
          </p>
        </Link>
        <button
          className="share-button"
          onClick={() => handleShare(show.imdbID)}
          title="Copy shareable link"
        >
          🔗
        </button>
      </div>
    ));
  };

  return (
    <div className="tvshows-page">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      
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
        <div className="hero-content">
          <h1><AnimatedText text={videoTitles[currentVideoIndex]} /></h1>
          <p><AnimatedText2 text={videoDescriptions[currentVideoIndex]} /></p>
        </div>
        <button 
          className="nav-button left" 
          onClick={() => setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)}
          aria-label="Previous video"
        >
          <img src={leftArrow} alt="Previous" />
        </button>
        <button 
          className="nav-button right" 
          onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % videos.length)}
          aria-label="Next video"
        >
          <img src={rightArrow} alt="Next" />
        </button>
      </div>

      {/* Show search results when there's a search query */}
      {searchQuery && (
        <div className="genre-section">
          <h2 className="genre-title">TV Show Results for "{searchQuery}"</h2>
          <div className="tvshow-carousel">
            <button 
              className="carousel-button left" 
              onClick={() => scrollRefs.current[0].current.scrollLeft -= 300}
              aria-label="Scroll search results left"
            >
              <img src={leftArrow} alt="Previous" />
            </button>
            <div className="tvshow-scroll-container" ref={scrollRefs.current[0]}>
              <div className="tvshow-list">
                {displayShows(searchResults)}
              </div>
            </div>
            <button 
              className="carousel-button right" 
              onClick={() => scrollRefs.current[0].current.scrollLeft += 300}
              aria-label="Scroll search results right"
            >
              <img src={rightArrow} alt="Next" />
            </button>
          </div>
        </div>
      )}

      {/* Only show genre sections when there's no search query */}
      {!searchQuery && genres.map((genre, index) => (
        <div key={genre} className="genre-section">
          <h2 className="genre-title">{genre} TV Shows</h2>
          <div className="tvshow-carousel">
            <button 
              className="carousel-button left" 
              onClick={() => scrollRefs.current[index].current.scrollLeft -= 300}
              aria-label={`Scroll ${genre} left`}
            >
              <img src={leftArrow} alt="Previous" />
            </button>
            <div className="tvshow-scroll-container" ref={scrollRefs.current[index]}>
              <div className="tvshow-list">
                {displayShows(genreTVShows[genre])}
              </div>
            </div>
            <button 
              className="carousel-button right" 
              onClick={() => scrollRefs.current[index].current.scrollLeft += 300}
              aria-label={`Scroll ${genre} right`}
            >
              <img src={rightArrow} alt="Next" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TVShows;