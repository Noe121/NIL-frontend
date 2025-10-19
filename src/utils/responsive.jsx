import { useState, useEffect, useRef, useLayoutEffect } from 'react';

/**
 * Screen size breakpoints
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Custom hook to get and track screen size
 * @returns {Object} Current screen size information
 */
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    breakpoint: 'desktop',
    isPortrait: false,
    isLandscape: false,
    orientation: 'landscape'
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < BREAKPOINTS.md;
      const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
      const isDesktop = width >= BREAKPOINTS.lg;
      
      let breakpoint = 'desktop';
      if (isMobile) breakpoint = 'mobile';
      else if (isTablet) breakpoint = 'tablet';
      
      const isPortrait = height > width;
      const isLandscape = width > height;
      let orientation = 'square';
      if (isPortrait) orientation = 'portrait';
      else if (isLandscape) orientation = 'landscape';

      setScreenSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        breakpoint,
        isPortrait,
        isLandscape,
        orientation
      });
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

/**
 * Helper function to check if the screen matches a breakpoint
 * @param {string} breakpoint - The breakpoint to check against
 * @returns {boolean} Whether the screen matches the breakpoint
 */
export const useBreakpoint = (breakpoint) => {
  const { width } = useScreenSize();
  return width >= BREAKPOINTS[breakpoint];
};

/**
 * Helper function to get styles based on screen size
 * @param {Object} styles - Styles object with breakpoint keys
 * @returns {Object} The appropriate styles for the current screen size
 */
export const getResponsiveStyles = (styles) => {
  const { width } = useScreenSize();
  
  const breakpointKeys = Object.keys(BREAKPOINTS)
    .sort((a, b) => BREAKPOINTS[b] - BREAKPOINTS[a]);

  for (const key of breakpointKeys) {
    if (width >= BREAKPOINTS[key] && styles[key]) {
      return styles[key];
    }
  }

  return styles.base || {};
};

/**
 * Custom hook for touch gestures
 * @param {Object} ref - React ref to the element
 * @param {Object} options - Options for gestures
 */
export const useTouchGestures = (ref, options = {}) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchMove = (e) => {
      // Prevent default to avoid scrolling during gesture
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      const diffX = startX - endX;
      const diffY = startY - endY;
      const duration = endTime - startTime;
      const threshold = options.threshold || 50;

      // Detect swipe gestures
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX > 0 && options.onSwipeLeft) {
          options.onSwipeLeft();
        } else if (diffX < 0 && options.onSwipeRight) {
          options.onSwipeRight();
        }
      } else if (Math.abs(diffY) > threshold) {
        if (diffY > 0 && options.onSwipeUp) {
          options.onSwipeUp();
        } else if (diffY < 0 && options.onSwipeDown) {
          options.onSwipeDown();
        }
      }

      // Detect tap
      if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10 && duration < 300 && options.onTap) {
        options.onTap();
      }

      // Detect long press
      if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10 && duration > (options.longPressDelay || 500) && options.onLongPress) {
        options.onLongPress();
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, options]);
};

/**
 * Mobile drawer component
 * @param {Object} props - Component props
 */
export const MobileDrawer = ({ 
  children, 
  isOpen, 
  onClose, 
  position = 'left', 
  className = '',
  backdropClassName = '' 
}) => {
  const drawerRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Handle body scroll prevention
  useLayoutEffect(() => {
    if (isOpen) {
      document.body.className += ' overflow-hidden';
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;
    } else {
      document.body.className = document.body.className.replace(' overflow-hidden', '');
      // Restore focus
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.className = document.body.className.replace(' overflow-hidden', '');
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus trapping
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const focusableElements = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    // Focus first element when drawer opens
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const positionClasses = {
    left: 'left-0 top-0 h-full w-80 transform -translate-x-full',
    right: 'right-0 top-0 h-full w-80 transform translate-x-full',
    top: 'top-0 left-0 w-full h-80 transform -translate-y-full',
    bottom: 'bottom-0 left-0 w-full h-80 transform translate-y-full'
  };

  const openClasses = {
    left: 'translate-x-0',
    right: 'translate-x-0',
    top: 'translate-y-0',
    bottom: 'translate-y-0'
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="mobile-drawer-backdrop"
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${backdropClassName}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        data-testid="mobile-drawer"
        className={`fixed z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out ${positionClasses[position]} ${isOpen ? openClasses[position] : ''} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
};