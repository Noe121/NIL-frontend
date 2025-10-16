import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.jsx';
import { useUser } from './contexts/UserContext';

export default function App() {
  return (
    <SafeUserProvider>
      <SafeRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SafeRouter>
    </SafeUserProvider>
  );
}

function HomePage() {
  const { user, loading } = useUser();
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #ff6f61, #6b48ff)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>🏠 NILbx - Home Page</h1>
      <p>Router is working correctly!</p>
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>✅ Status</h2>
        <p>UserProvider ✅</p>
        <p>Router ✅</p>
        <p>UserContext ✅ {loading ? '(Loading...)' : user ? `(User: ${user.name})` : '(No user)'}</p>
        <div style={{ marginTop: '10px' }}>
          <a href="/auth" style={{ color: 'white', marginRight: '10px' }}>Auth Page</a>
          <a href="/test" style={{ color: 'white', marginRight: '10px' }}>Test Page</a>
          <a href="/nonexistent" style={{ color: 'white' }}>404 Test</a>
        </div>
      </div>
    </div>
  );
}

function TestPage() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>🧪 Test Page</h1>
      <p>This is the test route!</p>
      <a href="/" style={{ color: 'white' }}>← Back to Home</a>
    </div>
  );
}

function AuthPage() {
  const { login } = useUser();
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');

  const API_URL = 'http://localhost:9000/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const endpoint = isRegister ? 'register' : 'login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `${isRegister ? 'Registration' : 'Login'} failed`);
      }

      if (isRegister) {
        setMessage('Registration successful! Please log in.');
        setIsRegister(false);
        setForm({ email: '', password: '' });
      } else {
        await login(data.access_token);
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: loading ? '#ccc' : '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginBottom: '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '28px' }}>
          {isRegister ? '🚀 Create Account' : '🔐 Welcome Back'}
        </h1>

        {error && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '16px', padding: '8px', backgroundColor: '#fdf2f2', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ color: '#16a085', textAlign: 'center', marginBottom: '16px', padding: '8px', backgroundColor: '#f0fdfa', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <button style={buttonStyle} type="submit" disabled={loading}>
            {loading ? '⏳ Processing...' : (isRegister ? '🚀 Create Account' : '🔑 Sign In')}
          </button>
        </form>

        <button
          style={{ ...buttonStyle, backgroundColor: 'transparent', color: '#667eea', border: '2px solid #667eea' }}
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
            setMessage('');
            setForm({ email: '', password: '' });
          }}
          disabled={loading}
        >
          {isRegister ? '👤 Already have an account? Sign In' : '✨ Need an account? Create One'}
        </button>

        {!isRegister && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a href="/forgot-password" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
              🔗 Forgot your password?
            </a>
          </div>
        )}
      </div>
    </div>
  );
}



function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:9000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send reset email');
      }

      setMessage('Password reset email sent! Check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '28px' }}>
          🔗 Reset Password
        </h1>

        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '16px', padding: '8px', backgroundColor: '#fdf2f2', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ color: '#16a085', textAlign: 'center', marginBottom: '16px', padding: '8px', backgroundColor: '#f0fdfa', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <button
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? '⏳ Sending...' : '📧 Send Reset Email'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <a href="/auth" style={{ color: '#ff6b6b', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPage() {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:9000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setMessage('Password reset successful! You can now login with your new password.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f44336, #ff9800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h1>❌ Invalid Reset Link</h1>
          <p>This password reset link is invalid or has expired.</p>
          <a href="/forgot-password" style={{ color: 'white', textDecoration: 'underline' }}>
            Request a new reset link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '28px' }}>
          🔑 New Password
        </h1>

        {error && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '16px', padding: '8px', backgroundColor: '#fdf2f2', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ color: '#16a085', textAlign: 'center', marginBottom: '16px', padding: '8px', backgroundColor: '#f0fdfa', borderRadius: '4px' }}>
            {message}
            <div style={{ marginTop: '10px' }}>
              <a href="/auth" style={{ color: '#16a085', textDecoration: 'underline' }}>
                Go to Login
              </a>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <input
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? '⏳ Updating...' : '🔐 Update Password'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <a href="/auth" style={{ color: '#4CAF50', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(45deg, #f44336, #ff9800)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: 'white' }}>← Back to Home</a>
    </div>
  );
}

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
