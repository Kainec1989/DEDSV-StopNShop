
import video1 from "../../assets/Background/women video.mov";
import video2 from "../../assets/Background/men video.mp4";
import womenItemsImg from "../../assets/Background/women items.jpg";
import menItemsImg from "../../assets/Background/men items.jpg";
import accessoiresImg from "../../assets/Background/DIOR.avif";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Background() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Set page as loaded after initial render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="snap-y snap-mandatory h-screen w-full overflow-scroll">
      {/* First Video Background */}
      <div className="relative h-screen w-full snap-start overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-10 transition-transform duration-700 ease-in-out scale-105"
        >
          <source src={video2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={`relative z-10 flex items-center justify-center h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center text-white p-4 transform transition-all duration-700 hover:scale-105">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg tracking-wider">
              MEN&apos;S COLLECTION
            </h1>
            <button
              onClick={() => navigate("/category/male")}
              className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border border-transparent hover:border-gray-300"
            >
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section with Images */}
      <div className="min-h-screen snap-start bg-gray-50 py-12 md:py-20 px-4 md:px-8">
        <h2 className={`text-2xl md:text-4xl font-light text-center mb-12 tracking-widest transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          SHOP BY CATEGORY
        </h2>
        
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 md:gap-10">
          {/* Women's Category */}
          <div
            className={`relative flex-grow text-center w-full lg:w-1/3 h-96 md:h-112 mb-8 lg:mb-0 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-lg shadow-lg group cursor-pointer">
              <img
                src={womenItemsImg}
                alt="Women Items"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center flex-col" onClick={() => navigate("/category/female")}>
                <h3 className="text-white text-3xl font-light mb-6 tracking-widest transform transition-all duration-500 group-hover:-translate-y-2">
                  WOMEN
                </h3>
                <button
                  onClick={() => navigate("/category/female")}
                  className="bg-white bg-opacity-90 text-black px-8 py-3 rounded-sm transform transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:bg-white"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Men's Category */}
          <div
            className={`relative flex-grow text-center w-full lg:w-1/3 h-96 md:h-112 mb-8 lg:mb-0 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-lg shadow-lg group cursor-pointer">
              <img
                src={menItemsImg}
                alt="Men Items"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center flex-col"onClick={() => navigate("/category/male")}>
                <h3 className="text-white text-3xl font-light mb-6 tracking-widest transform transition-all duration-500 group-hover:-translate-y-2">
                  MEN
                </h3>
                <button
                  onClick={() => navigate("/category/male")}
                  className="bg-white bg-opacity-90 text-black px-8 py-3 rounded-sm transform transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:bg-white"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Accessories Category */}
          <div
            className={`relative flex-grow text-center w-full lg:w-1/3 h-96 md:h-112 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-lg shadow-lg group cursor-pointer">
              <img
                src={accessoiresImg}
                alt="Accessories"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center flex-col" onClick={() => navigate("/category/jewelery")}>
                <h3 className="text-white text-3xl font-light mb-6 tracking-widest transform transition-all duration-500 group-hover:-translate-y-2">
                  ACCESSORIES
                </h3>
                <button
                  onClick={() => navigate("/category/jewelery")}
                  className="bg-white bg-opacity-90 text-black px-8 py-3 rounded-sm transform transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:bg-white"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Video Background */}
      <div className="relative h-screen w-full snap-start overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-10 transition-transform duration-700 ease-in-out scale-105"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={`relative z-10 flex items-center justify-center h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center text-white p-4 transform transition-all duration-700 hover:scale-105">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg tracking-wider">
              WOMEN&apos;S COLLECTION
            </h1>
            <button
              onClick={() => navigate("/category/female")}
              className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border border-transparent hover:border-gray-300"
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Background;