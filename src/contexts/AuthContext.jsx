import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('nilbx_token_per_service');
        if (token) {
          const userData = await authService.getCurrentUser();
          if (userData.success) {
            setUser(userData.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('nilbx_token_per_service');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('nilbx_token_per_service');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('nilbx_token_per_service', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('nilbx_token_per_service');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};