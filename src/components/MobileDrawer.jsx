import React, { useRef, useEffect, useCallback } from 'react';
import { useFocusTrap } from '../utils/accessibility';

export const MobileDrawer = ({
  isOpen,
  onClose,
  position = 'left',
  children,
  className = '',
}) => {
  const drawerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useFocusTrap(drawerRef, isOpen);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 ${position}-0 w-64 bg-white shadow-xl z-50 ${className}`}
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </>
  );
};