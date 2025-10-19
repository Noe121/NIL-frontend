import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSize } from '../utils/responsive.jsx';
import { getAccessibilityProps } from '../utils/accessibility.js';

const Tooltip = (props) => {
  const {
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
    show,
    theme = 'dark',
    ...restProps
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = `tooltip-${Math.floor(Math.random() * 10000)}`;
  const isMountedRef = useRef(false);
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

    // If on mobile, prefer bottom or top positioning
    if (isMobile) {
      const hasSpaceBelow = triggerRect.bottom + tooltipRect.height + offset < viewport.height;
      const hasSpaceAbove = triggerRect.top - tooltipRect.height - offset > 0;
      
      if (hasSpaceBelow) bestPosition = 'bottom';
      else if (hasSpaceAbove) bestPosition = 'top';
      else {
        bestPosition = 'bottom'; // Default to bottom on mobile if neither fits well
      }
    } else {
      // Desktop positioning logic
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
    }

    setActualPosition(bestPosition);
  };

  // Show tooltip
  const showTooltip = () => {
    if (disabled || !isMountedRef.current) return;

    // Clear any pending hide operations
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // For interactive tooltips or when already visible, show immediately
    if ((interactive && isVisible) || timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsVisible(true);
      Promise.resolve().then(() => {
        if (isMountedRef.current) {
          calculatePosition();
        }
      });
    } else {
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsVisible(true);
          calculatePosition();
        }
      }, delay);
    }
  };

  // Hide tooltip
  const hideTooltip = (force = false) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // For interactive tooltips, only hide when force=true (user leaves both trigger and tooltip)
    if (interactive && !force) {
      return;
    }

    const doHide = () => setIsVisible(false);

    if (hideDelay > 0 && !force) {
      hideTimeoutRef.current = setTimeout(doHide, hideDelay);
    } else {
      doHide();
    }
  };

  // Handle mouse events
  const handleMouseEnter = () => {
    if (trigger === 'hover') showTooltip();
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      if (!interactive) {
        hideTooltip(true);
      } else if (!tooltipRef.current?.contains(document.activeElement)) {
        // For interactive tooltips, give a small delay to allow moving to the tooltip
        hideTimeoutRef.current = setTimeout(() => {
          if (!tooltipRef.current?.matches(':hover')) {
            hideTooltip(true);
          }
        }, 50);
      }
    }
  };

  // Handle click events
  const handleClick = () => {
    if (trigger === 'click' || isMobile) {
      if (isVisible) {
        hideTooltip(true); // Force hide on click when already visible
      } else {
        // Clear any hide timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }

        // First set visibility
        setIsVisible(true);
        
        // Then calculate position
        Promise.resolve().then(() => {
          if (isMountedRef.current) {
            calculatePosition();
          }
        });

        // On mobile, auto-hide after delay if specified
        if (isMobile && hideDelay > 0) {
          setTimeout(() => {
            hideTooltip(true);
          }, hideDelay);
        }
      }
    }
  };  // Handle focus events
  const handleFocus = () => {
    if (trigger === 'focus' || trigger === 'click') {
      setIsVisible(true);
    }
  };

  const handleBlur = (e) => {
    // Don't hide if we're moving focus within the component or to the tooltip itself
    if (
      (trigger === 'focus' || trigger === 'click') &&
      (!e.relatedTarget || 
       (!e.currentTarget.contains(e.relatedTarget) && 
        !tooltipRef.current?.contains(e.relatedTarget)))
    ) {
      hideTooltip(true);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isVisible) {
      hideTooltip(true); // Force hide on Escape
      event.stopPropagation(); // Prevent event from bubbling
      event.preventDefault();
    }
  };

  // Close on click outside for click trigger
  useEffect(() => {
    if ((trigger === 'click' || isMobile) && isVisible) {
      const handleClickOutside = (event) => {
        if (
          tooltipRef.current && 
          triggerRef.current &&
          !tooltipRef.current.contains(event.target) &&
          !triggerRef.current.contains(event.target)
        ) {
          event.preventDefault();
          event.stopPropagation();
          hideTooltip(true); // Force hide on click outside
        }
      };

      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          hideTooltip(true);
        }
      };

      // Use capture phase to ensure we handle the event before other handlers
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('touchstart', handleClickOutside, true);
      document.addEventListener('keydown', handleEscapeKey, true);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
        document.removeEventListener('touchstart', handleClickOutside, true);
        document.removeEventListener('keydown', handleEscapeKey, true);
      };
    }
  }, [trigger, isVisible, isMobile]);

  // Handle mount state and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setIsVisible(false);
    };
  }, []);

  // Handle controlled visibility
  useEffect(() => {
    if (show !== undefined) {
      setIsVisible(show);
      if (show) {
        // Calculate position after tooltip becomes visible
        Promise.resolve().then(() => {
          if (isMountedRef.current) {
            calculatePosition();
          }
        });
      }
    }
  }, [show]);

  // Position classes
  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50';
    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2',
      left: 'right-full top-1/2 transform -translate-y-1/2',
      right: 'left-full top-1/2 transform -translate-y-1/2'
    };
    
    const spacing = Math.round(offset/4);
    const marginClass = {
      top: `mb-${spacing}`,
      bottom: `mt-${spacing}`,
      left: `mr-${spacing}`,
      right: `ml-${spacing}`
    };
    
    return `${baseClasses} ${positionClasses[actualPosition] || positionClasses.top} ${marginClass[actualPosition] || marginClass.top}`.trim();
  };

  // Arrow classes
  const getArrowClasses = () => {
    if (!arrow) return '';
    
    const arrowClasses = `absolute w-2 h-2 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transform rotate-45`;
    
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
      {...restProps}
    >
      {/* Trigger Element */}
      <div>
        {React.cloneElement(children, {
          ref: triggerRef,
          onMouseEnter: restProps.show === undefined ? handleMouseEnter : undefined,
          onMouseLeave: restProps.show === undefined ? handleMouseLeave : undefined,
          onClick: restProps.show === undefined ? handleClick : undefined,
          onFocus: restProps.show === undefined ? handleFocus : undefined,
          onBlur: restProps.show === undefined ? handleBlur : undefined,
          onKeyDown: handleKeyDown,
          'aria-expanded': isVisible,
          'aria-describedby': isVisible ? tooltipId : undefined,
          'aria-haspopup': 'true',
          ...(children.type !== 'button' && { type: 'button', role: 'button' })
        })}
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
            onMouseEnter={() => interactive && trigger === 'hover' && showTooltip()}
            onMouseLeave={() => interactive && trigger === 'hover' && hideTooltip(true)}
            style={{ maxWidth }}
            role="tooltip"
            id={tooltipId}
            aria-hidden={!isVisible}
            data-testid="tooltip-container"
          >
            <div 
              data-testid="tooltip-content"
              className={`
                ${isMobile ? 'text-base px-4 py-3' : 'text-sm px-3 py-2'} 
                ${theme === 'dark' ? 'text-white bg-gray-900' : 'text-gray-900 bg-white'}
                rounded-lg shadow-lg
                ${contentClassName}
              `.trim()}
            >
              <span data-testid="tooltip-text">{content}</span>
            </div>
            
            {/* Arrow */}
            {arrow && <div className={getArrowClasses()} role="presentation" data-testid="tooltip-arrow" />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  trigger: PropTypes.oneOf(['hover', 'click', 'focus']),
  delay: PropTypes.number,
  hideDelay: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  maxWidth: PropTypes.string,
  arrow: PropTypes.bool,
  interactive: PropTypes.bool,
  offset: PropTypes.number,
  show: PropTypes.bool,
  theme: PropTypes.oneOf(['dark', 'light']),
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;