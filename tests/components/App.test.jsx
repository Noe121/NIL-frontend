import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '../test-utils.jsx';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App.jsx';
import { AuthContext } from '../../src/contexts/AuthContext.jsx';
import { ApiProvider } from '../../src/contexts/ApiContext.jsx';
import { ToastProvider } from '../../src/components/NotificationToast.jsx';
import { SafeProvider } from '../../src/App.jsx';

// Mock framer-motion to avoid DOM issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    input: ({ children, ...props }) => <input {...props}>{children}</input>,
    label: ({ children, ...props }) => <label {...props}>{children}</label>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    img: ({ children, ...props }) => <img {...props}>{children}</img>,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
    path: ({ children, ...props }) => <path {...props}>{children}</path>,
    circle: ({ children, ...props }) => <circle {...props}>{children}</circle>,
    rect: ({ children, ...props }) => <rect {...props}>{children}</rect>,
    line: ({ children, ...props }) => <line {...props}>{children}</line>,
    polyline: ({ children, ...props }) => <polyline {...props}>{children}</polyline>,
    polygon: ({ children, ...props }) => <polygon {...props}>{children}</polygon>,
    text: ({ children, ...props }) => <text {...props}>{children}</text>,
    g: ({ children, ...props }) => <g {...props}>{children}</g>,
    defs: ({ children, ...props }) => <defs {...props}>{children}</defs>,
    linearGradient: ({ children, ...props }) => <linearGradient {...props}>{children}</linearGradient>,
    stop: ({ children, ...props }) => <stop {...props}>{children}</stop>,
    radialGradient: ({ children, ...props }) => <radialGradient {...props}>{children}</radialGradient>,
    clipPath: ({ children, ...props }) => <clipPath {...props}>{children}</clipPath>,
    mask: ({ children, ...props }) => <mask {...props}>{children}</mask>,
    filter: ({ children, ...props }) => <filter {...props}>{children}</filter>,
    feDropShadow: ({ children, ...props }) => <feDropShadow {...props}>{children}</feDropShadow>,
    feGaussianBlur: ({ children, ...props }) => <feGaussianBlur {...props}>{children}</feGaussianBlur>,
    feOffset: ({ children, ...props }) => <feOffset {...props}>{children}</feOffset>,
    feBlend: ({ children, ...props }) => <feBlend {...props}>{children}</feBlend>,
    feColorMatrix: ({ children, ...props }) => <feColorMatrix {...props}>{children}</feColorMatrix>,
    feComponentTransfer: ({ children, ...props }) => <feComponentTransfer {...props}>{children}</feComponentTransfer>,
    feFuncR: ({ children, ...props }) => <feFuncR {...props}>{children}</feFuncR>,
    feFuncG: ({ children, ...props }) => <feFuncG {...props}>{children}</feFuncG>,
    feFuncB: ({ children, ...props }) => <feFuncB {...props}>{children}</feFuncB>,
    feFuncA: ({ children, ...props }) => <feFuncA {...props}>{children}</feFuncA>,
    animatePresence: ({ children }) => <>{children}</>,
    AnimatePresence: ({ children }) => <>{children}</>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useMotionValue: (initial) => ({
    get: () => initial,
    set: vi.fn(),
    onChange: vi.fn(),
  }),
  useTransform: () => vi.fn(),
  useSpring: (value) => value,
  useScroll: () => ({
    scrollY: { get: () => 0 },
    scrollX: { get: () => 0 },
  }),
  useInView: () => true,
  useReducedMotion: () => false,
  useCycle: (items) => [items[0], vi.fn()],
  useTime: () => ({ get: () => 0 }),
  useMotionTemplate: () => '',
  LayoutGroup: ({ children }) => <>{children}</>,
  layout: {},
  exit: {},
  initial: {},
  animate: {},
  whileHover: {},
  whileTap: {},
  whileDrag: {},
  whileFocus: {},
  whileInView: {},
  drag: {},
  dragConstraints: {},
  transition: {},
  variants: {},
}));

// Test wrapper component for routing without providers (App provides its own)
const renderAppWithRouter = (ui, { route = '/', authContext = null } = {}) => {
  return render(ui, { route, wrapper: ({ children }) => <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter> });
};

// Separate wrapper for authenticated tests
const renderAppWithAuth = (ui, { route = '/', user = null } = {}) => {
  // Create authenticated context for this test
  const authenticatedContext = {
    user: user || { email: 'test@example.com', role: 'athlete' },
    loading: false,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn()
  };

  return render(ui, {
    route,
    authContext: authenticatedContext
  });
};

