import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext.jsx';
import FormField from './components/FormField.jsx';
import Button from './components/Button.jsx';
import { validators } from './utils/validation.js';
import { config } from './utils/config.js';

export default function Auth() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, loading } = useUser();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!validators.email(form.email).isValid) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${config.authServiceUrl}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Decode token to get user info
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));
        const userData = {
          id: payload.sub,
          email: payload.email || form.email,
          role: payload.role,
          name: payload.name || payload.email?.split('@')[0]
        };
        
        login(data.access_token, userData);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.detail || 'Login failed' });
      }
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your NIL account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoFocus
            validate={validators.email}
            icon="📧"
          />
          
          <FormField
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            icon="🔒"
          />

          {errors.submit && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Forgot your password?
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              size="large"
              fullWidth
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
            
            <Button
              variant="ghost"
              size="large"
              fullWidth
              onClick={() => navigate('/register/multi-step')}
            >
              Multi-Step Registration
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
