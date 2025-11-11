/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */

import { config } from '../utils/config.js';

class AuthService {
  constructor() {
    this.baseUrl = config.authServiceUrl;  // Use full URL from config instead of proxy path
    this.tokenKey = config.auth.storageKey;
    this.sessionTimeout = config.auth.sessionTimeout;
  }

  /**
   * Login user with email/username and password
   */
  async login(credentials) {
    try {
      console.log('Attempting login with auth service URL:', this.baseUrl);
      
      // Use form data for OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', credentials.email || credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData
      });      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      
      if (data.access_token) {
        this.setToken(data.access_token);
        
        // Set session timeout
        if (this.sessionTimeout > 0) {
          this.setSessionTimeout();
        }

        // Extract user info from token
        const user = this.getUserFromToken();
        const role = this.getRoleFromToken();

        console.log('Login response data:', data);
        console.log('Extracted user:', user);
        console.log('Extracted role:', role);

        return {
          success: true,
          user: user,
          token: data.access_token,
          role: role
        };
      }

      throw new Error('No access token received');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      console.log('Sending registration request:', userData);
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Registration successful!',
        ...data
      };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message ||
                         error.message ||
                         'Registration failed. Please try again.';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      const token = this.getToken();
      
      if (token) {
        // Call backend logout endpoint
        await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      this.clearToken();
      this.clearSessionTimeout();
    }

    return { success: true };
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      const token = this.getToken();
      
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(`${this.baseUrl}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          return { success: false, error: 'Token expired' };
        }
        throw new Error('Failed to fetch user profile');
      }

      const user = await response.json();
      
      return {
        success: true,
        user,
        role: user.role
      };
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearToken();
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.access_token) {
        this.setToken(data.access_token);
        return { success: true, token: data.access_token };
      }

      throw new Error('No access token received');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearToken();
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Change user password
   */
  async changePassword(passwordData) {
    try {
      const response = await fetch(`${this.baseUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Password change failed');
      }

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${this.baseUrl}/password-reset-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Password reset request failed');
      }

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${this.baseUrl}/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password: newPassword })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Password reset failed');
      }

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Token management methods
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        this.clearToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.clearToken();
      return false;
    }
  }

  getRoleFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT payload:', payload);
      console.log('Role from token:', payload.role);
      return payload.role || null;
    } catch (error) {
      console.error('Token role extraction error:', error);
      return null;
    }
  }

  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id || payload.sub,
        email: payload.sub, // sub contains the email
        role: payload.role,
        name: payload.name
      };
    } catch (error) {
      console.error('Token user extraction error:', error);
      return null;
    }
  }

  // Session timeout management
  setSessionTimeout() {
    this.clearSessionTimeout();
    
    this.sessionTimeoutId = setTimeout(() => {
      console.log('Session timeout reached, logging out...');
      this.logout();
    }, this.sessionTimeout);
  }

  clearSessionTimeout() {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
  }

  extendSession() {
    if (this.isAuthenticated() && this.sessionTimeout > 0) {
      this.setSessionTimeout();
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;