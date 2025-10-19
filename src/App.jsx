import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.jsx';
import { useUser } from './contexts/UserContext';
import { config, utils, APP_MODE, IS_CENTRALIZED, IS_DEV } from './utils/config.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AthleteUserPage from './pages/AthleteUserPage.jsx';
import SponsorUserPage from './pages/SponsorUserPage.jsx';
import FanUserPage from './pages/FanUserPage.jsx';
import NavigationBar from './components/NavigationBar.jsx';

// Simple test to make sure everything works
function TestPage() {
  return (
    <div data-testid="test-page" style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>🧪 Test Page</h1>
      <p>This is the test route!</p>
      <a href="/" style={{ color: 'white' }}>← Back to Home</a>
    </div>
  );
}

function HomePage() {
  const { user, role, isAuthenticated, logout } = useUser();
  
  // Get role-based background styles
  const getRoleBasedBackground = () => {
    if (!isAuthenticated || !role) {
      return 'linear-gradient(90deg, #1e3c72, #2a5298)';
    }
    
    switch (role) {
      case 'athlete':
        return 'linear-gradient(135deg, #ff6f61, #6b48ff)';
      case 'sponsor':
        return 'linear-gradient(90deg, #2c3e50, #3498db)';
      case 'fan':
        return 'linear-gradient(135deg, #ff9a9e, #fad0c4)';
      default:
        return 'linear-gradient(90deg, #1e3c72, #2a5298)';
    }
  };

  // Log mode and config for debugging
  React.useEffect(() => {
    console.log('Current mode:', config.mode);
    console.log('Auth Service URL:', config.authServiceUrl);
    console.log('Is Centralized:', config.isCentralized);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div data-testid="landing-page" style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      background: getRoleBasedBackground(),
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>🏠 NILbx - Home Page</h1>
      <p>Welcome to NILbx! Role-based backgrounds are now working!</p>
      
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', marginTop: '30px' }}>
        <h2>✅ Status Check</h2>
        <p>React ✅</p>
        <p>Router ✅</p>
        <p>UserContext ✅</p>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          <p>Mode: <strong>{APP_MODE.toUpperCase()}</strong> {IS_CENTRALIZED ? '⛓️' : '📱'}</p>
          <p>Environment: <strong>{IS_DEV ? 'DEVELOPMENT 🛠️' : 'PRODUCTION 🚀'}</strong></p>
          <p>API URL: {config.apiUrl} ✨</p>
          <p>Auth URL: {config.authServiceUrl} �</p>
          <p>Features Enabled:</p>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {Object.entries(config.features)
              .filter(([_, enabled]) => enabled)
              .map(([name, _]) => (
                <li key={name} style={{ margin: '2px 0' }}>
                  ✓ {name}
                </li>
              ))}
          </ul>
        </div>
        
        {isAuthenticated && role ? (
          <div style={{ marginTop: '15px' }}>
            <p>🎨 <strong>Role-based Background Active!</strong></p>
            <p>Welcome back, <strong>{user?.name || user?.email}</strong>!</p>
            <p>Current Role: <span style={{ 
              background: role === 'athlete' ? '#ff6f61' : role === 'sponsor' ? '#3498db' : '#ff9a9e',
              padding: '4px 8px', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>{role.charAt(0).toUpperCase() + role.slice(1)}</span></p>
            
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255, 0, 0, 0.6)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '15px' }}>
            <p>👤 Not logged in - using default background</p>
            <a href="/auth" style={{ 
              color: 'white', 
              background: 'rgba(255,255,255,0.2)', 
              padding: '8px 16px', 
              borderRadius: '5px', 
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '10px'
            }}>
              Login to see role backgrounds
            </a>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <a href="/test" style={{ color: 'white', marginRight: '15px' }}>Test Page</a>
          <a href="/auth" style={{ color: 'white' }}>Auth Page</a>
        </div>
      </div>
    </div>
  );
}

function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [message, setMessage] = useState('');
  const [authStatus, setAuthStatus] = useState(null);

  // Check auth service status on mount
  useEffect(() => {
    const checkAuthService = async () => {
      try {
        const status = await utils.checkServiceHealth('Auth Service', config.authServiceUrl);
        setAuthStatus(status);
        if (status.status !== 'healthy') {
          setMessage('Warning: Auth service may be unavailable');
        }
      } catch (error) {
        console.error('Auth service check failed:', error);
        setMessage('Error: Could not connect to auth service');
      }
    };
    checkAuthService();
  }, []);

  const handleLoginSuccess = (result) => {
    setMessage(`Welcome back! Redirecting to home...`);
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handleRegisterSuccess = (result) => {
    setMessage('Registration successful! Please log in.');
    setMode('login');
  };

  const getBackground = () => {
    return mode === 'login' 
      ? 'linear-gradient(135deg, #4CAF50, #45a049)'
      : 'linear-gradient(135deg, #2196F3, #1976D2)';
  };

  return (
    <div data-testid="auth-page" style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      background: getBackground(),
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1>🔐 {mode === 'login' ? 'Login' : 'Register'}</h1>
        
        {message && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            {message}
          </div>
        )}

        {mode === 'login' ? (
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onCancel={() => window.location.href = '/'}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onCancel={() => window.location.href = '/'}
          />
        )}

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setMessage('');
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {mode === 'login' ? '📝 Need an account? Register' : '🔑 Have an account? Login'}
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(45deg, #f44336, #ff9800)',
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: 'white' }}>← Back to Home</a>
    </div>
  );
}

// Safe provider wrapper
function SafeUserProvider({ children }) {
  try {
    return <UserProvider>{children}</UserProvider>;
  } catch (error) {
    return (
      <div style={{ padding: '20px', background: 'red', color: 'white', fontFamily: 'Arial' }}>
        <h1>❌ UserProvider Error</h1>
        <pre>{error.toString()}</pre>
      </div>
    );
  }
}

export default function App() {
  return (
    <SafeUserProvider>
      <div data-testid="gamification-provider">
        <div data-testid="toast-provider">
          <NavigationBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/test" element={<TestPage />} />
            
            {/* Role-specific dashboards */}
            <Route path="/dashboard/athlete" element={
              <PrivateRoute role="athlete">
                <AthleteUserPage />
              </PrivateRoute>
            } />
            <Route path="/dashboard/sponsor" element={
              <PrivateRoute role="sponsor">
                <SponsorUserPage />
              </PrivateRoute>
            } />
            <Route path="/dashboard/fan" element={
              <PrivateRoute role="fan">
                <FanUserPage />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </SafeUserProvider>
  );
}