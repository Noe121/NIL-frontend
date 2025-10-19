/**
 * Circuit breaker implementation for protecting services
 */

const CircuitState = {
  CLOSED: 'CLOSED',    // Normal operation
  OPEN: 'OPEN',       // No requests allowed
  HALF_OPEN: 'HALF_OPEN' // Testing if service recovered
};

class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000; // 30 seconds
    this.halfOpenTimeout = options.halfOpenTimeout || 10000; // 10 seconds
    this.requestTimeout = options.requestTimeout || 5000; // 5 seconds
    
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.serviceChecks = new Map(); // Track health checks by service
  }

  async executeRequest(request, serviceName) {
    if (this.isOpen()) {
      if (this.canTry()) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error(`Circuit breaker is ${this.state} for ${serviceName}`);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
      
      const response = await request({ signal: controller.signal });
      clearTimeout(timeoutId);

      this.onSuccess(serviceName);
      return response;
    } catch (error) {
      this.onFailure(serviceName);
      throw error;
    }
  }

  isOpen() {
    return this.state === CircuitState.OPEN;
  }

  canTry() {
    if (!this.lastFailureTime) return false;
    const now = Date.now();
    return (now - this.lastFailureTime) > this.resetTimeout;
  }

  onSuccess(serviceName) {
    if (this.state === CircuitState.HALF_OPEN) {
      this.reset();
    }
    
    // Update service health check
    this.serviceChecks.set(serviceName, {
      lastCheck: Date.now(),
      status: 'healthy'
    });
  }

  onFailure(serviceName) {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
    }

    // Update service health check
    this.serviceChecks.set(serviceName, {
      lastCheck: Date.now(),
      status: 'unhealthy',
      failureCount: this.failureCount
    });
  }

  reset() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
    this.lastFailureTime = null;
  }

  getServiceHealth(serviceName) {
    return this.serviceChecks.get(serviceName) || {
      status: 'unknown',
      lastCheck: null
    };
  }
}

// Create circuit breakers for each service
export const serviceBreakers = {
  api: new CircuitBreaker({
    failureThreshold: 5,
    resetTimeout: 30000
  }),
  auth: new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 20000
  }),
  company: new CircuitBreaker({
    failureThreshold: 4,
    resetTimeout: 25000
  }),
  blockchain: new CircuitBreaker({
    failureThreshold: 6,
    resetTimeout: 40000
  })
};

// Wrapper for service requests with circuit breaker
export const withCircuitBreaker = async (serviceName, request) => {
  const breaker = serviceBreakers[serviceName];
  if (!breaker) {
    throw new Error(`No circuit breaker configured for service: ${serviceName}`);
  }

  return breaker.executeRequest(request, serviceName);
};