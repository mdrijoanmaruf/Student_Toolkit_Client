import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiUser, HiLogout, HiMenu, HiX } from 'react-icons/hi';
import useAuth from '../../Hook/useAuth';
import Logo from '../Logo/Logo';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, logOut, loading } = useAuth();

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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#9333ea',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        background: '#1f2937',
        color: '#f9fafb',
        customClass: {
          popup: 'dark-popup'
        }
      });

      if (result.isConfirmed) {
        await logOut();
        setShowUserMenu(false);
        Swal.fire({
          icon: 'success',
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#f9fafb',
          customClass: {
            popup: 'dark-popup'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'Failed to logout. Please try again.',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea',
        customClass: {
          popup: 'dark-popup'
        }
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 shadow-lg border-b border-gray-700/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center" onClick={() => setActiveItem('Home')}>
            <Logo size={32} textSize="xl" />
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

          {/* User Profile or Login Button */}
          <div className="flex items-center space-x-4 relative">
            {user ? (
              // User is logged in - show profile and logout
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                      <HiUser className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-gray-300 text-sm font-medium hidden sm:block">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-gray-300">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">
                          {user.displayName || user.email}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HiUser className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                      >
                        <HiLogout className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show login button
              !loading && (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Login
                </Link>
              )
            )}

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
              
              {/* Mobile User Section */}
              {user ? (
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex items-center px-4 py-2 space-x-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                        <HiUser className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                  >
                    <HiUser className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800/50 transition-colors"
                  >
                    <HiLogout className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                !loading && (
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block mx-4 text-center bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
                    >
                      Login
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
