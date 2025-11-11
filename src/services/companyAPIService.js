/**
 * companyAPIService.js
 * NILBx - Company API Integration for Frontend
 *
 * Bot prevention and compliance checking service
 * Integrates with Company API (Port 8003)
 */

const COMPANY_API_URL = 'http://localhost:8003';

/**
 * Company API Service
 * Provides bot prevention, compliance checking, and security features
 */
class CompanyAPIService {
  constructor() {
    this.isVerified = false;
    this.riskScore = 0.0;
    this.lastVerificationDate = null;
  }

  /**
   * Gather device information for validation
   * @returns {Object} Device information
   */
  getDeviceInfo() {
    return {
      platform: 'Web',
      os_version: navigator.platform,
      app_version: '1.0.0', // TODO: Get from package.json
      device_model: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      locale: navigator.language
    };
  }

  /**
   * Get current timestamp in ISO 8601 format
   * @returns {string} ISO timestamp
   */
  getCurrentTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Validate that the user is human (not a bot)
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Validation response
   */
  async validateHuman(userId) {
    try {
      const deviceInfo = this.getDeviceInfo();

      const response = await fetch(`${COMPANY_API_URL}/api/v1/users/validate-human`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          device_token: null, // Web doesn't have device token
          device_info: deviceInfo,
          timestamp: this.getCurrentTimestamp()
        })
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Update state
      this.isVerified = data.is_human;
      this.riskScore = data.risk_score;
      this.lastVerificationDate = Date.now();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error validating human:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if a deal is compliant with NIL regulations
   * @param {number} dealId - Deal ID
   * @param {number} userId - User ID
   * @param {Object} dealDetails - Deal details
   * @returns {Promise<Object>} Compliance check response
   */
  async checkDealCompliance(dealId, userId, dealDetails) {
    try {
      const response = await fetch(`${COMPANY_API_URL}/api/v1/deals/${dealId}/compliance-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deal_id: dealId,
          user_id: userId,
          deal_details: dealDetails
        })
      });

      if (!response.ok) {
        throw new Error(`Compliance check failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error checking compliance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check rate limit for user action
   * @param {number} userId - User ID
   * @param {string} action - Action name
   * @returns {Promise<Object>} Rate limit check response
   */
  async checkRateLimit(userId, action) {
    try {
      const response = await fetch(`${COMPANY_API_URL}/api/v1/rate-limit/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          action,
          timestamp: this.getCurrentTimestamp()
        })
      });

      if (response.status === 429) {
        return {
          success: true,
          allowed: false,
          message: 'Rate limit exceeded'
        };
      }

      if (!response.ok) {
        throw new Error(`Rate limit check failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        allowed: data.allowed,
        message: data.message || 'OK'
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Report suspicious activity
   * @param {number} userId - User ID
   * @param {string} activityType - Activity type
   * @param {Object} details - Activity details
   * @returns {Promise<Object>} Response
   */
  async reportSuspiciousActivity(userId, activityType, details) {
    try {
      const response = await fetch(`${COMPANY_API_URL}/api/v1/security/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          activity_type: activityType,
          details,
          timestamp: this.getCurrentTimestamp(),
          platform: 'Web'
        })
      });

      if (!response.ok) {
        throw new Error(`Report failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error reporting activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify CAPTCHA (reCAPTCHA v3)
   * @param {string} token - reCAPTCHA token
   * @param {string} action - Action name
   * @returns {Promise<Object>} Verification response
   */
  async verifyCaptcha(token, action) {
    try {
      const response = await fetch(`${COMPANY_API_URL}/api/v1/captcha/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          action
        })
      });

      if (!response.ok) {
        throw new Error(`CAPTCHA verification failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error verifying CAPTCHA:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Request reCAPTCHA v3 token
   * @param {string} action - Action name
   * @returns {Promise<string>} reCAPTCHA token
   */
  async getReCaptchaToken(action) {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.REACT_APP_RECAPTCHA_SITE_KEY, { action })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  /**
   * Validate user with reCAPTCHA
   * @param {number} userId - User ID
   * @param {string} action - Action name
   * @returns {Promise<Object>} Combined validation response
   */
  async validateWithCaptcha(userId, action) {
    try {
      // Get reCAPTCHA token
      const captchaToken = await this.getReCaptchaToken(action);

      // Verify CAPTCHA
      const captchaResult = await this.verifyCaptcha(captchaToken, action);

      if (!captchaResult.success || !captchaResult.data.success) {
        return {
          success: false,
          error: 'CAPTCHA verification failed'
        };
      }

      // Validate human
      return await this.validateHuman(userId);
    } catch (error) {
      console.error('Error validating with CAPTCHA:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user needs re-verification (every 24 hours)
   * @returns {boolean} Whether re-verification is needed
   */
  needsReVerification() {
    if (!this.lastVerificationDate) {
      return true;
    }

    const hoursSinceVerification = (Date.now() - this.lastVerificationDate) / 3600000;
    return hoursSinceVerification >= 24;
  }

  /**
   * Get risk level string from score
   * @returns {string} Risk level
   */
  getRiskLevel() {
    if (this.riskScore < 0.3) return 'Low';
    if (this.riskScore < 0.7) return 'Medium';
    return 'High';
  }

  /**
   * Get risk color for UI
   * @returns {string} Color code
   */
  getRiskColor() {
    if (this.riskScore < 0.3) return '#4CAF50'; // Green
    if (this.riskScore < 0.7) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }

  /**
   * Track user interaction for bot detection
   * @param {Object} interaction - Interaction data
   */
  trackInteraction(interaction) {
    // Store interaction data for pattern analysis
    const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
    interactions.push({
      ...interaction,
      timestamp: Date.now()
    });

    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.shift();
    }

    localStorage.setItem('user_interactions', JSON.stringify(interactions));
  }

  /**
   * Analyze user behavior patterns
   * @returns {Object} Behavior analysis
   */
  analyzeBehavior() {
    const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');

    if (interactions.length === 0) {
      return {
        suspiciousPatterns: [],
        score: 0
      };
    }

    const suspiciousPatterns = [];
    let suspicionScore = 0;

    // Check for rapid-fire clicks
    const rapidClicks = interactions.filter((int, idx) => {
      if (idx === 0) return false;
      const prevInt = interactions[idx - 1];
      return int.timestamp - prevInt.timestamp < 100;
    });

    if (rapidClicks.length > 10) {
      suspiciousPatterns.push('Rapid clicking detected');
      suspicionScore += 0.3;
    }

    // Check for consistent timing patterns (bot-like behavior)
    const timings = interactions.map((int, idx) => {
      if (idx === 0) return 0;
      return int.timestamp - interactions[idx - 1].timestamp;
    });

    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    const variance = timings.reduce((sum, timing) => {
      return sum + Math.pow(timing - avgTiming, 2);
    }, 0) / timings.length;

    if (variance < 1000 && interactions.length > 20) {
      suspiciousPatterns.push('Consistent timing pattern');
      suspicionScore += 0.4;
    }

    return {
      suspiciousPatterns,
      score: Math.min(suspicionScore, 1.0)
    };
  }

  /**
   * Clear verification state
   */
  clearVerification() {
    this.isVerified = false;
    this.riskScore = 0.0;
    this.lastVerificationDate = null;
  }
}

// Create and export singleton instance
const companyAPIService = new CompanyAPIService();

export default companyAPIService;

// Export activity types as constants
export const ActivityTypes = {
  SUSPICIOUS_LOGIN: 'suspicious_login',
  MULTIPLE_FAILED_ATTEMPTS: 'multiple_failed_attempts',
  UNUSUAL_BEHAVIOR: 'unusual_behavior',
  RAPID_API_CALLS: 'rapid_api_calls',
  INVALID_DATA: 'invalid_data',
  SCRAPING_DETECTED: 'scraping_detected'
};

// Export compliance categories
export const ComplianceCategories = {
  NCAA: 'ncaa',
  STATE_LAW: 'state_law',
  SCHOOL_POLICY: 'school_policy',
  CONTRACT: 'contract',
  TAX: 'tax',
  DISCLOSURE: 'disclosure'
};
