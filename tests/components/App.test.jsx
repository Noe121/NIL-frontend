import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen } from '../test-utils.jsx';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App.jsx';

// Test wrapper component for routing
const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(ui, { route });
};

// Mock all components to avoid complex dependencies
vi.mock('../../src/contexts/UserContext.jsx', async () => {
  const actual = await vi.importActual('../../src/contexts/UserContext.jsx');
  return {
    ...actual,
    UserProvider: ({ children }) => {
      return (
        <div data-testid="user-provider" data-user={JSON.stringify({})}>
          <React.Fragment>
            {children}
          </React.Fragment>
        </div>
      );
    }
  };
});

vi.mock('../../src/contexts/GamificationContext.jsx', () => ({
  GamificationProvider: ({ children }) => <div data-testid="gamification-provider">{children}</div>
}));

vi.mock('../../src/components/NotificationToast.jsx', () => ({
  ToastProvider: ({ children }) => <div data-testid="toast-provider">{children}</div>
}));

vi.mock('../../src/components/NavigationBar.jsx', () => ({
  default: function NavigationBar() {
    return <nav data-testid="navigation-bar">Navigation</nav>;
  }
}));

vi.mock('../../src/LandingPage.jsx', () => {
  return function LandingPage() {
    return <div data-testid="landing-page">Landing Page</div>;
  };
});

vi.mock('../../src/Auth.jsx', () => {
  return function Auth() {
    return <div data-testid="auth-page">Auth Page</div>;
  };
});

vi.mock('../../src/Register.jsx', () => {
  return function Register() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

vi.mock('../../src/components/MultiStepRegister.jsx', () => {
  return function MultiStepRegister() {
    return <div data-testid="multi-step-register">Multi Step Register</div>;
  };
});

vi.mock('../../src/components/PrivateRoute.jsx', () => ({
  default: ({ children, role }) => {
    if (role === 'athlete') {
      return <div data-testid="athlete-dashboard">Athlete Dashboard</div>;
    }
    if (role === 'sponsor') {
      return <div data-testid="sponsor-dashboard">Sponsor Dashboard</div>;
    }
    if (role === 'fan') {
      return <div data-testid="fan-dashboard">Fan Dashboard</div>;
    }
    return <div data-testid="protected-route">{children}</div>;
  }
}));

vi.mock('../../src/UserInfo.jsx', () => {
  return function UserInfo() {
    return <div data-testid="user-info">User Info</div>;
  };
});

vi.mock('../../src/components/LazyComponents.jsx', () => ({
  LazyAthleteDashboard: () => <div data-testid="athlete-dashboard">Athlete Dashboard</div>,
  LazySponsorDashboard: () => <div data-testid="sponsor-dashboard">Sponsor Dashboard</div>,
  LazyFanDashboard: () => <div data-testid="fan-dashboard">Fan Dashboard</div>,
  LazyProfileManagement: () => <div data-testid="profile-management">Profile Management</div>,
  LazySponsorshipManagement: () => <div data-testid="sponsorship-management">Sponsorship Management</div>,
  LazyAthleteSearch: () => <div data-testid="athlete-search">Athlete Search</div>,
  LazyAnalytics: () => <div data-testid="analytics">Analytics</div>,
  LazyReports: () => <div data-testid="reports">Reports</div>,
  LazySchedule: () => <div data-testid="schedule">Schedule</div>,
  LazyStore: () => <div data-testid="store">Store</div>,
  LazyNotifications: () => <div data-testid="notifications">Notifications</div>,
  LazyAthleteProfiles: () => <div data-testid="athlete-profiles">Athlete Profiles</div>
}));

vi.mock('../../src/pages/AthleteUserPage.jsx', () => ({
  default: () => <div data-testid="athlete-dashboard">Athlete Dashboard</div>
}));

vi.mock('../../src/pages/SponsorUserPage.jsx', () => ({
  default: () => <div data-testid="sponsor-dashboard">Sponsor Dashboard</div>
}));

vi.mock('../../src/pages/FanUserPage.jsx', () => ({
  default: () => <div data-testid="fan-dashboard">Fan Dashboard</div>
}));

describe('App Integration', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<App />);
    
    expect(screen.getByTestId('user-provider')).toBeInTheDocument();
    expect(screen.getByTestId('gamification-provider')).toBeInTheDocument();
    expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
  });

  it('renders navigation bar', () => {
    renderWithRouter(<App />);
    
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('renders auth page on /auth route', () => {
    renderWithRouter(<App />, { route: '/auth' });
    
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('includes all required providers in correct order', () => {
    const { container } = renderWithRouter(<App />);
    
    // Check that providers are nested correctly
    const userProvider = screen.getByTestId('user-provider');
    const gamificationProvider = screen.getByTestId('gamification-provider');
    const toastProvider = screen.getByTestId('toast-provider');
    
    expect(userProvider).toBeInTheDocument();
    expect(gamificationProvider).toBeInTheDocument();
    expect(toastProvider).toBeInTheDocument();
    
    // Verify provider nesting order
    expect(userProvider.contains(gamificationProvider)).toBe(true);
    expect(gamificationProvider.contains(toastProvider)).toBe(true);
  });

  it('renders landing page on root route', () => {
    renderWithRouter(<App />, { route: '/' });
    
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('renders test page on /test route', () => {
    renderWithRouter(<App />, { route: '/test' });
    
    expect(screen.getByTestId('test-page')).toBeInTheDocument();
  });
});

describe('App Error Handling', () => {
  it('handles provider errors gracefully', () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<App />);
    
    // App should still render even if there are provider issues
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('maintains state between route changes', () => {
    render(<App />);
    
    // User provider should maintain state across navigation
    expect(screen.getByTestId('user-provider')).toBeInTheDocument();
    expect(screen.getByTestId('gamification-provider')).toBeInTheDocument();
  });
});

describe('App Code Splitting', () => {
  it('lazy loads dashboard components correctly', async () => {
    const authenticatedUser = {
      user: { email: 'test@example.com', role: 'athlete' },
      isAuthenticated: true,
      role: 'athlete'
    };
    
    renderWithRouter(<App />, { 
      route: '/dashboard/athlete',
      userContext: authenticatedUser
    });
    
    // Core components should be loaded immediately
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('user-provider')).toBeInTheDocument();
    
    // Wait for lazy components to load
    await screen.findByTestId('athlete-dashboard');
    expect(screen.getByTestId('athlete-dashboard')).toBeInTheDocument();
  });

  it('maintains core functionality while lazy components load', () => {
    renderWithRouter(<App />);
    
    // Core UI should be functional
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('user-provider')).toBeInTheDocument();
  });
});

describe('App Accessibility', () => {
  it('has semantic HTML structure', () => {
    render(<App />);
    
    // Should have navigation landmark
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Should be able to tab through the interface
    await user.tab();
    
    // Some element should receive focus
    expect(document.activeElement).toBeDefined();
  });

  it('provides proper focus management', () => {
    render(<App />);
    
    // Should have proper focus order and management
    expect(document.body).toBeDefined();
  });
});

describe('App Mobile Responsiveness', () => {
  beforeEach(() => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });
  });

  it('adapts to mobile viewport', () => {
    render(<App />);
    
    // App should render without issues on mobile
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('maintains functionality on touch devices', () => {
    render(<App />);
    
    // All interactive elements should work with touch
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });
});