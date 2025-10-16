import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSize, useTouchGestures } from '../utils/responsive.jsx';
import { getAccessibilityProps, focusElement } from '../utils/accessibility.jsx';

const Dropdown = ({
  trigger,
  children,
  position = 'bottom-left',
  className = '',
  contentClassName = '',
  disabled = false,
  closeOnClickOutside = true,
  closeOnSelect = true,
  maxHeight = '300px',
  fullWidthOnMobile = true,
  onOpen,
  onClose,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const { isMobile } = useScreenSize();

  // Handle opening/closing
  const handleToggle = () => {
    if (disabled) return;
    
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      onOpen?.();
      // Focus first focusable element when opened
      setTimeout(() => {
        const firstFocusable = contentRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          focusElement(firstFocusable);
        }
      }, 100);
    } else {
      onClose?.();
      // Return focus to trigger
      focusElement(triggerRef.current);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
    focusElement(triggerRef.current);
  };

  // Click outside to close
  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      const focusableElements = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements?.length) return;

      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          handleClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
          focusElement(focusableElements[nextIndex]);
          break;
        case 'ArrowUp':
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
          focusElement(focusableElements[prevIndex]);
          break;
        case 'Tab':
          // Allow natural tab behavior
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Touch gestures for mobile
  useTouchGestures(contentRef, {
    onSwipeUp: () => isMobile && handleClose(),
    threshold: 50
  });

  // Position classes
  const getPositionClasses = () => {
    const isMobileFullWidth = isMobile && fullWidthOnMobile;
    
    if (isMobileFullWidth) {
      return 'fixed inset-x-4 top-auto bottom-4 transform-none';
    }

    const positions = {
      'top-left': 'bottom-full left-0 mb-2',
      'top-right': 'bottom-full right-0 mb-2',
      'bottom-left': 'top-full left-0 mt-2',
      'bottom-right': 'top-full right-0 mt-2',
      'left': 'right-full top-0 mr-2',
      'right': 'left-full top-0 ml-2',
    };

    return positions[position] || positions['bottom-left'];
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: isMobile && fullWidthOnMobile ? 0.95 : 0.95,
      y: isMobile && fullWidthOnMobile ? 20 : position.includes('top') ? 10 : -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: isMobile && fullWidthOnMobile ? 20 : position.includes('top') ? 10 : -10,
      transition: {
        duration: 0.15
      }
    }
  };

  // Handle child clicks
  const handleChildClick = (event) => {
    if (closeOnSelect) {
      // Check if the clicked element should close the dropdown
      const shouldClose = event.target.closest('[data-dropdown-item]') || 
                         event.target.closest('button') ||
                         event.target.closest('a');
      
      if (shouldClose) {
        setTimeout(() => handleClose(), 100);
      }
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
      {...props}
    >
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className={`
          cursor-pointer select-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        {...getAccessibilityProps({
          role: 'button',
          ariaExpanded: isOpen,
          ariaHaspopup: true,
          tabIndex: disabled ? -1 : 0,
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }
        })}
      >
        {trigger}
      </div>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && fullWidthOnMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200
              ${getPositionClasses()}
              ${isMobile && fullWidthOnMobile ? 'z-50' : 'z-40'}
              ${contentClassName}
            `}
            style={{
              maxHeight: isMobile && fullWidthOnMobile ? '60vh' : maxHeight,
              minWidth: isMobile && fullWidthOnMobile ? 'auto' : '200px'
            }}
            onClick={handleChildClick}
            {...getAccessibilityProps({
              role: 'menu',
              ariaOrientation: 'vertical'
            })}
          >
            <div className="py-2 max-h-full overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dropdown Item Component
export const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  className = '',
  icon,
  description,
  destructive = false,
  ...props
}) => {
  const handleClick = (event) => {
    if (disabled) return;
    onClick?.(event);
  };

  return (
    <div
      data-dropdown-item
      onClick={handleClick}
      className={`
        px-4 py-2 cursor-pointer transition-colors duration-150
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : destructive
            ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
            : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }
        ${className}
      `}
      {...getAccessibilityProps({
        role: 'menuitem',
        tabIndex: disabled ? -1 : 0,
        onKeyDown: (e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            handleClick(e);
          }
        }
      })}
      {...props}
    >
      <div className="flex items-center space-x-3">
        {icon && (
          <span className="text-lg flex-shrink-0" role="img">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{children}</div>
          {description && (
            <div className="text-sm text-gray-500 truncate">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dropdown Divider Component
export const DropdownDivider = ({ className = '' }) => (
  <div className={`border-t border-gray-200 my-1 ${className}`} role="separator" />
);

// Dropdown Header Component
export const DropdownHeader = ({ children, className = '' }) => (
  <div className={`px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 ${className}`}>
    {children}
  </div>
);

export default Dropdown;