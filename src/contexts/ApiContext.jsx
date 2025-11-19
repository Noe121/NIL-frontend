import React, { createContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import config, { IS_DEV } from '../utils/config';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [healthStatus, setHealthStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const shouldRunHealthCheck = IS_DEV || config.ui.debugMode;

  useEffect(() => {
    // Only run health checks locally or when explicitly enabled
    if (shouldRunHealthCheck) {
      checkHealth();
    } else {
      setHealthStatus({ disabled: true });
    }
  }, [shouldRunHealthCheck]);

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
