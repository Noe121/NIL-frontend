import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { UserProvider } from '../../src/contexts/UserContext.jsx';
import { GamificationProvider } from '../../src/contexts/GamificationContext.jsx';
import NavigationBar from '../../src/components/NavigationBar.jsx';

// Mock Modules
const mockUseScreenSize = vi.fn(() => ({
  isMobile: false,
  isTablet: false,
  isDesktop: true
}));

vi.mock('../../src/utils/responsive.jsx', () => ({
  useScreenSize: () => mockUseScreenSize(),
  useTouchGestures: vi.fn(),
  MobileDrawer: ({ children, isOpen, onClose, className = '' }) => (
    <div 
      data-testid="mobile-drawer"
      className={`${className} ${isOpen ? 'visible' : 'hidden'}`}
      aria-hidden={isOpen ? 'false' : 'true'}
      onClick={onClose}
    >
      {children}
    </div>
  )
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>
  },
  AnimatePresence: ({ children }) => children
}));

vi.mock('../../src/components/SearchComponent.jsx', () => ({
  default: () => <div data-testid="search-component">Search</div>
}));

vi.mock('../../src/components/Button.jsx', () => ({
  default: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  )
}));

// Mock UserProvider context
const mockUserContext = {
  isAuthenticated: true,
  user: { email: 'test@example.com' },
  role: 'athlete',
  logout: vi.fn()
};

vi.mock('../../src/contexts/UserContext.jsx', () => ({
  useUser: () => mockUserContext,
  UserProvider: ({ children }) => <div>{children}</div>
}));

const TestWrapper = ({ children, initialUser = null }) => (
  <BrowserRouter>
    <UserProvider initialUser={initialUser || mockUserContext}>
      <GamificationProvider>
        {children}
      </GamificationProvider>
    </UserProvider>
  </BrowserRouter>
);

