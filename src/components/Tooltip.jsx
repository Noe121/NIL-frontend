import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSize } from '../utils/responsive.jsx';
import { getAccessibilityProps } from '../utils/accessibility.jsx';

const Tooltip = ({
  children,
  content,
  position = 'top',
  trigger = 'hover', // 'hover', 'click', 'focus'
  delay = 300,
  hideDelay = 0,
  disabled = false,
  className = '',
  contentClassName = '',
  maxWidth = '300px',
  arrow = true,
  interactive = false,
  offset = 8,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const { isMobile } = useScreenSize();

  // Position calculation
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let bestPosition = position;

    // Check if tooltip fits in preferred position
    const positions = {
      top: triggerRect.top - tooltipRect.height - offset > 0,
      bottom: triggerRect.bottom + tooltipRect.height + offset < viewport.height,
      left: triggerRect.left - tooltipRect.width - offset > 0,
      right: triggerRect.right + tooltipRect.width + offset < viewport.width
    };

    // If preferred position doesn't fit, find the best alternative
    if (!positions[position]) {
      if (position === 'top' && positions.bottom) bestPosition = 'bottom';
      else if (position === 'bottom' && positions.top) bestPosition = 'top';
      else if (position === 'left' && positions.right) bestPosition = 'right';
      else if (position === 'right' && positions.left) bestPosition = 'left';
      else {
        // Find any position that fits
        const availablePositions = Object.entries(positions)
          .filter(([_, fits]) => fits)
          .map(([pos]) => pos);
        bestPosition = availablePositions[0] || position;
      }
    }

    setActualPosition(bestPosition);
  };

  // Show tooltip
  const showTooltip = () => {
    if (disabled) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after tooltip becomes visible
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (hideDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    } else {
      setIsVisible(false);
    }
  };

  // Handle mouse events
  const handleMouseEnter = () => {
    if (trigger === 'hover') showTooltip();
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !interactive) hideTooltip();
  };

  // Handle click events
  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  // Handle focus events
  const handleFocus = () => {
    if (trigger === 'focus') showTooltip();
  };

  const handleBlur = () => {
    if (trigger === 'focus') hideTooltip();
  };

  // Handle keyboard events
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isVisible) {
      hideTooltip();
    }
  };

  // Close on click outside for click trigger
  useEffect(() => {
    if (trigger === 'click' && isVisible) {
      const handleClickOutside = (event) => {
        if (
          tooltipRef.current && 
          triggerRef.current &&
          !tooltipRef.current.contains(event.target) &&
          !triggerRef.current.contains(event.target)
        ) {
          hideTooltip();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [trigger, isVisible]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Position classes
  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50';
    
    switch (actualPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-${offset/4}`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-${offset/4}`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-${offset/4}`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-${offset/4}`;
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-${offset/4}`;
    }
  };

  // Arrow classes
  const getArrowClasses = () => {
    if (!arrow) return '';
    
    const arrowClasses = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
    
    switch (actualPosition) {
      case 'top':
        return `${arrowClasses} top-full left-1/2 -translate-x-1/2 -mt-1`;
      case 'bottom':
        return `${arrowClasses} bottom-full left-1/2 -translate-x-1/2 -mb-1`;
      case 'left':
        return `${arrowClasses} left-full top-1/2 -translate-y-1/2 -ml-1`;
      case 'right':
        return `${arrowClasses} right-full top-1/2 -translate-y-1/2 -mr-1`;
      default:
        return `${arrowClasses} top-full left-1/2 -translate-x-1/2 -mt-1`;
    }
  };

  // Animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: actualPosition === 'top' ? 10 : actualPosition === 'bottom' ? -10 : 0,
      x: actualPosition === 'left' ? 10 : actualPosition === 'right' ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      {...props}
    >
      {/* Trigger Element */}
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="inline-block"
        {...getAccessibilityProps({
          tabIndex: trigger === 'click' || trigger === 'focus' ? 0 : undefined,
          ariaDescribedby: isVisible ? 'tooltip' : undefined,
          ariaExpanded: trigger === 'click' ? isVisible : undefined
        })}
      >
        {children}
      </div>

      {/* Tooltip Content */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={getPositionClasses()}
            onMouseEnter={() => interactive && showTooltip()}
            onMouseLeave={() => interactive && hideTooltip()}
            style={{ maxWidth }}
            {...getAccessibilityProps({
              id: 'tooltip',
              role: 'tooltip'
            })}
          >
            <div 
              className={`
                px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg
                ${isMobile ? 'text-base px-4 py-3' : ''}
                ${contentClassName}
              `}
            >
              {content}
            </div>
            
            {/* Arrow */}
            {arrow && <div className={getArrowClasses()} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;