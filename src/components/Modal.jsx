import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  useFocusManagement, 
  useAutoFocus, 
  accessibilityRoles,
  respectsReducedMotion 
} from '../utils/accessibility.jsx';
import Button from './Button.jsx';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  initialFocus,
  finalFocus,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const modalRef = React.useRef(null);
  const previousActiveElement = React.useRef(null);
  const { trapFocus } = useFocusManagement();
  const autoFocusRef = useAutoFocus(isOpen);
  const prefersReducedMotion = respectsReducedMotion();

  // Size variants
  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xl: 'max-w-4xl',
    fullscreen: 'max-w-full w-full h-full'
  };

  // Modal variants
  const variants = {
    default: 'bg-white rounded-lg shadow-xl',
    alert: 'bg-white rounded-lg shadow-xl border-l-4 border-red-500',
    success: 'bg-white rounded-lg shadow-xl border-l-4 border-green-500',
    warning: 'bg-white rounded-lg shadow-xl border-l-4 border-yellow-500',
    info: 'bg-white rounded-lg shadow-xl border-l-4 border-blue-500'
  };

  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  React.useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Set up focus trap
      let cleanup;
      if (modalRef.current) {
        cleanup = trapFocus(modalRef.current);
      }

      return () => {
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clean up focus trap
        if (cleanup) cleanup();
        
        // Restore focus to the element that opened the modal
        if (finalFocus) {
          finalFocus.focus();
        } else if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, finalFocus, trapFocus]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: prefersReducedMotion 
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.8, y: 20 },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, scale: 1, y: 0 },
    exit: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.8, y: 20 }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 overflow-y-auto ${overlayClassName}`}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal container */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            ref={modalRef}
            className={`
              relative w-full ${sizes[size]} 
              ${variants[variant]}
              ${className}
            `}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ 
              duration: prefersReducedMotion ? 0 : 0.3,
              ease: 'easeOut'
            }}
            {...accessibilityRoles.dialog}
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-label={!title ? ariaLabel : undefined}
            aria-describedby={ariaDescribedBy}
            {...props}
          >
            {/* Close button */}
            {showCloseButton && (
              <button
                ref={initialFocus ? undefined : autoFocusRef}
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
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

            {/* Modal content */}
            <div className={`p-6 ${contentClassName}`}>
              {title && (
                <div className="mb-4">
                  <h2 
                    id="modal-title"
                    className="text-lg font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                </div>
              )}
              
              <div ref={initialFocus ? autoFocusRef : undefined}>
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // Render modal in portal
  return createPortal(modalContent, document.body);
};

// Modal Header component
Modal.Header = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

// Modal Body component
Modal.Body = ({ children, className = '' }) => (
  <div className={`flex-1 ${className}`}>
    {children}
  </div>
);

// Modal Footer component
Modal.Footer = ({ children, className = '', align = 'right' }) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`mt-6 pt-4 border-t border-gray-200 flex ${alignClasses[align]} space-x-2 ${className}`}>
      {children}
    </div>
  );
};

// Confirmation Modal
Modal.Confirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
  ...props
}) => {
  const confirmRef = React.useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      size="small"
      initialFocus={confirmRef}
      {...props}
    >
      <Modal.Body>
        <p className="text-gray-700">{message}</p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          ref={confirmRef}
          variant={variant === 'alert' ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
          autoFocus
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Alert Modal
Modal.Alert = ({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  buttonText = 'OK',
  variant = 'info',
  ...props
}) => {
  const buttonRef = React.useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      size="small"
      initialFocus={buttonRef}
      showCloseButton={false}
      closeOnOverlayClick={false}
      {...props}
    >
      <Modal.Body>
        <p className="text-gray-700">{message}</p>
      </Modal.Body>
      
      <Modal.Footer align="center">
        <Button
          ref={buttonRef}
          variant="primary"
          onClick={onClose}
          autoFocus
        >
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Modal;