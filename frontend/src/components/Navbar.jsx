import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import logo from "../assets/Icon.png";
import search_icon from "../assets/search_icon.svg";
import bell_icon from "../assets/bell_icon.svg";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  
  // Function to handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Get the current search params
    const searchParams = new URLSearchParams(window.location.search);
    
    // Update the search param
    if (searchQuery.trim()) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    
    // Construct the new URL with the updated search params
    // Keep the user on the same page (movies or tvshows)
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    
    // Navigate to the new URL without a full page reload
    window.history.pushState({}, '', newUrl);
    
    // Dispatch a custom event that Movies and TVShows components can listen for
    const searchEvent = new CustomEvent('searchQueryChanged', {
      detail: { query: searchQuery }
    });
    window.dispatchEvent(searchEvent);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-transparent">
      <div className="container mx-auto px-5 py-2.5 flex items-center justify-between font-['Montserrat']">
        {/* Left Section: Logo & Navigation Links */}
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center hover:opacity-80 transition-all">
            <img src={logo} alt="Logo" className="w-20 h-auto rounded-lg -ml-5" />
          </Link>
          <nav className="hidden md:flex gap-5 text-white font-bold text-lg">
            <Link 
              to="/MainHomePage" 
              className="group relative px-2.5 py-1.5 hover:text-white transition-colors"
            >
              <span className="relative">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-2000 group-hover:w-full mt-6"></span>
              </span>
            </Link>
            <Link 
              to="/TVShows" 
              className="group relative px-2.5 py-1.5 hover:text-white transition-colors"
            >
              <span className="relative">
                TV Shows
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link 
              to="/movies" 
              className="group relative px-2.5 py-1.5 hover:text-white transition-colors"
            >
              <span className="relative">
                Movies
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link 
              to="/subscriptions" 
              className="group relative px-2.5 py-1.5 hover:text-white transition-colors"
            >
              <span className="relative">
                Subscriptions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Search, Notifications, Profile, Auth Actions */}
        <div className="flex items-center gap-5">
          {/* Only show search form on Movies or TVShows pages */}
          {(location.pathname === '/movies' || location.pathname === '/TVShows') && (
            <form onSubmit={handleSearch} className="hidden sm:flex items-center mr-12">
              <img src={search_icon} alt="Search" className="w-5 h-5 mr-2" />
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="bg-transparent text-white focus:outline-none placeholder:lowercase placeholder:opacity-80 w-40 placeholder:text-white text-lg font-['Montserrat'] placeholder:font-['Montserrat']"
              />
            </form>
          )}

          {/* Icons */}
          <img src={bell_icon} alt="Notifications" className="w-6 h-6" />

          {/* Authenticated User Actions */}
          {authUser ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-1 text-white">
                <User className="size-6" />
                <span className="hidden sm:inline font-bold">Profile</span>
              </Link>

              <Link to="/settings" className="flex items-center gap-1 text-white">
                <Settings className="size-6" />
                <span className="hidden sm:inline font-bold">Settings</span>
              </Link>

              <button 
                className="flex items-center gap-1 text-white" 
                onClick={logout}
              >
                <LogOut className="size-6" />
                <span className="hidden sm:inline font-bold">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm bg-primary text-white px-4 py-2 rounded-md font-bold">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;