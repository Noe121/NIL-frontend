import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  announceToScreenReader, 
  respectsReducedMotion,
  accessibilityRoles 
} from '../utils/accessibility.jsx';
import Button from './Button.jsx';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      dismissible: true,
      ...toast
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      if (updated.length > maxToasts) {
        return updated.slice(0, maxToasts);
      }
      return updated;
    });

    // Announce to screen readers
    const announcement = `${newToast.type}: ${newToast.title || newToast.message}`;
    announceToScreenReader(announcement, newToast.type === 'error' ? 'assertive' : 'polite');

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (message, options = {}) => 
    addToast({ type: 'success', message, ...options });

  const error = (message, options = {}) => 
    addToast({ type: 'error', message, duration: 8000, ...options });

  const warning = (message, options = {}) => 
    addToast({ type: 'warning', message, ...options });

  const info = (message, options = {}) => 
    addToast({ type: 'info', message, ...options });

  const loading = (message, options = {}) => 
    addToast({ type: 'loading', message, duration: 0, dismissible: false, ...options });

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info,
    loading
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer = ({ position, toasts, removeToast }) => {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className={`fixed z-50 ${positions[position]} max-w-sm w-full`}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const { id, type, title, message, duration, dismissible, action, icon } = toast;
  const prefersReducedMotion = respectsReducedMotion();

  // Auto-dismiss timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onRemove, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onRemove]);

  // Toast type configurations
  const typeConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-400',
      textColor: 'text-green-800',
      defaultIcon: '✓'
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-400',
      textColor: 'text-red-800',
      defaultIcon: '✕'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-800',
      defaultIcon: '⚠'
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-800',
      defaultIcon: 'ℹ'
    },
    loading: {
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-400',
      textColor: 'text-gray-800',
      defaultIcon: '○'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  // Animation variants
  const variants = {
    hidden: prefersReducedMotion 
      ? { opacity: 0 }
      : { opacity: 0, x: 300, scale: 0.8 },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, x: 0, scale: 1 },
    exit: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: 300, scale: 0.8 }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: 'easeOut'
      }}
      layout={!prefersReducedMotion}
      className={`
        mb-4 w-full max-w-sm rounded-lg border p-4 shadow-lg
        ${config.bgColor} ${config.borderColor}
      `}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      {...accessibilityRoles.alert}
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {type === 'loading' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              aria-label="Loading"
            />
          ) : (
            <span className="text-lg" role="img" aria-hidden="true">
              {icon || config.defaultIcon}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h4 className={`text-sm font-medium ${config.textColor}`}>
              {title}
            </h4>
          )}
          
          {message && (
            <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
          )}

          {/* Action */}
          {action && (
            <div className="mt-2">
              <Button
                size="small"
                variant="outline"
                onClick={action.onClick}
                className="text-xs"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={onRemove}
            className={`
              ml-4 inline-flex flex-shrink-0 rounded-md p-1.5
              ${config.iconColor} hover:bg-white hover:bg-opacity-20
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
            `}
            aria-label="Dismiss notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar for timed toasts */}
      {duration > 0 && (
        <motion.div
          className="mt-3 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="h-full bg-current opacity-50"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

// Toast Hook for easier usage
export const useNotificationToast = () => {
  const toast = useToast();

  return {
    success: (message, options) => toast.success(message, options),
    error: (message, options) => toast.error(message, options),
    warning: (message, options) => toast.warning(message, options),
    info: (message, options) => toast.info(message, options),
    loading: (message, options) => toast.loading(message, options),
    dismiss: (id) => toast.removeToast(id),
    dismissAll: () => toast.removeAllToasts()
  };
};

export default Toast;