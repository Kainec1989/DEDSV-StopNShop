import { useEffect, useState } from 'react';
import Logo from "../../assets/company-logo.png";


const LandingPage = () => {
  const [countdown, setCountdown] = useState(3);
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    // Trigger fade-in animation on component mount
    setFadeIn(true);
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      // Redirect to home page
      // In a real implementation, you would use:
       window.location.href = '/home';
      console.log('Redirecting to home page...');
    }
  }, [countdown]);
  
  return (
    <div className="h-screen w-full bg-[#181A1B] flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-px bg-gradient-to-r from-[#6C6A61] to-[#C5C7CA] animate-pulse"
            style={{
              width: `${100 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.7,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={`particle-${i}`}
            className="absolute rounded-full bg-[#C5C7CA]"
            style={{
              width: `${2 + Math.random() * 20}px`,
              height: `${2 + Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.4 + Math.random() * 0.6
            }}
          />
        ))}
      </div>
      
      {/* Content container with fade-in animation */}
      <div 
        className={`relative z-10 max-w-4xl px-8 text-center transition-opacity duration-1000 ease-in ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Logo with animated border */}
        <div className="mx-auto w-64 mb-12 relative">
          {/* Animated border container */}
          <div className="absolute -inset-4 z-0">
            {/* Moving border elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-16 h-px bg-[#C5C7CA] animate-border-top-left"></div>
              <div className="absolute top-0 right-0 w-px h-16 bg-[#C5C7CA] animate-border-top-right"></div>
              <div className="absolute bottom-0 right-0 w-16 h-px bg-[#C5C7CA] animate-border-bottom-right"></div>
              <div className="absolute bottom-0 left-0 w-px h-16 bg-[#C5C7CA] animate-border-bottom-left"></div>
            </div>
            
            {/* Corner shadows */}
            <div className="absolute top-0 left-0 w-8 h-8 shadow-lg opacity-30 animate-shadow-top-left"></div>
            <div className="absolute top-0 right-0 w-8 h-8 shadow-lg opacity-30 animate-shadow-top-right"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 shadow-lg opacity-30 animate-shadow-bottom-right"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 shadow-lg opacity-30 animate-shadow-bottom-left"></div>
          </div>
          
          {/* Image */}
          <div className="relative z-10 bg-[#181A1B] p-2 w-full h-full">
            <img 
              src={Logo} 
              alt="DEDSV Luxury Clothing" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>
        
        {/* Welcome Message with staggered reveal */}
        <h2 
          className="text-[#C5C7CA] text-xl md:text-2xl tracking-widest mb-8 font-light transition-transform duration-1000 ease-out transform"
          style={{ 
            transitionDelay: '300ms',
            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          ELEGANCE REDEFINED
        </h2>
        
        <p 
          className="text-[#6C6A61] text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed transition-transform duration-1000 ease-out transform"
          style={{ 
            transitionDelay: '600ms',
            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          Welcome to our curated collection of refined luxury. 
          Where sophistication meets contemporary elegance.
        </p>
        
        {/* Animated divider */}
        <div 
          className="h-px bg-[#45423D] mx-auto mb-12 transition-all duration-1500 ease-in-out"
          style={{ 
            width: fadeIn ? '24px' : '0px',
            transitionDelay: '900ms'
          }}
        ></div>
        
        {/* Countdown with pulse animation */}
        <div 
          className="text-[#C5C7CA] opacity-80 text-lg transition-transform duration-1000 ease-out transform"
          style={{ 
            transitionDelay: '1200ms',
            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          Redirecting in <span className="text-[#6C6A61] inline-block animate-pulse" style={{ animationDuration: '2s' }}>{countdown}</span> seconds...
        </div>
      </div>
      
      
      
      {/* CSS for custom animations */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-30px) translateX(15px);
          }
          66% {
            transform: translateY(20px) translateX(-15px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        /* Border animations */
        @keyframes border-top-left {
          0%, 100% { width: 0; opacity: 0; box-shadow: none; }
          10% { width: 0; opacity: 1; }
          50% { width: 100%; opacity: 1; box-shadow: 0 0 10px rgba(197, 199, 202, 0.6); }
          90% { width: 100%; opacity: 1; }
        }
        
        @keyframes border-top-right {
          0%, 100% { height: 0; opacity: 0; box-shadow: none; }
          10% { height: 0; opacity: 0; }
          20% { height: 0; opacity: 1; }
          60% { height: 100%; opacity: 1; box-shadow: 0 0 10px rgba(197, 199, 202, 0.6); }
          90% { height: 100%; opacity: 1; }
        }
        
        @keyframes border-bottom-right {
          0%, 100% { width: 0; opacity: 0; box-shadow: none; }
          20% { width: 0; opacity: 0; }
          30% { width: 0; opacity: 1; }
          70% { width: 100%; opacity: 1; box-shadow: 0 0 10px rgba(197, 199, 202, 0.6); }
          90% { width: 100%; opacity: 1; }
        }
        
        @keyframes border-bottom-left {
          0%, 100% { height: 0; opacity: 0; box-shadow: none; }
          30% { height: 0; opacity: 0; }
          40% { height: 0; opacity: 1; }
          80% { height: 100%; opacity: 1; box-shadow: 0 0 10px rgba(197, 199, 202, 0.6); }
          90% { height: 100%; opacity: 1; }
        }
        
        /* Shadow animations */
        @keyframes shadow-top-left {
          0%, 15%, 100% { box-shadow: none; opacity: 0; }
          25%, 40% { box-shadow: 0 0 15px rgba(197, 199, 202, 0.5); opacity: 0.7; }
        }
        
        @keyframes shadow-top-right {
          0%, 25%, 100% { box-shadow: none; opacity: 0; }
          35%, 50% { box-shadow: 0 0 15px rgba(197, 199, 202, 0.5); opacity: 0.7; }
        }
        
        @keyframes shadow-bottom-right {
          0%, 35%, 100% { box-shadow: none; opacity: 0; }
          45%, 60% { box-shadow: 0 0 15px rgba(197, 199, 202, 0.5); opacity: 0.7; }
        }
        
        @keyframes shadow-bottom-left {
          0%, 45%, 100% { box-shadow: none; opacity: 0; }
          55%, 70% { box-shadow: 0 0 15px rgba(197, 199, 202, 0.5); opacity: 0.7; }
        }
        
        .animate-border-top-left {
          animation: border-top-left 6s infinite;
        }
        
        .animate-border-top-right {
          animation: border-top-right 6s infinite;
        }
        
        .animate-border-bottom-right {
          animation: border-bottom-right 6s infinite;
        }
        
        .animate-border-bottom-left {
          animation: border-bottom-left 6s infinite;
        }
        
        .animate-shadow-top-left {
          animation: shadow-top-left 6s infinite;
        }
        
        .animate-shadow-top-right {
          animation: shadow-top-right 6s infinite;
        }
        
        .animate-shadow-bottom-right {
          animation: shadow-bottom-right 6s infinite;
        }
        
        .animate-shadow-bottom-left {
          animation: shadow-bottom-left 6s infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;