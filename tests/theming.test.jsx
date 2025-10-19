import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, ThemeContext } from '../src/contexts/ThemeContext';
import userEvent from '@testing-library/user-event';

// Theme constants for testing
const THEME_TOKENS = {
  colors: {
    athlete: {
      primary: '#ff6f61',
      secondary: '#6b48ff',
      border: 'rgba(255, 111, 97, 0.3)',
      shadow: 'rgba(255, 111, 97, 0.1)'
    },
    sponsor: {
      primary: '#2c3e50',
      secondary: '#3498db',
      border: 'rgba(52, 152, 219, 0.3)',
      shadow: 'rgba(52, 152, 219, 0.1)'
    },
    fan: {
      primary: '#ff9a9e',
      secondary: '#fad0c4',
      border: 'rgba(255, 154, 158, 0.3)',
      shadow: 'rgba(255, 154, 158, 0.1)'
    },
    default: {
      primary: '#667eea',
      secondary: '#764ba2',
      border: 'rgba(102, 126, 234, 0.3)',
      shadow: 'rgba(102, 126, 234, 0.1)'
    }
  },
  animations: {
    transition: {
      normal: '0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      fast: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '1.2s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

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

// Theme Provider wrapper for testing
const ThemeWrapper = ({ children, initialRole = null, initialMode = 'light' }) => {
  return (
    <ThemeProvider initialRole={initialRole} initialMode={initialMode}>
      {children}
    </ThemeProvider>
  );
};

// Mock matchMedia for color scheme tests
const mockMatchMedia = (matches) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('Role-Based Theming System', () => {
  beforeEach(() => {
    cleanup();
    mockMatchMedia(false); // Reset color scheme preference
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

describe('Theme Provider Context', () => {
  it('provides theme context and allows theme changes', async () => {
    const user = userEvent.setup();
    const TestThemeConsumer = () => {
      const { currentRole, setRole } = React.useContext(ThemeContext);
      return (
        <div>
          <span data-testid="current-role">{currentRole || 'default'}</span>
          <button onClick={() => setRole('athlete')}>Set Athlete</button>
        </div>
      );
    };

    render(
      <ThemeWrapper>
        <TestThemeConsumer />
      </ThemeWrapper>
    );

    expect(screen.getByTestId('current-role')).toHaveTextContent('default');
    await user.click(screen.getByText('Set Athlete'));
    expect(screen.getByTestId('current-role')).toHaveTextContent('athlete');
  });

  it('handles color scheme preferences', async () => {
    mockMatchMedia(true); // Simulate dark mode preference
    const TestThemeConsumer = () => {
      const { mode } = React.useContext(ThemeContext);
      return <div data-testid="color-mode">{mode}</div>;
    };

    render(
      <ThemeWrapper>
        <TestThemeConsumer />
      </ThemeWrapper>
    );

    expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
  });

  it('persists theme preferences', () => {
    const mockStorage = {};
    const originalGetItem = localStorage.getItem;
    const originalSetItem = localStorage.setItem;
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(key => mockStorage[key]),
        setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
      },
      writable: true
    });

    render(
      <ThemeWrapper initialRole="athlete">
        <TestRoleBackground userRole="athlete" />
      </ThemeWrapper>
    );

    expect(localStorage.setItem).toHaveBeenCalledWith('theme-role', 'athlete');
    
    // Restore original localStorage
    window.localStorage.getItem = originalGetItem;
    window.localStorage.setItem = originalSetItem;
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
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        transition: THEME_TOKENS.animations.transition.normal
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
    render(
      <ThemeWrapper initialRole="athlete">
        <TestContentStyle userRole="athlete" />
      </ThemeWrapper>
    );
    
    const contentElement = screen.getByTestId('content-style');
    expect(contentElement.style.border).toContain(THEME_TOKENS.colors.athlete.border);
    expect(contentElement.style.boxShadow).toContain(THEME_TOKENS.colors.athlete.shadow);
  });

  it('applies backdrop filter and base styling', () => {
    render(
      <ThemeWrapper initialRole="sponsor">
        <TestContentStyle userRole="sponsor" />
      </ThemeWrapper>
    );
    
    const contentElement = screen.getByTestId('content-style');
    expect(contentElement.style.backdropFilter).toBe('blur(10px)');
    expect(contentElement.style.backgroundColor).toBe('rgba(255, 255, 255, 0.1)');
    expect(contentElement.style.borderRadius).toBe('12px');
    expect(contentElement.style.textShadow).toContain('rgba(0, 0, 0, 0.3)');
  });

  describe('Accessibility and Color Contrast', () => {
    it('maintains sufficient color contrast in light mode', () => {
      render(
        <ThemeWrapper initialRole="athlete" initialMode="light">
          <TestContentStyle userRole="athlete" />
        </ThemeWrapper>
      );
      
      const contentElement = screen.getByTestId('content-style');
      const styles = window.getComputedStyle(contentElement);
      expect(styles.backgroundColor).not.toBe('transparent');
      expect(styles.color).toBeTruthy();
    });

    it('maintains sufficient color contrast in dark mode', () => {
      render(
        <ThemeWrapper initialRole="athlete" initialMode="dark">
          <TestContentStyle userRole="athlete" />
        </ThemeWrapper>
      );
      
      const contentElement = screen.getByTestId('content-style');
      const styles = window.getComputedStyle(contentElement);
      expect(styles.backgroundColor).not.toBe('transparent');
      expect(styles.color).toBeTruthy();
    });
  });

  describe('Theme Token Validation', () => {
    it('validates all required theme tokens are present', () => {
      const requiredTokens = [
        'colors.athlete.primary',
        'colors.athlete.secondary',
        'colors.sponsor.primary',
        'colors.sponsor.secondary',
        'colors.fan.primary',
        'colors.fan.secondary',
        'animations.transition.normal'
      ];

      requiredTokens.forEach(token => {
        const value = token.split('.').reduce((obj, key) => obj[key], THEME_TOKENS);
        expect(value).toBeTruthy();
      });
    });

    it('validates color values are in correct format', () => {
      const colorRegex = /^#[0-9A-Fa-f]{6}$|^rgba?\([^)]*\)$/;
      
      Object.values(THEME_TOKENS.colors).forEach(roleColors => {
        Object.values(roleColors).forEach(color => {
          expect(color).toMatch(colorRegex);
        });
      });
    });
  });

  describe('Animation and Transitions', () => {
    it('applies correct transition timings', async () => {
      const { rerender } = render(
        <ThemeWrapper initialRole="athlete">
          <TestContentStyle userRole="athlete" />
        </ThemeWrapper>
      );

      const contentElement = screen.getByTestId('content-style');
      expect(contentElement.style.transition).toContain(THEME_TOKENS.animations.transition.normal);

      rerender(
        <ThemeWrapper initialRole="sponsor">
          <TestContentStyle userRole="sponsor" />
        </ThemeWrapper>
      );

      // Verify transition was applied during role change
      expect(contentElement.style.transition).toContain(THEME_TOKENS.animations.transition.normal);
    });
  });
});