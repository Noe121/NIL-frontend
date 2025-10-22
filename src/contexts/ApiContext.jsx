import React, { createContext, useState, useEffect } from 'react';
import apiService from '../services/api';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [healthStatus, setHealthStatus] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check service health on mount
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await apiService.checkHealth();
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({ error: 'Health check failed' });
    }
  };

  const value = {
    apiService,
    healthStatus,
    loading,
    setLoading,
    checkHealth
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};