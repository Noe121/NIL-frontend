import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { useScreenSize, useTouchGestures, MobileDrawer } from '../utils/responsive.jsx';
import SearchComponent from './SearchComponent.jsx';
import Button from './Button.jsx';

const NavigationBar = () => {
  const { isAuthenticated, role, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useScreenSize();
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Touch gestures for mobile menu
  useTouchGestures(mobileMenuRef, {
    onSwipeLeft: () => setIsMobileMenuOpen(false),
    threshold: 50
  });

  // Navigation items based on role
  const getNavigationItems = () => {
    if (!isAuthenticated) return [];

    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/marketplace', label: 'Marketplace', icon: '🏪' },
      { path: '/community', label: 'Community', icon: '💬' },
      { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
      { path: '/profile', label: 'Profile', icon: '👤' },
      { path: '/help', label: 'Help Center', icon: '🆘' }
    ];

    const roleSpecificItems = {
      athlete: [
        { path: '/sponsorships', label: 'My Sponsorships', icon: '🤝' },
        { path: '/schedule', label: 'Schedule', icon: '📅' },
        { path: '/analytics', label: 'Analytics', icon: '📈' }
      ],
      sponsor: [
        { path: '/athlete-search', label: 'Find Athletes', icon: '🔍' },
        { path: '/sponsorship-management', label: 'Manage Deals', icon: '📋' },
        { path: '/reports', label: 'Reports', icon: '📊' }
      ],
      fan: [
        { path: '/athlete-profiles', label: 'Athletes', icon: '⭐' },
        { path: '/store', label: 'Store', icon: '🛍️' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' }
      ]
    };

    return [...commonItems, ...(roleSpecificItems[role] || [])];
  };

  const navigationItems = getNavigationItems();

  // Navigation Item Component
  const NavItem = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <motion.div
        whileHover={{ scale: isMobile ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={item.path}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
            ${isMobile ? 'w-full justify-start min-h-[48px]' : ''}
            ${isActive
              ? 'bg-blue-100 text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }
          `}
          onClick={() => isMobile && closeMobileMenu()}
        >
          <span className="text-lg" role="img" aria-label={item.label}>
            {item.icon}
          </span>
          <span className="font-medium">{item.label}</span>
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-2 py-1 rounded z-50">
        Skip to main content
      </a>
      <nav data-testid="navigation-bar" aria-label="Main navigation" className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">NILbx</span>
              <span className="text-lg" role="img" aria-label="Trophy">🏆</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div data-testid="desktop-navigation" className="hidden lg:flex items-center space-x-6">
            {navigationItems.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavItem item={item} />
              </motion.div>
            ))}
          </div>

          {/* Right side - Search, User Menu, Mobile Button */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            {!isMobile && isAuthenticated && (
              <div className="hidden lg:block w-80">
                <SearchComponent 
                  placeholder="Search NIL deals, athletes..."
                  showFilters={false}
                />
              </div>
            )}

            {/* Desktop User Menu */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                  <span className="text-sm text-gray-600">
                    {role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'User'}
                  </span>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="medium"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                  icon="🚪"
                  aria-label="Desktop logout button"
                >
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        position="left"
        className="w-80 max-w-[80vw]"
      >
        <div ref={mobileMenuRef} className="p-6 h-full overflow-y-auto">
          {/* User Profile Section */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 pb-6 border-b border-gray-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                  <p className="text-sm text-gray-600">
                    {role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'User'}
                  </p>
                </div>
              </div>
              
              {/* Search Component for Mobile */}
              <div className="mb-4">
                <SearchComponent 
                  placeholder="Search NIL deals, athletes..."
                  showFilters={false}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}

          {/* Navigation Items */}
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    min-h-[48px] touch-manipulation
                    ${location.pathname === item.path
                      ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                    }
                  `}
                >
                  <span className="text-xl" role="img" aria-label={item.label}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Logout Button */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navigationItems.length * 0.05 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <Button
                variant="outline"
                size="large"
                fullWidth
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                icon="🚪"
                className="text-red-600 border-red-300 hover:bg-red-50 min-h-[48px]"
                aria-label="Mobile logout button"
              >
                Logout
              </Button>
            </motion.div>
          )}
        </div>
      </MobileDrawer>
    </nav>
    </>
  );
};

export default NavigationBar;