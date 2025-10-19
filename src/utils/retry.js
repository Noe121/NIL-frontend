/**
 * Retry utility for handling temporary service outages and network issues
 */

const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1000, // Start with 1 second delay
  maxDelay: 10000,    // Maximum 10 second delay
  backoffFactor: 2,   // Exponential backoff multiplier
  timeout: 15000,     // Request timeout
  retryableStatuses: [408, 429, 502, 503, 504], // Retry on these HTTP status codes
};

/**
 * Sleep utility for delay between retries
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate delay with exponential backoff and jitter
 */
const calculateDelay = (attempt, config) => {
  const delay = Math.min(
    config.initialDelay * Math.pow(config.backoffFactor, attempt - 1),
    config.maxDelay
  );
  // Add random jitter (±20%) to prevent thundering herd
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return delay + jitter;
};

/**
 * Check if an error or response should trigger a retry
 */
const shouldRetry = (error, response, config) => {
  // Network-level errors should be retried
  if (error) {
    return true;
  }

  // Retry on specific HTTP status codes
  if (response && config.retryableStatuses.includes(response.status)) {
    return true;
  }

  return false;
};

/**
 * Retry wrapper for fetch requests
 */
export const retryFetch = async (url, options = {}, retryConfig = {}) => {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  let lastError = null;
  let attempt = 1;

  while (attempt <= config.maxAttempts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!shouldRetry(null, response, config)) {
        return response;
      }

      lastError = new Error(`Received status ${response.status}`);
    } catch (error) {
      lastError = error;

      if (error.name === 'AbortError') {
        console.warn(`Request timeout on attempt ${attempt}`);
      }
    }

    if (attempt < config.maxAttempts) {
      const delay = calculateDelay(attempt, config);
      console.warn(`Retry attempt ${attempt}/${config.maxAttempts} after ${delay}ms`);
      await sleep(delay);
    }

    attempt++;
  }

  throw lastError;
};

/**
 * Retry wrapper for API requests with automatic token refresh
 */
export const retryWithRefresh = async (url, options = {}, retryConfig = {}) => {
  try {
    const response = await retryFetch(url, options, retryConfig);

    // If unauthorized and we have a refresh token, try to refresh and retry
    if (response.status === 401) {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        // Update Authorization header with new token
        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${localStorage.getItem('nilbx_token')}`
          }
        };
        return retryFetch(url, newOptions, retryConfig);
      }
    }

    return response;
  } catch (error) {
    console.error('Request failed after retries:', error);
    throw error;
  }
};

/**
 * Refresh auth token if possible
 */
const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem('nilbx_refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await retryFetch('/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('nilbx_token', token);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};