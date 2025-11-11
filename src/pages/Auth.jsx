import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import FormField from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import { validators } from '../utils/validation.js';
import { config } from '../utils/config.js';
import { authService } from '../services/authService.js';

export default function Auth() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, loading } = useAuth();

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
      const result = await authService.login({
        email: form.email,
        password: form.password
      });

      if (result.success) {
        // Extract user info from token
        const userData = {
          id: result.user.id,
          email: result.user.email || form.email,
          role: result.user.role || result.role,
          name: result.user.name || result.user.email?.split('@')[0]
        };

        console.log('Login successful, userData:', userData);
        console.log('Role from result:', result.role);
        console.log('Role from result.user:', result.user.role);

        login(result.token, userData);

        // Redirect based on user role
        const roleRoutes = {
          athlete: '/dashboard/athlete',
          student_athlete: '/dashboard/athlete', // Map student_athlete to athlete dashboard
          influencer: '/dashboard/influencer',
          sponsor: '/dashboard/sponsor',
          fan: '/dashboard/fan',
          admin: '/dashboard/athlete' // Default to athlete dashboard for admin
        };

        const redirectPath = roleRoutes[userData.role] || '/dashboard/athlete';
        console.log('Redirecting to:', redirectPath, 'for role:', userData.role);
        
        navigate(redirectPath);
      } else {
        setErrors({ submit: result.error || 'Login failed' });
      }
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again.' });
    }
  };

  return (
    <div data-testid="auth-page" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
