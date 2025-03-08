import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Check if current page is homepage
    setIsHomePage(window.location.pathname === '/');

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        (isScrolled || !isHomePage) ? 'bg-white shadow-md py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="container-narrow flex items-center justify-between px-4 md:px-6">
        {/* Mobile menu button - moved to the left */}
        <button 
          className="md:hidden p-2 -ml-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 
            <X size={32} className={(isScrolled || !isHomePage) ? 'text-gray-700' : 'text-white'} /> : 
            <Menu size={32} className={(isScrolled || !isHomePage) ? 'text-gray-700' : 'text-white'} />
          }
        </button>

        {/* Logo - centered on mobile */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2.5">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className={`text-2xl font-bold ${(isScrolled || !isHomePage || isOpen) ? 'text-blue-600' : 'text-white'}`}>
              HomeMaidy
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/services" 
            className={`font-semibold text-base hover:text-blue-600 transition-colors ${
              (isScrolled || !isHomePage) ? 'text-gray-700' : 'text-white hover:text-white/80'
            }`}
          >
            Services
          </Link>
          <Link 
            to="/pro-signup" 
            className={`font-semibold text-base hover:text-blue-600 transition-colors ${
              (isScrolled || !isHomePage) ? 'text-gray-700' : 'text-white hover:text-white/80'
            }`}
          >
            Become a Pro
          </Link>
          <Link 
            to="/service-areas" 
            className={`font-semibold text-base hover:text-blue-600 transition-colors ${
              (isScrolled || !isHomePage) ? 'text-gray-700' : 'text-white hover:text-white/80'
            }`}
          >
            Service Areas
          </Link>
          <Link 
            to="/login" 
            className={`font-semibold text-base hover:text-blue-600 transition-colors ${
              (isScrolled || !isHomePage) ? 'text-gray-700' : 'text-white hover:text-white/80'
            }`}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className={`font-semibold text-base hover:text-blue-600 transition-colors ${
              (isScrolled || !isHomePage) ? 'text-gray-700' : 'text-white hover:text-white/80'
            }`}
          >
            Sign Up
          </Link>
        </div>

        {/* Empty div to maintain layout on mobile */}
        <div className="w-10 md:hidden"></div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white w-full py-6 px-4 shadow-lg absolute top-full left-0">
          <div className="flex flex-col space-y-6">
            <Link 
              to="/services" 
              className="text-gray-800 hover:text-blue-600 font-semibold text-lg py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/pro-signup" 
              className="text-gray-800 hover:text-blue-600 font-semibold text-lg py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Become a Pro
            </Link>
            <Link 
              to="/service-areas" 
              className="text-gray-800 hover:text-blue-600 font-semibold text-lg py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Service Areas
            </Link>
            <Link 
              to="/login" 
              className="text-gray-800 hover:text-blue-600 font-semibold text-lg py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-gray-800 hover:text-blue-600 font-semibold text-lg py-2"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;