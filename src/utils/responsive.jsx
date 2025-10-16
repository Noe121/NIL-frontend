// Mobile responsiveness utilities and hooks

import { useState, useEffect } from 'react';

// Breakpoint configuration (mobile-first approach)
export const breakpoints = {
  xs: 0,     // Extra small devices (phones, 0px and up)
  sm: 640,   // Small devices (landscape phones, 640px and up)
  md: 768,   // Medium devices (tablets, 768px and up)
  lg: 1024,  // Large devices (desktops, 1024px and up)
  xl: 1280,  // Extra large devices (large desktops, 1280px and up)
  '2xl': 1536 // 2x Extra large devices (larger desktops, 1536px and up)
};

// Media query hook
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e) => setMatches(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Breakpoint hooks
export const useBreakpoint = (breakpoint) => {
  const query = `(min-width: ${breakpoints[breakpoint]}px)`;
  return useMediaQuery(query);
};

export const useScreenSize = () => {
  const isXs = useBreakpoint('xs');
  const isSm = useBreakpoint('sm');
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');
  const isXl = useBreakpoint('xl');
  const is2xl = useBreakpoint('2xl');

  const getCurrentBreakpoint = () => {
    if (is2xl) return '2xl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
  };

  return {
    isXs: !isSm,
    isSm: isSm && !isMd,
    isMd: isMd && !isLg,
    isLg: isLg && !isXl,
    isXl: isXl && !is2xl,
    is2xl,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
    currentBreakpoint: getCurrentBreakpoint()
  };
};

// Touch detection
export const useTouch = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });

    return () => {
      window.removeEventListener('touchstart', checkTouch);
    };
  }, []);

  return isTouch;
};

// Device orientation hook
export const useOrientation = () => {
  const [orientation, setOrientation] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
    return 'portrait';
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
};

// Safe area insets for iOS devices
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0')
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
};

// Viewport height hook (handles mobile browser UI)
export const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 0;
  });

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return viewportHeight;
};

// Touch gesture utilities
export const useTouchGestures = (ref, options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    threshold = 50,
    longPressDelay = 500
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    let startX, startY, startTime;
    let longPressTimer;
    let lastTap = 0;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();

      // Long press detection
      if (onLongPress) {
        longPressTimer = setTimeout(() => {
          onLongPress(e);
        }, longPressDelay);
      }
    };

    const handleTouchMove = () => {
      // Cancel long press if finger moves
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const handleTouchEnd = (e) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = Date.now() - startTime;

      // Tap detection
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
        const now = Date.now();
        
        if (now - lastTap < 300 && onDoubleTap) {
          onDoubleTap(e);
          lastTap = 0;
        } else if (onTap) {
          onTap(e);
          lastTap = now;
        }
        return;
      }

      // Swipe detection
      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight(e);
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft(e);
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown(e);
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp(e);
          }
        }
      }
    };

    const element = ref.current;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [ref, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, onDoubleTap, onLongPress, threshold, longPressDelay]);
};

// Responsive classes helper
export const responsiveClasses = (classes) => {
  if (typeof classes === 'string') return classes;
  
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  return breakpointOrder
    .filter(bp => classes[bp])
    .map(bp => bp === 'xs' ? classes[bp] : `${bp}:${classes[bp]}`)
    .join(' ');
};

// Touch-friendly button component
export const TouchButton = ({ 
  children, 
  className = '', 
  size = 'medium',
  ...props 
}) => {
  const { isMobile } = useScreenSize();
  
  const sizes = {
    small: isMobile ? 'min-h-[44px] px-4 py-2' : 'px-3 py-1.5',
    medium: isMobile ? 'min-h-[48px] px-6 py-3' : 'px-4 py-2',
    large: isMobile ? 'min-h-[52px] px-8 py-4' : 'px-6 py-3'
  };

  return (
    <button
      className={`
        ${sizes[size]}
        touch-manipulation
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Responsive container component
export const ResponsiveContainer = ({ 
  children, 
  className = '',
  maxWidth = 'lg',
  padding = true
}) => {
  const maxWidths = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div className={`
      mx-auto w-full
      ${maxWidths[maxWidth]}
      ${paddingClasses}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Mobile-first grid component
export const ResponsiveGrid = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = ''
}) => {
  const gridCols = Object.entries(cols)
    .map(([bp, count]) => 
      bp === 'xs' 
        ? `grid-cols-${count}` 
        : `${bp}:grid-cols-${count}`
    )
    .join(' ');

  return (
    <div className={`
      grid gap-${gap}
      ${gridCols}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Mobile navigation drawer
export const MobileDrawer = ({
  isOpen,
  onClose,
  children,
  position = 'left',
  className = ''
}) => {
  const { isMobile } = useScreenSize();
  
  if (!isMobile) return null;

  const positions = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
  };

  const transforms = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full'
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed ${positions[position]} 
        bg-white shadow-lg z-50
        transform ${transforms[position]}
        transition-transform duration-300 ease-in-out
        ${className}
      `}>
        {children}
      </div>
    </>
  );
};

export default {
  breakpoints,
  useMediaQuery,
  useBreakpoint,
  useScreenSize,
  useTouch,
  useOrientation,
  useSafeArea,
  useViewportHeight,
  useTouchGestures,
  responsiveClasses,
  TouchButton,
  ResponsiveContainer,
  ResponsiveGrid,
  MobileDrawer
};