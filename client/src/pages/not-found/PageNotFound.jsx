import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import pagenotfound from '../../assets/pagenotfound.jpg';

const PageNotFound = () => {
  return (

    
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4 overflow-hidden relative"
    style={{ backgroundImage: `url(${pagenotfound})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg 
          className="absolute animate-float-slow top-1/4 left-1/4 w-32 h-32 text-purple-300" 
          fill="currentColor" 
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" />
        </svg>
        <svg 
          className="absolute animate-float top-1/2 right-1/4 w-24 h-24 text-blue-300" 
          fill="currentColor" 
          viewBox="0 0 100 100"
        >
          <polygon points="50,10 90,90 10,90" />
        </svg>
      </div>

      
      <div className="relative z-10 text-center backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12 transform transition-all duration-500 hover:scale-105">
        <div className="flex justify-center mb-6">
          <AlertTriangle 
            size={120} 
            className="animate-bounce" 
            strokeWidth={1.5} 
          />
        </div>
        
        <h1 className="text-6xl sm:text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#45423D] to-[#6C6A61] animate-pulse">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
          The page you are looking for seems to have wandered off into the digital wilderness. Let&apos;s get you back on track.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-gradient-to-r from-[#6C6A61] to-[#6C6A61] text-white rounded-full 
            hover:from-[#C5C7CA] hover:to-[#C5C7CA] transition-all duration-300 
            transform hover:-translate-y-1 hover:scale-110 shadow-lg hover:shadow-xl "
          >
            Return Home
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;