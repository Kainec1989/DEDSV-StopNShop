import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { selectCartItemCount, useCartStore } from "../../store/cartStore.js";
import { FaBars, FaXmark, FaUser, FaCartShopping } from "react-icons/fa6";
import Logo from "../../assets/company-logo2.png";
import { useAuthStore } from "../../store/authStore.js";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const itemCount = useCartStore(selectCartItemCount);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Detect scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out", {
      icon: "👋",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const menuItems = [
    { label: "WOMEN", path: "/category/female" },
    { label: "MEN", path: "/category/male" },
    { label: "ACCESSORIES", path: "/category/jewerely" },
    { label: "ALL PRODUCTS", path: "/products" },
  ];

  const menuAnimation = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3 },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.15 },
      },
    },
  };

  return (
    <header
      className={`fixed w-full top-0 z-20 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-md"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-900 hover:text-gray-600 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaXmark size={24} />
                </motion.div>
              ) : (
                <FaBars size={24} />
              )}
            </motion.button>
          </div>

          {/* Desktop Navigation - Left */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-gray-900 hover:text-black text-sm font-medium relative group transition-colors duration-200"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Centered Logo */}
          <div className="flex-1 flex justify-center lg:justify-center lg:flex-none">
            <Link to="/home" className="text-2xl font-bold text-gray-900 flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src={Logo}
                  alt="DEDSV"
                  className="h-40 w-40 hidden sm:block transition-all duration-300"
                />
                <span className="block sm:hidden tracking-wide">DEDSV</span>
              </motion.div>
            </Link>
          </div>

          {/* Right Side - Account, Cart and Admin */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={user ? "/account" : "/login"}
                className="text-gray-900 hover:text-black flex items-center relative overflow-hidden group transition-all duration-200"
                aria-label="Account"
              >
                <FaUser size={18} className="group-hover:text-black transition-colors duration-200" />
                <span className="ml-1 text-sm hidden md:inline group-hover:font-medium transition-all duration-200">
                  {user ? "Account" : "Login"}
                </span>
              </Link>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cart"
                className="text-gray-900 hover:text-black relative flex items-center group transition-all duration-200"
                aria-label="Shopping Cart"
              >
                <div className="relative z-10 flex items-center">
                  <FaCartShopping size={18} className="group-hover:text-black transition-colors duration-200" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-transform duration-200 group-hover:bg-gray-800"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                  <span className="ml-1 text-sm hidden md:inline group-hover:font-medium transition-all duration-200">
                    Cart
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Login/Logout Button */}
            <div className="hidden md:block">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm text-gray-900 hover:bg-gray-100 hover:shadow-sm rounded transition-all duration-200 hover:text-black"
                >
                  Logout
                </motion.button>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-3 py-1 text-sm text-gray-900 bg-gray-50 hover:bg-gray-100 hover:shadow-sm rounded transition-all duration-200 hover:text-black"
                  >
                    LOGIN
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Admin Link */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Link
                to="/admin"
                className="px-3 py-1 text-sm text-gray-900 bg-gray-50 hover:bg-gray-100 hover:shadow-sm rounded transition-all duration-200 hover:text-black"
              >
                ADMIN
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuAnimation}
              className="lg:hidden border-t border-gray-200 fixed top-16 left-0 right-0 bg-white overflow-hidden z-30"
              style={{ maxHeight: "calc(100vh - 64px)" }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-2 pt-2 pb-24 space-y-1 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 64px)" }}
              >
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile menu footer links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="pt-4 mt-4 border-t border-gray-200"
                >
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      Logout
                    </button>
                  )}

                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Navbar;