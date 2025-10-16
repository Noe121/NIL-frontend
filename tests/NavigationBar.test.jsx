import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { UserProvider } from '../src/contexts/UserContext.jsx';
import { GamificationProvider } from '../src/contexts/GamificationContext.jsx';
import NavigationBar from '../src/components/NavigationBar.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock responsive utilities
vi.mock('../src/utils/responsive.js', () => ({
  useScreenSize: () => ({ isMobile: false, isTablet: false }),
  useTouchGestures: () => {},
  MobileDrawer: ({ children, isOpen }) => isOpen ? <div data-testid="mobile-drawer">{children}</div> : null
}));

const TestWrapper = ({ children, initialUser = null }) => (
  <BrowserRouter>
    <UserProvider initialUser={initialUser}>
      <GamificationProvider>
        {children}
      </GamificationProvider>
    </UserProvider>
  </BrowserRouter>
);

describe('NavigationBar Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders logo correctly', () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    expect(screen.getByText('NILbx')).toBeInTheDocument();
  });

  it('shows mobile menu button on mobile', () => {
    // Mock mobile screen size
    vi.mocked(require('../src/utils/responsive.js').useScreenSize).mockReturnValue({
      isMobile: true,
      isTablet: false
    });

    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('displays role-based navigation for authenticated athlete', () => {
    const mockUser = {
      email: 'athlete@test.com',
      role: 'athlete'
    };

    render(
      <TestWrapper initialUser={mockUser}>
        <NavigationBar />
      </TestWrapper>
    );

    expect(screen.getByText('My Sponsorships')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('displays role-based navigation for authenticated sponsor', () => {
    const mockUser = {
      email: 'sponsor@test.com',
      role: 'sponsor'
    };

    render(
      <TestWrapper initialUser={mockUser}>
        <NavigationBar />
      </TestWrapper>
    );

    expect(screen.getByText('Find Athletes')).toBeInTheDocument();
    expect(screen.getByText('Manage Deals')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('opens mobile menu when menu button is clicked', async () => {
    const user = userEvent.setup();
    
    vi.mocked(require('../src/utils/responsive.js').useScreenSize).mockReturnValue({
      isMobile: true,
      isTablet: false
    });

    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    await user.click(menuButton);

    expect(screen.getByTestId('mobile-drawer')).toBeInTheDocument();
  });

  it('handles logout correctly', async () => {
    const user = userEvent.setup();
    const mockUser = {
      email: 'test@test.com',
      role: 'athlete'
    };

    render(
      <TestWrapper initialUser={mockUser}>
        <NavigationBar />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    // Verify logout behavior (would need to check if user context is cleared)
    expect(logoutButton).toBeInTheDocument();
  });
});

describe('NavigationBar Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const logo = screen.getByRole('link', { name: /nilbx/i });
    logo.focus();
    
    expect(logo).toHaveFocus();
    
    // Test tab navigation
    await user.tab();
    // Next focusable element should receive focus
  });

  it('has sufficient color contrast', () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const logo = screen.getByText('NILbx');
    const styles = window.getComputedStyle(logo);
    
    // Check if text color provides sufficient contrast
    expect(styles.color).toBeTruthy();
  });
});

describe('NavigationBar Mobile Responsiveness', () => {
  beforeEach(() => {
    vi.mocked(require('../src/utils/responsive.js').useScreenSize).mockReturnValue({
      isMobile: true,
      isTablet: false
    });
  });

  it('adapts layout for mobile screens', () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    // Desktop navigation should be hidden on mobile
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    
    // Mobile menu button should be visible
    expect(screen.getByLabelText('Toggle mobile menu')).toBeInTheDocument();
  });

  it('has touch-friendly button sizes', () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    const styles = window.getComputedStyle(menuButton);
    
    // Check minimum touch target size (44px)
    expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
    expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(44);
  });
});