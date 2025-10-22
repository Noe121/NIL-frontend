/**
 * Configuration utility for dual-mode frontend development
 * Handles both standalone and centralized modes with automatic detection
 */
import React from 'react';

// Safe environment detection with fallbacks
const getEnvVar = (key, fallback = null) => {
  try {
    if (key === 'VITE_MODE') {
      // Force per-service mode in development
      const isDev = import.meta?.env?.DEV || process.env.NODE_ENV === 'development';
      if (isDev) {
        console.log('🚀 Running in development per-service mode');
        return 'per-service';
      }
    }
    const value = import.meta?.env?.[key];
    console.log(`🔍 getEnvVar(${key}):`, value, 'fallback:', fallback);
    return value ?? fallback;
  } catch (error) {
    console.log(`❌ getEnvVar error for ${key}:`, error);
    return fallback;
  }
};

// Debug: log all VITE env vars
console.log('🔍 All VITE env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

// Environment detection with more robust fallbacks
export const APP_MODE = (() => {
  const mode = getEnvVar('VITE_MODE') || 'standalone';
  console.log('🔍 Detected mode:', mode);
  return mode;
})();

export const IS_STANDALONE = APP_MODE === 'standalone';
export const IS_CENTRALIZED = APP_MODE === 'centralized';
export const IS_PER_SERVICE = APP_MODE === 'per-service';

// Development/Production detection with multiple checks
export const IS_DEV = (() => {
  const isDev = getEnvVar('NODE_ENV') === 'development' || 
                getEnvVar('DEV') === true ||
                window.location.hostname === 'localhost';
  console.log('🔍 Development mode:', isDev);
  return isDev;
})();

export const IS_PROD = !IS_DEV;

// API Configuration
const getApiConfig = () => {
  const config = {
    mode: APP_MODE,
    isStandalone: IS_STANDALONE,
    isCentralized: IS_CENTRALIZED,
    isPerService: IS_PER_SERVICE,
    isDev: IS_DEV,
    isProd: IS_PROD,
    
    // API Endpoints with environment-aware fallbacks
    apiUrl: IS_PROD 
      ? (getEnvVar('VITE_API_URL') || 'https://yt896q3bx4.execute-api.us-east-1.amazonaws.com/prod')
      : (getEnvVar('VITE_API_URL') || (IS_CENTRALIZED ? 'http://localhost:8000' : IS_PER_SERVICE ? 'http://localhost:8001' : 'http://localhost:8002')),
    authServiceUrl: IS_PROD 
      ? (getEnvVar('VITE_AUTH_SERVICE_URL') || 'https://yt896q3bx4.execute-api.us-east-1.amazonaws.com/prod/auth')
      : (getEnvVar('VITE_AUTH_SERVICE_URL') || 'http://localhost:9000'),
    companyApiUrl: IS_PROD 
      ? (getEnvVar('VITE_COMPANY_API_URL') || 'https://yt896q3bx4.execute-api.us-east-1.amazonaws.com/prod/api/company')
      : (getEnvVar('VITE_COMPANY_API_URL') || 'http://localhost:8002'),
    
    // Blockchain configuration (centralized mode only)
    blockchainServiceUrl: IS_CENTRALIZED 
      ? (getEnvVar('VITE_BLOCKCHAIN_SERVICE_URL') || (IS_PROD 
        ? 'https://blockchain.nilbx.com' 
        : 'http://localhost:8545')) 
      : null,
    blockchainRpcUrl: IS_CENTRALIZED 
      ? (getEnvVar('VITE_BLOCKCHAIN_RPC_URL') || (IS_PROD
        ? 'https://rpc.nilbx.com'
        : 'http://localhost:8545'))
      : null,
    
    // Blockchain contract addresses
    blockchain: IS_CENTRALIZED ? {
      chainId: getEnvVar('VITE_CHAIN_ID') || '31337', // Hardhat default
      rpcUrl: getEnvVar('VITE_BLOCKCHAIN_RPC_URL') || 'http://localhost:8545',
      contracts: {
        playerLegacyNFT: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        sponsorshipContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
      }
    } : null,
    
    // Feature flags
    features: {
      blockchain: IS_CENTRALIZED && (getEnvVar('VITE_ENABLE_BLOCKCHAIN') === 'true'),
      smartContracts: IS_CENTRALIZED && (getEnvVar('VITE_ENABLE_SMART_CONTRACTS') === 'true'),
      nftMinting: IS_CENTRALIZED && (getEnvVar('VITE_ENABLE_NFT_MINTING') === 'true'),
      advancedAnalytics: getEnvVar('VITE_ENABLE_ADVANCED_ANALYTICS') === 'true',
      socialIntegration: getEnvVar('VITE_ENABLE_SOCIAL_INTEGRATION') !== 'false',
      crossServiceCommunication: IS_CENTRALIZED && (getEnvVar('VITE_ENABLE_CROSS_SERVICE_COMMUNICATION') === 'true'),
      realTimeUpdates: IS_CENTRALIZED && (getEnvVar('VITE_ENABLE_REAL_TIME_UPDATES') === 'true'),
      roleSwitch: getEnvVar('VITE_ENABLE_ROLE_SWITCHING') !== 'false',
      perServiceDatabases: IS_PER_SERVICE,
      traditionalPayments: getEnvVar('VITE_ENABLE_TRADITIONAL_PAYMENTS') === 'true',
      blockchainPayments: getEnvVar('VITE_ENABLE_BLOCKCHAIN_PAYMENTS') === 'true'
    },
    
    // Authentication settings
    auth: {
      storageKey: getEnvVar('VITE_JWT_STORAGE_KEY') || `nilbx_token_${APP_MODE}`,
      sessionTimeout: parseInt(getEnvVar('VITE_SESSION_TIMEOUT') || '3600000'),
      enableSSO: IS_CENTRALIZED && (getEnvVar('VITE_ENABLE_SSO') === 'true')
    },
    
    // UI/UX settings
    ui: {
      theme: getEnvVar('VITE_THEME') || APP_MODE,
      pageSize: parseInt(getEnvVar('VITE_DEFAULT_PAGE_SIZE') || '10'),
      apiTimeout: parseInt(getEnvVar('VITE_API_TIMEOUT') || '5000'),
      debugMode: getEnvVar('VITE_DEBUG_MODE') === 'true'
    },
    
    // Development settings
    dev: {
      enableMockData: IS_DEV && (getEnvVar('VITE_ENABLE_MOCK_DATA') === 'true'),
      port: IS_CENTRALIZED ? 5174 : IS_PER_SERVICE ? 5175 : 5173,
      previewPort: IS_CENTRALIZED ? 4174 : IS_PER_SERVICE ? 4175 : 4173
    }
  };
  
  return config;
};

// Global configuration object
export const config = getApiConfig();

// Logging helper
export const logConfig = () => {
  if (config.ui.debugMode) {
    console.group(`🚀 Frontend Configuration (${APP_MODE} mode)`);
    console.log('📡 API URL:', config.apiUrl);
    console.log('🔐 Auth Service:', config.authServiceUrl);
    console.log('🏢 Company API:', config.companyApiUrl);
    if (config.blockchainServiceUrl) {
      console.log('⛓️  Blockchain Service:', config.blockchainServiceUrl);
    }
    console.log('🎯 Features:', config.features);
    console.log('🎨 UI Theme:', config.ui.theme);
    console.groupEnd();
  }
};

import { retryFetch, retryWithRefresh } from './retry';

// Service health check utility with retries
export const checkServiceHealth = async (serviceName, url) => {
  try {
    const healthUrl = `${url}/health`;
    const response = await retryFetch(healthUrl, {
      method: 'GET',
    }, {
      maxAttempts: 3,
      initialDelay: 1000,
      timeout: config.ui.apiTimeout
    });
    
    if (response.ok) {
      const data = await response.json();
      if (config.ui.debugMode) {
        console.log(`✅ ${serviceName} health check passed:`, data);
      }
      return { status: 'healthy', data };
    } else {
      console.warn(`⚠️  ${serviceName} health check failed:`, response.status);
      return { status: 'unhealthy', error: response.status };
    }
  } catch (error) {
    console.warn(`❌ ${serviceName} health check error:`, error.message);
    return { status: 'error', error: error.message };
  }
};

// Initialize configuration and perform health checks
export const initializeApp = async () => {
  logConfig();
  
  if (config.ui.debugMode) {
    console.log('🏁 Initializing application...');
    
    // Perform health checks
    const healthChecks = [
      checkServiceHealth('API Service', config.apiUrl),
      checkServiceHealth('Auth Service', config.authServiceUrl),
      checkServiceHealth('Company API', config.companyApiUrl)
    ];
    
    if (config.blockchainServiceUrl) {
      healthChecks.push(checkServiceHealth('Blockchain Service', config.blockchainServiceUrl));
    }
    
    const results = await Promise.allSettled(healthChecks);
    console.log('🏥 Health check results:', results);
  }
};

import { withCircuitBreaker } from './circuitBreaker';

// API request helper with automatic endpoint detection, retries, and circuit breaker
export const createApiRequest = async (endpoint, options = {}) => {
  // Determine service and base URL
  const service = endpoint.startsWith('/auth') ? 'auth' :
                  endpoint.startsWith('/company') ? 'company' :
                  endpoint.startsWith('/blockchain') ? 'blockchain' :
                  'api';
  
  const baseUrl = endpoint.startsWith('/auth') ? config.authServiceUrl :
                  endpoint.startsWith('/company') ? config.companyApiUrl :
                  endpoint.startsWith('/blockchain') ? config.blockchainServiceUrl :
                  config.apiUrl;
  
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions = {
    timeout: config.ui.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  // Add authentication token if available
  const token = localStorage.getItem(config.auth.storageKey);
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  // Create request function
  const makeRequest = async ({ signal } = {}) => {
    const requestOptions = { ...defaultOptions, ...options, signal };

    // Use retry with refresh for authenticated endpoints
    if (token) {
      return retryWithRefresh(url, requestOptions, {
        maxAttempts: 3,
        initialDelay: 1000,
        timeout: config.ui.apiTimeout,
        retryableStatuses: [408, 429, 502, 503, 504]
      });
    }
    
    // Use basic retry for non-authenticated endpoints
    return retryFetch(url, requestOptions, {
      maxAttempts: 2,
      initialDelay: 500,
      timeout: config.ui.apiTimeout
    });
  };

  // Wrap with circuit breaker
  return withCircuitBreaker(service, makeRequest);
};

// Export utility functions
export const utils = {
  getApiConfig,
  logConfig,
  checkServiceHealth,
  initializeApp,
  createApiRequest,
  
  // Mode detection helpers
  isStandalone: () => IS_STANDALONE,
  isCentralized: () => IS_CENTRALIZED,
  isPerService: () => IS_PER_SERVICE,
  hasFeature: (featureName) => config.features[featureName] || false,
  
  // Storage helpers
  getAuthToken: () => localStorage.getItem(config.auth.storageKey),
  setAuthToken: (token) => localStorage.setItem(config.auth.storageKey, token),
  clearAuthToken: () => localStorage.removeItem(config.auth.storageKey),
  
  // Environment helpers
  isDevelopment: () => IS_DEV,
  isProduction: () => IS_PROD
};

// Export functions expected by validation script
export { getApiConfig };

// Additional validation script expected functions
export const isBlockchainEnabled = () => {
  return config.features.blockchain || false;
};

export const makeApiRequest = async (endpoint, options = {}) => {
  try {
    const response = await createApiRequest(endpoint, options);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Config hook for React components
export const useConfig = () => {
  const memoizedConfig = React.useMemo(() => config, []);
  return memoizedConfig;
};

// Initialize app on import
if (typeof window !== 'undefined') {
  initializeApp();
  
  // Debug information in development
  if (IS_DEV) {
    console.group('🚀 Frontend Configuration');
    console.log('Mode:', APP_MODE);
    console.log('Environment:', IS_DEV ? 'development' : 'production');
    console.log('API URL:', config.apiUrl);
    console.log('Auth URL:', config.authServiceUrl);
    console.log('Features:', config.features);
    console.groupEnd();
  }
}

export default config;