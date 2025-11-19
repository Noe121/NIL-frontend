import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

declare const LoadingSpinner: React.FC<LoadingSpinnerProps>;
export default LoadingSpinner;
