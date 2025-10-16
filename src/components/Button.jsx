import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner.jsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  tooltip,
  ...props
}) => {
  // Variant styles
  const variants = {
    primary: {
      base: 'bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500',
      disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed'
    },
    secondary: {
      base: 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
      disabled: 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
    },
    outline: {
      base: 'bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      disabled: 'bg-transparent text-gray-400 border-gray-300 cursor-not-allowed'
    },
    ghost: {
      base: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 focus:ring-gray-500',
      disabled: 'bg-transparent text-gray-400 cursor-not-allowed'
    },
    danger: {
      base: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500',
      disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed'
    },
    success: {
      base: 'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500',
      disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed'
    },
    warning: {
      base: 'bg-yellow-500 text-white border-transparent hover:bg-yellow-600 focus:ring-yellow-500',
      disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }
  };

  // Size styles
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  // Icon sizes
  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const isDisabled = disabled || loading;
  const variantStyles = variants[variant];
  const currentStyle = isDisabled ? variantStyles.disabled : variantStyles.base;

  const baseClasses = `
    inline-flex items-center justify-center
    border font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${sizes[size]}
    ${currentStyle}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const buttonVariants = {
    hover: { scale: isDisabled ? 1 : 1.02 },
    tap: { scale: isDisabled ? 1 : 0.98 }
  };

  const renderIcon = (position) => {
    if (!icon || loading) return null;
    
    const iconElement = typeof icon === 'string' ? (
      <span role="img" aria-hidden="true" className={iconSizes[size]}>
        {icon}
      </span>
    ) : (
      <span className={iconSizes[size]} aria-hidden="true">
        {icon}
      </span>
    );

    return (
      <span className={
        position === 'left' 
          ? `${children ? 'mr-2' : ''}`
          : `${children ? 'ml-2' : ''}`
      }>
        {iconElement}
      </span>
    );
  };

  const buttonContent = (
    <>
      {loading && (
        <LoadingSpinner 
          size={size === 'small' ? 'small' : 'medium'} 
          color="currentColor" 
          className={children ? 'mr-2' : ''}
        />
      )}
      {!loading && iconPosition === 'left' && renderIcon('left')}
      {children && (
        <span className={loading ? 'opacity-75' : ''}>
          {children}
        </span>
      )}
      {!loading && iconPosition === 'right' && renderIcon('right')}
    </>
  );

  const buttonElement = (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={baseClasses}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      aria-label={ariaLabel}
      title={tooltip}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );

  // Wrap with tooltip if provided
  if (tooltip && !ariaLabel) {
    return (
      <div className="relative group">
        {buttonElement}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return buttonElement;
};

// Compound components for common button groups
Button.Group = ({ children, className = '', spacing = 'normal', ...props }) => {
  const spacingClasses = {
    tight: 'space-x-1',
    normal: 'space-x-2',
    loose: 'space-x-4'
  };

  return (
    <div className={`inline-flex ${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Icon-only button variant
Button.Icon = ({ icon, ...props }) => {
  return (
    <Button
      icon={icon}
      {...props}
      className={`!p-2 ${props.className || ''}`}
    />
  );
};

// FAB (Floating Action Button)
Button.Fab = ({ 
  icon, 
  position = 'bottom-right', 
  className = '', 
  ...props 
}) => {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <Button
      icon={icon}
      size="large"
      className={`
        !rounded-full !p-4 shadow-lg hover:shadow-xl z-50
        ${positions[position]}
        ${className}
      `}
      {...props}
    />
  );
};

// Button with dropdown
Button.Dropdown = ({ 
  children, 
  dropdownItems = [], 
  dropdownOpen, 
  onDropdownToggle,
  className = '',
  ...props 
}) => {
  return (
    <div className="relative inline-block">
      <Button
        {...props}
        onClick={onDropdownToggle}
        icon={
          <svg
            className={`transform transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        }
        iconPosition="right"
        className={className}
      >
        {children}
      </Button>
      
      {dropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-full"
        >
          {dropdownItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              disabled={item.disabled}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {item.icon && (
                <span className="inline-block w-4 h-4 mr-2" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Button;