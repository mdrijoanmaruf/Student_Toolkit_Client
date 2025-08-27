import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiAcademicCap, HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // Update active item based on current route
  useEffect(() => {
    const currentItem = navItems.find(item => item.href === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [location.pathname]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 shadow-lg border-b border-gray-700/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setActiveItem('Home')}>
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-2 rounded-lg shadow-lg">
              <HiAcademicCap className="w-8 h-8 text-white" />
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Student Life Toolkit
            </div>
          </Link>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeItem === item.name
                    ? 'text-white bg-gradient-to-r from-purple-600 to-violet-600 shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
              >
                {item.name}
                {activeItem === item.name && (
                  <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Login
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2 transition-colors"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Items */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-3">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    setActiveItem(item.name);
                    closeMobileMenu();
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${activeItem === item.name
                      ? 'text-white bg-gradient-to-r from-purple-600 to-violet-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
