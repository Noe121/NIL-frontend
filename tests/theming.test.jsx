import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';

// Mock UserContext for testing
const MockUserProvider = ({ children, value }) => {
  const mockContext = React.createContext(value);
  return React.createElement(mockContext.Provider, { value }, children);
};

// Test component that simulates role-based background functionality
const TestRoleBackground = ({ userRole }) => {
  const getRoleBasedBackground = (role) => {
    switch (role) {
      case 'athlete':
        return 'linear-gradient(135deg, #ff6f61, #6b48ff)';
      case 'sponsor':
        return 'linear-gradient(135deg, #2c3e50, #3498db)';
      case 'fan':
        return 'linear-gradient(135deg, #ff9a9e, #fad0c4)';
      default:
        return 'linear-gradient(135deg, #667eea, #764ba2)';
    }
  };

  const backgroundStyle = {
    background: getRoleBasedBackground(userRole),
    minHeight: '100vh',
    transition: 'background 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <div data-testid="role-background" style={backgroundStyle}>
      <h1>NILbx - {userRole || 'default'} Background</h1>
      <p>Current role: {userRole || 'none'}</p>
    </div>
  );
};

describe('Role-Based Theming System', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders default background when no role is provided', () => {
    render(<TestRoleBackground />);
    
    const backgroundElement = screen.getByTestId('role-background');
    expect(backgroundElement).toBeInTheDocument();
    expect(backgroundElement.style.background).toContain('linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))');
  });

  it('renders athlete background with coral-to-purple gradient', () => {
    render(<TestRoleBackground userRole="athlete" />);
    
    const backgroundElement = screen.getByTestId('role-background');
    expect(backgroundElement.style.background).toContain('linear-gradient(135deg, rgb(255, 111, 97), rgb(107, 72, 255))');
    expect(screen.getByText('Current role: athlete')).toBeInTheDocument();
  });

  it('renders sponsor background with slate-to-blue gradient', () => {
    render(<TestRoleBackground userRole="sponsor" />);
    
    const backgroundElement = screen.getByTestId('role-background');
    expect(backgroundElement.style.background).toContain('linear-gradient(135deg, rgb(44, 62, 80), rgb(52, 152, 219))');
    expect(screen.getByText('Current role: sponsor')).toBeInTheDocument();
  });

  it('renders fan background with pink-to-peach gradient', () => {
    render(<TestRoleBackground userRole="fan" />);
    
    const backgroundElement = screen.getByTestId('role-background');
    expect(backgroundElement.style.background).toContain('linear-gradient(135deg, rgb(255, 154, 158), rgb(250, 208, 196))');
    expect(screen.getByText('Current role: fan')).toBeInTheDocument();
  });

  it('applies smooth transition styling', () => {
    render(<TestRoleBackground userRole="athlete" />);
    
    const backgroundElement = screen.getByTestId('role-background');
    expect(backgroundElement.style.transition).toContain('background 0.8s cubic-bezier(0.4, 0, 0.2, 1)');
    expect(backgroundElement.style.minHeight).toBe('100vh');
  });

  it('updates background when role changes', () => {
    const { rerender } = render(<TestRoleBackground userRole="athlete" />);
    
    let backgroundElement = screen.getByTestId('role-background');
    expect(backgroundElement.style.background).toContain('rgb(255, 111, 97)');
    
    rerender(<TestRoleBackground userRole="sponsor" />);
    
    backgroundElement = screen.getByTestId('role-background');
    expect(backgroundElement.style.background).toContain('rgb(44, 62, 80)');
    expect(screen.getByText('Current role: sponsor')).toBeInTheDocument();
  });
});

describe('Role-Based Content Styling', () => {
  const TestContentStyle = ({ userRole }) => {
    const getRoleBasedContentStyle = (role) => {
      const baseStyle = {
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '2rem',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
      };

      switch (role) {
        case 'athlete':
          return {
            ...baseStyle,
            border: '1px solid rgba(255, 111, 97, 0.3)',
            boxShadow: '0 8px 32px rgba(255, 111, 97, 0.1)'
          };
        case 'sponsor':
          return {
            ...baseStyle,
            border: '1px solid rgba(52, 152, 219, 0.3)',
            boxShadow: '0 8px 32px rgba(52, 152, 219, 0.1)'
          };
        case 'fan':
          return {
            ...baseStyle,
            border: '1px solid rgba(255, 154, 158, 0.3)',
            boxShadow: '0 8px 32px rgba(255, 154, 158, 0.1)'
          };
        default:
          return baseStyle;
      }
    };

    return (
      <div data-testid="content-style" style={getRoleBasedContentStyle(userRole)}>
        <h2>Content for {userRole || 'default'} role</h2>
      </div>
    );
  };

  it('applies role-specific border colors', () => {
    render(<TestContentStyle userRole="athlete" />);
    
    const contentElement = screen.getByTestId('content-style');
    expect(contentElement.style.border).toContain('rgba(255, 111, 97, 0.3)');
    expect(contentElement.style.boxShadow).toContain('rgba(255, 111, 97, 0.1)');
  });

  it('applies backdrop filter and base styling', () => {
    render(<TestContentStyle userRole="sponsor" />);
    
    const contentElement = screen.getByTestId('content-style');
    expect(contentElement.style.backdropFilter).toBe('blur(10px)');
    expect(contentElement.style.backgroundColor).toBe('rgba(255, 255, 255, 0.1)');
    expect(contentElement.style.borderRadius).toBe('12px');
    expect(contentElement.style.textShadow).toContain('rgba(0, 0, 0, 0.3)');
  });
});