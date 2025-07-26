const Hover = ({ text, isActive, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`relative inline-block overflow-hidden rounded border border-gray-100 bg-gray-200 px-6 py-2 text-sm font-medium ${
          isActive ? "text-violet-600" : "text-slate-800"
        } hover:text-violet-600 focus:outline-none focus:ring active:bg-indigo-600 active:text-white group`}
      >
        {/* Top Border */}
        <span className="ease absolute left-0 top-0 h-0 w-0 border-t-2 border-violet-600 transition-all duration-200 group-hover:w-full"></span>
        {/* Right Border */}
        <span className="ease absolute right-0 top-0 h-0 w-0 border-r-2 border-violet-600 transition-all duration-200 group-hover:h-full"></span>
        {/* Bottom Border */}
        <span className="ease absolute bottom-0 right-0 h-0 w-0 border-b-2 border-violet-600 transition-all duration-200 group-hover:w-full"></span>
        {/* Left Border */}
        <span className="ease absolute bottom-0 left-0 h-0 w-0 border-l-2 border-violet-600 transition-all duration-200 group-hover:h-full"></span>
  
        {text}
      </button>
    );
  };
  
  export default Hover;
  