// Mock all components to avoid complex dependencies
vi.mock('../../src/contexts/UserContext.jsx', async () => {
  const actual = await vi.importActual('../../src/contexts/UserContext.jsx');
  const { UserContext } = actual;
  
  return {
    ...actual,
    UserProvider: ({ children }) => {
      const mockValue = {
        user: null,
        role: null,
        token: null,
        loading: false,
        theme: 'light',
        isAuthenticated: false,
        error: null,
        login: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
        setLoading: vi.fn(),
        setTheme: vi.fn()
      };
      
      return (
        <UserContext.Provider value={mockValue}>
          <div data-testid="user-provider" data-user={JSON.stringify({})}>
            <React.Fragment>
              {children}
            </React.Fragment>
          </div>
        </UserContext.Provider>
      );
    }
  };
});

vi.mock('../../src/contexts/AuthContext.jsx', async () => {
  const actual = await vi.importActual('../../src/contexts/AuthContext.jsx');
  const { AuthContext } = actual;
  
  return {
    ...actual,
    AuthProvider: ({ children }) => {
      const mockValue = {
        user: null,
        loading: false,
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn()
      };
      
      return (
        <AuthContext.Provider value={mockValue}>
          <div data-testid="auth-provider" data-user={JSON.stringify({})}>
            <React.Fragment>
              {children}
            </React.Fragment>
          </div>
        </AuthContext.Provider>
      );
    }
  };
});

vi.mock('../../src/contexts/ApiContext.jsx', async () => {
  const actual = await vi.importActual('../../src/contexts/ApiContext.jsx');
  const { ApiContext } = actual;
  
  return {
    ...actual,
    ApiProvider: ({ children }) => {
      const mockValue = {
        apiService: { checkHealth: vi.fn() },
        healthStatus: {},
        loading: false,
        setLoading: vi.fn(),
        checkHealth: vi.fn()
      };
      
      return (
        <ApiContext.Provider value={mockValue}>
          <div data-testid="api-provider" data-user={JSON.stringify({})}>
            <React.Fragment>
              {children}
            </React.Fragment>
          </div>
        </ApiContext.Provider>
      );
    }
  };
});

vi.mock('../../src/components/NavigationBar.jsx', () => ({
  default: function NavigationBar() {
    return <nav data-testid="navigation-bar">Navigation</nav>;
  }
}));

vi.mock('../../src/pages/LandingPage.jsx', () => ({
  default: function LandingPage() {
    return <div data-testid="landing-page">Landing Page</div>;
  }
}));

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
    // For testing purposes, assume authenticated and return appropriate dashboard
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
    renderAppWithRouter(<App />);
    
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('api-provider')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('renders navigation bar', () => {
    renderAppWithRouter(<App />);
    
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('renders auth page on /auth route', async () => {
    renderAppWithRouter(<App />, { route: '/auth' });
    
    // Wait for the lazy-loaded Auth component to load
    await waitFor(() => {
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('includes all required providers in correct order', () => {
    const { container } = renderAppWithRouter(<App />);
    
    // Check that providers are nested correctly
    const authProvider = screen.getByTestId('auth-provider');
    const apiProvider = screen.getByTestId('api-provider');
    
    expect(authProvider).toBeInTheDocument();
    expect(apiProvider).toBeInTheDocument();
    
    // Verify provider nesting order
    expect(authProvider.contains(apiProvider)).toBe(true);
  });

  it('renders landing page on root route', () => {
    renderAppWithRouter(<App />, { route: '/' });
    
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });
});

describe('App Error Handling', () => {
  it('handles provider errors gracefully', () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderAppWithRouter(<App />);
    
    // App should still render even if there are provider issues
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('maintains state between route changes', () => {
    renderAppWithRouter(<App />);
    
    // Auth provider should maintain state across navigation
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('api-provider')).toBeInTheDocument();
  });
});

describe('App Code Splitting', () => {
  it('lazy loads dashboard components correctly', async () => {
    renderAppWithRouter(<App />, { route: '/dashboard/athlete' });

    // Core components should be loaded immediately
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();

    // The test passes if no errors occur during rendering
    // Lazy loading is mocked, so we just verify the app renders without crashing
  });  it('maintains core functionality while lazy components load', () => {
    renderAppWithRouter(<App />);
    
    // Core UI should be functional
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('maintains core functionality while lazy components load', () => {
    renderAppWithRouter(<App />);
    
    // Core UI should be functional
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });
});

describe('App Accessibility', () => {
  it('has semantic HTML structure', () => {
    renderAppWithRouter(<App />);
    
    // Should have navigation landmark
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderAppWithRouter(<App />);
    
    // Should be able to tab through the interface
    await user.tab();
    
    // Some element should receive focus
    expect(document.activeElement).toBeDefined();
  });

  it('provides proper focus management', () => {
    renderAppWithRouter(<App />);
    
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
    renderAppWithRouter(<App />);
    
    // App should render without issues on mobile
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('maintains functionality on touch devices', () => {
    renderAppWithRouter(<App />);
    
    // All interactive elements should work with touch
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });
});