import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext.jsx';
import { config } from './utils/config.js';

export default function SimpleAuth() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

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
      const response = await fetch(`${config.authServiceUrl}${endpoint}`, {
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
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '40px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#333',
      fontSize: '28px',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: loading ? '#ccc' : '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: loading ? 'not-allowed' : 'pointer',
      marginBottom: '16px',
      transition: 'background-color 0.3s ease'
    },
    toggleButton: {
      width: '100%',
      padding: '8px',
      backgroundColor: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '8px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    error: {
      color: '#e74c3c',
      textAlign: 'center',
      marginBottom: '16px',
      padding: '8px',
      backgroundColor: '#fdf2f2',
      borderRadius: '4px',
      border: '1px solid #fecaca'
    },
    success: {
      color: '#16a085',
      textAlign: 'center',
      marginBottom: '16px',
      padding: '8px',
      backgroundColor: '#f0fdfa',
      borderRadius: '4px',
      border: '1px solid #a7f3d0'
    },
    forgotLink: {
      textAlign: 'center',
      marginTop: '16px'
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isRegister ? '🚀 Create Account' : '🔐 Welcome Back'}
        </h1>

        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : (isRegister ? '🚀 Create Account' : '🔑 Sign In')}
          </button>
        </form>

        <button
          style={styles.toggleButton}
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
          <div style={styles.forgotLink}>
            <a href="/forgot-password" style={styles.link}>
              🔗 Forgot your password?
            </a>
          </div>
        )}
      </div>
    </div>
  );
}