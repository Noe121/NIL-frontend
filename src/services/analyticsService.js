/**
 * analyticsService.js
 * NILBx - Analytics & Performance Tracking for Frontend
 *
 * Comprehensive analytics for deals, deliverables, and user performance
 * Integrates with Analytics Service (Port 8006) and Advanced Analytics (Port 8016)
 */

const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:8006';
const ADVANCED_ANALYTICS_URL = import.meta.env.VITE_ADVANCED_ANALYTICS_URL || 'http://localhost:8016';

/**
 * Analytics Service
 * Provides comprehensive analytics and performance tracking
 */
class AnalyticsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.eventQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Get authentication token
   * @returns {string|null} JWT token
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Get authorization headers
   * @returns {Object} Headers with auth token
   */
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // MARK: - Basic Analytics (Port 8006)

  /**
   * Get dashboard summary for user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Dashboard summary
   */
  async getDashboardSummary(userId) {
    try {
      const cacheKey = `dashboard_${userId}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }

      const response = await fetch(`${ANALYTICS_URL}/analytics/dashboard/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard summary: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get analytics for a specific deal
   * @param {number} dealId - Deal ID
   * @returns {Promise<Object>} Deal analytics
   */
  async getDealAnalytics(dealId) {
    try {
      const cacheKey = `deal_analytics_${dealId}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }

      const response = await fetch(`${ANALYTICS_URL}/analytics/deals/${dealId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch deal analytics: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching deal analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user performance metrics
   * @param {number} userId - User ID
   * @param {string} period - Time period (7d, 30d, 90d, 365d)
   * @returns {Promise<Object>} Performance metrics
   */
  async getUserPerformance(userId, period = '30d') {
    try {
      const cacheKey = `user_performance_${userId}_${period}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }

      const response = await fetch(`${ANALYTICS_URL}/analytics/users/${userId}/performance?period=${period}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user performance: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching user performance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get platform-specific metrics
   * @param {number} userId - User ID
   * @param {string} platform - Platform name (instagram, tiktok, twitter, etc.)
   * @returns {Promise<Object>} Platform metrics
   */
  async getPlatformMetrics(userId, platform) {
    try {
      const cacheKey = `platform_metrics_${userId}_${platform}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }

      const response = await fetch(`${ANALYTICS_URL}/analytics/users/${userId}/platforms/${platform}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch platform metrics: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching platform metrics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Track event
   * @param {number} userId - User ID
   * @param {string} eventType - Event type
   * @param {Object} eventData - Event data
   * @param {boolean} immediate - Whether to send immediately or queue
   * @returns {Promise<Object>} Response
   */
  async trackEvent(userId, eventType, eventData, immediate = false) {
    const event = {
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      timestamp: new Date().toISOString()
    };

    if (immediate) {
      return this.sendEvent(event);
    } else {
      // Queue event for batch processing
      this.eventQueue.push(event);
      if (!this.isProcessingQueue) {
        this.processEventQueue();
      }
      return { success: true, queued: true };
    }
  }

  /**
   * Send event to server
   * @param {Object} event - Event object
   * @returns {Promise<Object>} Response
   */
  async sendEvent(event) {
    try {
      const response = await fetch(`${ANALYTICS_URL}/analytics/events`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error(`Failed to track event: ${response.statusText}`);
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error tracking event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process queued events in batches
   */
  async processEventQueue() {
    if (this.isProcessingQueue || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    // Process events in batches every 10 seconds
    while (this.eventQueue.length > 0) {
      const batch = this.eventQueue.splice(0, 10); // Process 10 at a time

      for (const event of batch) {
        await this.sendEvent(event);
      }

      if (this.eventQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      }
    }

    this.isProcessingQueue = false;
  }

  // MARK: - Advanced Analytics with ML (Port 8016)

  /**
   * Get AI-powered insights
   * @param {number} userId - User ID
   * @returns {Promise<Object>} AI insights
   */
  async getAIInsights(userId) {
    try {
      const response = await fetch(`${ADVANCED_ANALYTICS_URL}/ml/insights/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch AI insights: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get predicted earnings
   * @param {number} userId - User ID
   * @param {number} months - Number of months to predict
   * @returns {Promise<Object>} Earnings predictions
   */
  async getPredictedEarnings(userId, months = 3) {
    try {
      const response = await fetch(`${ADVANCED_ANALYTICS_URL}/ml/predict-earnings?user_id=${userId}&months=${months}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch earnings predictions: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching earnings predictions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get content recommendations
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Content recommendations
   */
  async getContentRecommendations(userId) {
    try {
      const response = await fetch(`${ADVANCED_ANALYTICS_URL}/ml/content-recommendations/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch content recommendations: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching content recommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get audience insights
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Audience insights
   */
  async getAudienceInsights(userId) {
    try {
      const response = await fetch(`${ADVANCED_ANALYTICS_URL}/ml/audience-insights/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch audience insights: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching audience insights:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get optimal posting times
   * @param {number} userId - User ID
   * @param {string} platform - Platform name
   * @returns {Promise<Object>} Optimal posting times
   */
  async getOptimalPostingTimes(userId, platform) {
    try {
      const response = await fetch(`${ADVANCED_ANALYTICS_URL}/ml/optimal-times?user_id=${userId}&platform=${platform}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch optimal posting times: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching optimal posting times:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Helper Methods

  /**
   * Format currency
   * @param {number} amount - Amount in dollars
   * @returns {string} Formatted currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Format percentage
   * @param {number} value - Value (0-1)
   * @returns {string} Formatted percentage
   */
  formatPercentage(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  /**
   * Format large number
   * @param {number} value - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(value) {
    if (value < 1000) {
      return value.toString();
    } else if (value < 1_000_000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
  }

  /**
   * Get performance color based on rate
   * @param {number} rate - Performance rate (0-1)
   * @returns {string} Color code
   */
  getPerformanceColor(rate) {
    if (rate >= 0.8) return '#4CAF50'; // Green
    if (rate >= 0.6) return '#2196F3'; // Blue
    if (rate >= 0.4) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }

  /**
   * Get trend indicator
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   * @returns {Object} Trend info
   */
  getTrendIndicator(current, previous) {
    const change = ((current - previous) / previous) * 100;

    return {
      direction: current > previous ? 'up' : current < previous ? 'down' : 'stable',
      icon: current > previous ? '↗️' : current < previous ? '↘️' : '→',
      label: current > previous ? 'Up' : current < previous ? 'Down' : 'Stable',
      change: Math.abs(change).toFixed(1),
      color: current > previous ? '#4CAF50' : current < previous ? '#F44336' : '#757575'
    };
  }

  /**
   * Calculate engagement rate
   * @param {Object} metrics - Engagement metrics
   * @returns {number} Engagement rate
   */
  calculateEngagementRate(metrics) {
    const { totalLikes = 0, totalComments = 0, totalShares = 0, totalViews = 0 } = metrics;

    if (totalViews === 0) return 0;

    const totalEngagements = totalLikes + totalComments + totalShares;
    return (totalEngagements / totalViews);
  }

  /**
   * Get rating stars
   * @param {number} rating - Rating value (0-5)
   * @returns {string} Star representation
   */
  getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '⭐'.repeat(fullStars) +
           (hasHalfStar ? '½' : '') +
           '☆'.repeat(emptyStars);
  }

  /**
   * Format time period
   * @param {string} period - Period string (7d, 30d, etc.)
   * @returns {string} Human-readable period
   */
  formatPeriod(period) {
    const periodMap = {
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 90 days',
      '365d': 'Last year',
      'all': 'All time'
    };
    return periodMap[period] || period;
  }

  /**
   * Get performance level
   * @param {number} rate - Performance rate (0-1)
   * @returns {Object} Performance level info
   */
  getPerformanceLevel(rate) {
    if (rate >= 0.8) {
      return { level: 'Excellent', icon: '🌟', color: '#4CAF50' };
    } else if (rate >= 0.6) {
      return { level: 'Good', icon: '👍', color: '#2196F3' };
    } else if (rate >= 0.4) {
      return { level: 'Fair', icon: '👌', color: '#FF9800' };
    } else {
      return { level: 'Needs Improvement', icon: '⚠️', color: '#F44336' };
    }
  }

  // MARK: - Cache Management

  /**
   * Check if cached data is still valid
   * @param {string} key - Cache key
   * @returns {boolean} Whether cache is valid
   */
  isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  /**
   * Get cached data
   * @param {string} key - Cache key
   * @returns {any} Cached data or null
   */
  getCachedData(key) {
    if (this.isCacheValid(key)) {
      return this.cache.get(key).data;
    }
    return null;
  }

  /**
   * Set cached data
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   * @param {string} pattern - Optional pattern to match keys
   */
  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Clear event queue
   */
  clearEventQueue() {
    this.eventQueue = [];
  }
}

// Create and export singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;

// Export event types as constants
export const AnalyticsEventType = {
  DEAL_VIEWED: 'deal_viewed',
  DEAL_CREATED: 'deal_created',
  DEAL_ACCEPTED: 'deal_accepted',
  DEAL_COMPLETED: 'deal_completed',
  DELIVERABLE_SUBMITTED: 'deliverable_submitted',
  DELIVERABLE_APPROVED: 'deliverable_approved',
  PAYMENT_RECEIVED: 'payment_received',
  PROFILE_VIEWED: 'profile_viewed',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  PAGE_VIEW: 'page_view',
  BUTTON_CLICKED: 'button_clicked',
  FORM_SUBMITTED: 'form_submitted'
};

// Export time periods
export const TimePeriods = {
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_90_DAYS: '90d',
  LAST_YEAR: '365d',
  ALL_TIME: 'all'
};

// Export platform names
export const Platforms = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  TWITTER: 'twitter',
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook'
};
