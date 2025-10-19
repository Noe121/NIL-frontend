import React, { useState } from 'react';
import { authService } from '../services/authService.js';
import { useUser } from '../contexts/UserContext.jsx';

const LoginForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useUser();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const result = await authService.login(formData);
      
      if (result.success) {
        console.log('Login successful:', { user: result.user, role: result.role });
        // Update user context
        dispatch({
          type: 'LOGIN',
          payload: {
            user: result.user,
            role: result.role,
            token: result.token
          }
        });
        
        if (onSuccess) onSuccess(result);
      } else {
        console.error('Login failed:', result.error);
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '30px',
      borderRadius: '10px',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
        🔐 Login to NILbx
      </h2>
      
      {error && (
        <div style={{
          background: 'rgba(255, 0, 0, 0.3)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          <strong>Error:</strong> {error}
          {error.includes('401') && (
            <div style={{ marginTop: '5px', fontSize: '0.9em' }}>
              Please check your email and password
            </div>
          )}
        </div>
      )}
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        textAlign: 'center'
      }}>
        <strong>Development Mode:</strong> Try the demo credentials below
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="Enter your password"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              background: loading ? 'rgba(76, 175, 80, 0.5)' : '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {loading ? '🔄 Logging in...' : '✅ Login'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '12px',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ❌ Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '15px', color: 'rgba(255,255,255,0.8)' }}>
        <small>Demo credentials:</small><br/>
        <small>🏆 athlete@example.com / athletepass</small><br/>
        <small>💼 sponsor@example.com / sponsorpass</small><br/>
        <small>🏃 fan@example.com / fanpass</small>
      </div>
    </div>
  );
};

export default LoginForm;