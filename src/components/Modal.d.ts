import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xl' | 'fullscreen';
  variant?: 'default' | 'alert' | 'success' | 'warning' | 'info';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  initialFocus?: React.RefObject<HTMLElement>;
  finalFocus?: React.RefObject<HTMLElement>;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

interface ModalComponent extends React.FC<ModalProps> {
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' | 'between' }>;
  Confirm: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'warning' | 'alert';
    loading?: boolean;
  }>;
  Alert: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    buttonText?: string;
    variant?: 'info' | 'alert' | 'success' | 'warning';
  }>;
}

declare const Modal: ModalComponent;
export default Modal;
