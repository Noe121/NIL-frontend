import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { config } from '../utils/config';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(config.auth.storageKey);
        if (token) {
          const userData = await authService.getCurrentUser();
          if (userData.success) {
            setUser(userData.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(config.auth.storageKey);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem(config.auth.storageKey);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem(config.auth.storageKey, token);
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
      localStorage.removeItem(config.auth.storageKey);
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
