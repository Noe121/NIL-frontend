import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: string | React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
  tooltip?: string;
}

interface ButtonComponent extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> {
  Group: React.FC<{
    children: React.ReactNode;
    className?: string;
    spacing?: 'tight' | 'normal' | 'loose';
  }>;
  Icon: React.FC<ButtonProps>;
  Fab: React.FC<ButtonProps & {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  }>;
  Dropdown: React.FC<ButtonProps & {
    dropdownItems?: Array<{
      label: string;
      onClick: () => void;
      disabled?: boolean;
      icon?: React.ReactNode;
    }>;
    dropdownOpen?: boolean;
    onDropdownToggle?: () => void;
  }>;
}

declare const Button: ButtonComponent;
export default Button;