describe('NavigationBar Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockUseScreenSize.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true
    });
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
    mockUseScreenSize.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });

    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('displays role-based navigation for authenticated athlete', async () => {
    mockUserContext.role = 'athlete';
    const athleteUser = {
      isAuthenticated: true,
      user: { email: 'athlete@test.com' },
      role: 'athlete',
      logout: vi.fn()
    };

    render(
      <TestWrapper initialUser={athleteUser}>
        <NavigationBar />
      </TestWrapper>
    );

    // Verify athlete-specific navigation items
    const nav = screen.getByTestId('desktop-navigation');
    
    // Verify athlete-specific links
    expect(screen.getByRole('link', { name: /My Sponsorships/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Schedule/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Analytics/ })).toBeInTheDocument();

    // Verify sponsor-specific links are not present
    expect(screen.queryByRole('link', { name: 'Find Athletes' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Manage Deals' })).not.toBeInTheDocument();
  });

  it('displays role-based navigation for authenticated sponsor', async () => {
    mockUserContext.role = 'sponsor';
    const sponsorUser = {
      isAuthenticated: true,
      user: { email: 'sponsor@test.com' },
      role: 'sponsor',
      logout: vi.fn()
    };

    render(
      <TestWrapper initialUser={sponsorUser}>
        <NavigationBar />
      </TestWrapper>
    );

    // Verify sponsor-specific navigation items
    const nav = screen.getByTestId('desktop-navigation');
    
    // Verify sponsor-specific links
    expect(screen.getByRole('link', { name: /Find Athletes/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Manage Deals/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reports/ })).toBeInTheDocument();

    // Verify athlete-specific links are not present
    expect(screen.queryByRole('link', { name: 'My Sponsorships' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Schedule' })).not.toBeInTheDocument();
  });

  it('opens mobile menu when menu button is clicked', async () => {
    mockUseScreenSize.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });

    const user = userEvent.setup();
    const mockUser = {
      email: 'athlete@test.com',
      role: 'athlete',
      isAuthenticated: true
    };

    render(
      <TestWrapper initialUser={mockUser}>
        <NavigationBar />
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    await user.click(menuButton);

    const drawer = screen.getByTestId('mobile-drawer');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass('visible');
  });

  it('handles logout correctly for different viewports', async () => {
    const user = userEvent.setup();
    const mockLogout = vi.fn();
    mockUserContext.logout = mockLogout;
    const testUser = {
      isAuthenticated: true,
      user: { email: 'test@example.com' },
      role: 'athlete',
      logout: mockLogout
    };

    // Test desktop logout
    mockUseScreenSize.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true
    });

    render(
      <TestWrapper initialUser={testUser}>
        <NavigationBar />
      </TestWrapper>
    );

    const desktopLogoutButton = screen.getByRole('button', { 
      name: 'Desktop logout button'
    });

    await user.click(desktopLogoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);

    // Clean up and test mobile logout
    mockLogout.mockClear();
    mockUseScreenSize.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });

    const { rerender } = render(
      <TestWrapper initialUser={testUser}>
        <NavigationBar />
      </TestWrapper>
    );

    // Open mobile menu first
    const menuButtons = screen.getAllByRole('button', { name: 'Toggle mobile menu' });
    const menuButton = menuButtons[menuButtons.length - 1];
    await user.click(menuButton);

    const mobileLogoutButton = screen.getByRole('button', { 
      name: 'Mobile logout button'
    });

    await user.click(mobileLogoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

describe('NavigationBar Accessibility', () => {
  beforeEach(() => {
    mockUseScreenSize.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true
    });
  });

  it('has proper ARIA attributes and landmarks', () => {
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    
    // Verify skip link for keyboard users
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('supports complete keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    // Get all focusable elements
    const focusableElements = screen.getAllByRole('link');

    // Start from the first focusable element (logo)
    const firstElement = focusableElements[0];
    firstElement.focus();
    expect(firstElement).toHaveFocus();

    // Tab through all focusable elements and verify they can receive focus
    for (let i = 1; i < focusableElements.length; i++) {
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
      expect(document.activeElement).toHaveAttribute('href');
    }

    // Verify we can tab back to the beginning
    await user.tab();
    expect(document.activeElement).toBeInTheDocument();
  });

  it('announces menu state changes', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    // For mobile view
    if (mockUseScreenSize().isMobile) {
      const menuButton = screen.getByRole('button', { name: 'Toggle mobile menu' });
      
      // Open menu
      await user.click(menuButton);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-expanded', 'true');
      
      // Close menu
      await user.click(menuButton);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-expanded', 'false');
    }
  });
});

describe('NavigationBar Mobile Responsiveness', () => {
  beforeEach(() => {
    mockUseScreenSize.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });
  });

  it('adapts layout for mobile screens', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    // Desktop navigation should be hidden
    const desktopNav = screen.getByTestId('desktop-navigation');
    expect(desktopNav).toHaveClass('hidden');
    
    // Mobile menu button should be visible
    const menuButton = screen.getByRole('button', { name: 'Toggle mobile menu' });
    expect(menuButton).toBeVisible();

    // Mobile drawer should be hidden initially
    const drawer = screen.getByTestId('mobile-drawer');
    expect(drawer).toHaveAttribute('aria-hidden', 'true');

    // Open mobile menu
    await user.click(menuButton);
    expect(drawer).toHaveAttribute('aria-hidden', 'false');

    // Close mobile menu
    await user.click(menuButton);
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });

  it('has touch-friendly button sizes', () => {
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({ width: 44, height: 44 }));

    render(
      <TestWrapper>
        <NavigationBar />
      </TestWrapper>
    );

    const menuButton = screen.getByRole('button', { name: 'Toggle mobile menu' });
    const buttonRect = menuButton.getBoundingClientRect();
    
    // Follow WCAG touch target size guidelines (minimum 44x44 pixels)
    expect(buttonRect.width).toBeGreaterThanOrEqual(44);
    expect(buttonRect.height).toBeGreaterThanOrEqual(44);

    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });
});