/**
 * socialVerificationService.js
 * NILBx - Social Media Verification Service for Frontend
 *
 * Centralized service for verifying social media posts
 * Integrates with Social Verification Service (Port 8013)
 */

const SOCIAL_VERIFICATION_SERVICE_URL = 'http://localhost:8013';

/**
 * Social Verification Service
 * Verifies Instagram, TikTok, Twitter posts for deliverable compliance
 */
class SocialVerificationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    this.supportedPlatforms = ['instagram', 'tiktok', 'twitter', 'youtube', 'facebook'];
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

  // MARK: - URL Validation & Detection

  /**
   * Detect social media platform from URL
   * @param {string} url - Social media post URL
   * @returns {string|null} Platform name or null
   */
  detectPlatform(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      if (hostname.includes('instagram.com')) return 'instagram';
      if (hostname.includes('tiktok.com')) return 'tiktok';
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
      if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'facebook';

      return null;
    } catch (error) {
      console.error('Error detecting platform:', error);
      return null;
    }
  }

  /**
   * Validate social media URL format
   * @param {string} url - Social media post URL
   * @returns {Object} Validation result
   */
  validateSocialURL(url) {
    const errors = [];

    if (!url || typeof url !== 'string') {
      return { valid: false, errors: ['Invalid URL'] };
    }

    // Check if it's a valid URL
    try {
      new URL(url);
    } catch (error) {
      return { valid: false, errors: ['Invalid URL format'] };
    }

    // Detect platform
    const platform = this.detectPlatform(url);
    if (!platform) {
      errors.push('URL is not from a supported platform');
      return { valid: false, errors };
    }

    // Platform-specific validation
    if (platform === 'instagram') {
      if (!url.includes('/p/') && !url.includes('/reel/')) {
        errors.push('Invalid Instagram post URL format');
      }
    } else if (platform === 'tiktok') {
      if (!url.includes('/video/') && !url.includes('/@')) {
        errors.push('Invalid TikTok video URL format');
      }
    } else if (platform === 'twitter') {
      if (!url.includes('/status/')) {
        errors.push('Invalid Twitter post URL format');
      }
    }

    return {
      valid: errors.length === 0,
      platform,
      errors
    };
  }

  // MARK: - Post Verification

  /**
   * Verify a social media post
   * @param {string} postUrl - Social media post URL
   * @param {Object} requirements - Verification requirements
   * @returns {Promise<Object>} Verification result
   */
  async verifyPost(postUrl, requirements = {}) {
    try {
      // Validate URL first
      const validation = this.validateSocialURL(postUrl);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Check cache
      const cacheKey = `${postUrl}_${JSON.stringify(requirements)}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }

      const {
        requiredHashtags = [],
        requiredMentions = [],
        dealAcceptedAt = null,
        minEngagement = null
      } = requirements;

      const response = await fetch(`${SOCIAL_VERIFICATION_SERVICE_URL}/verify-post`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          post_url: postUrl,
          required_hashtags: requiredHashtags,
          required_mentions: requiredMentions,
          deal_accepted_at: dealAcceptedAt,
          min_engagement: minEngagement
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Verification failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the result
      this.setCachedData(cacheKey, data);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error verifying post:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify multiple posts at once
   * @param {Array} posts - Array of {postUrl, requirements} objects
   * @returns {Promise<Object>} Bulk verification results
   */
  async verifyMultiplePosts(posts) {
    try {
      const response = await fetch(`${SOCIAL_VERIFICATION_SERVICE_URL}/verify-posts/bulk`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          posts: posts.map(p => ({
            post_url: p.postUrl,
            required_hashtags: p.requirements?.requiredHashtags || [],
            required_mentions: p.requirements?.requiredMentions || [],
            deal_accepted_at: p.requirements?.dealAcceptedAt || null
          }))
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Bulk verification failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error verifying multiple posts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get post analytics/engagement metrics
   * @param {string} postUrl - Social media post URL
   * @returns {Promise<Object>} Post analytics
   */
  async getPostAnalytics(postUrl) {
    try {
      const validation = this.validateSocialURL(postUrl);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      const response = await fetch(`${SOCIAL_VERIFICATION_SERVICE_URL}/post-analytics`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ post_url: postUrl })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to fetch analytics: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching post analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Account Verification

  /**
   * Verify social media account ownership
   * @param {string} platform - Platform name
   * @param {string} username - Account username
   * @returns {Promise<Object>} Verification result
   */
  async verifyAccountOwnership(platform, username) {
    try {
      if (!this.supportedPlatforms.includes(platform.toLowerCase())) {
        return {
          success: false,
          error: `Platform ${platform} is not supported`
        };
      }

      const response = await fetch(`${SOCIAL_VERIFICATION_SERVICE_URL}/verify-account`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          platform: platform.toLowerCase(),
          username
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Account verification failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error verifying account:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get account metrics (followers, engagement rate, etc.)
   * @param {string} platform - Platform name
   * @param {string} username - Account username
   * @returns {Promise<Object>} Account metrics
   */
  async getAccountMetrics(platform, username) {
    try {
      const response = await fetch(`${SOCIAL_VERIFICATION_SERVICE_URL}/account-metrics`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          platform: platform.toLowerCase(),
          username
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to fetch metrics: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching account metrics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Verification History

  /**
   * Get verification history for a user
   * @param {number} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Verification history
   */
  async getVerificationHistory(userId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.platform) queryParams.append('platform', filters.platform);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.offset) queryParams.append('offset', filters.offset);

      const url = `${SOCIAL_VERIFICATION_SERVICE_URL}/users/${userId}/verifications${
        queryParams.toString() ? `?${queryParams}` : ''
      }`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch verification history: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching verification history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get verification details by ID
   * @param {number} verificationId - Verification ID
   * @returns {Promise<Object>} Verification details
   */
  async getVerification(verificationId) {
    try {
      const response = await fetch(`${SOCIAL_VERIFICATION_SERVICE_URL}/verifications/${verificationId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch verification: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching verification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Helper Methods

  /**
   * Extract post ID from URL
   * @param {string} url - Social media post URL
   * @returns {string|null} Post ID
   */
  extractPostId(url) {
    const platform = this.detectPlatform(url);
    if (!platform) return null;

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      if (platform === 'instagram') {
        const match = pathname.match(/\/(p|reel)\/([^\/]+)/);
        return match ? match[2] : null;
      } else if (platform === 'tiktok') {
        const match = pathname.match(/\/video\/(\d+)/);
        return match ? match[1] : null;
      } else if (platform === 'twitter') {
        const match = pathname.match(/\/status\/(\d+)/);
        return match ? match[1] : null;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Format hashtags (add # if missing)
   * @param {Array<string>} hashtags - Array of hashtags
   * @returns {Array<string>} Formatted hashtags
   */
  formatHashtags(hashtags) {
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
  }

  /**
   * Format mentions (add @ if missing)
   * @param {Array<string>} mentions - Array of mentions
   * @returns {Array<string>} Formatted mentions
   */
  formatMentions(mentions) {
    return mentions.map(mention => mention.startsWith('@') ? mention : `@${mention}`);
  }

  /**
   * Get platform icon
   * @param {string} platform - Platform name
   * @returns {string} Icon name/emoji
   */
  getPlatformIcon(platform) {
    const icons = {
      instagram: '📷',
      tiktok: '🎵',
      twitter: '🐦',
      youtube: '📺',
      facebook: '👍'
    };
    return icons[platform.toLowerCase()] || '🌐';
  }

  /**
   * Get platform color
   * @param {string} platform - Platform name
   * @returns {string} Color code
   */
  getPlatformColor(platform) {
    const colors = {
      instagram: '#E4405F',
      tiktok: '#000000',
      twitter: '#1DA1F2',
      youtube: '#FF0000',
      facebook: '#1877F2'
    };
    return colors[platform.toLowerCase()] || '#757575';
  }

  /**
   * Get verification status color
   * @param {string} status - Verification status
   * @returns {string} Color code
   */
  getStatusColor(status) {
    const colors = {
      verified: '#4CAF50',
      pending: '#FF9800',
      failed: '#F44336',
      partial: '#FFC107'
    };
    return colors[status] || '#757575';
  }

  /**
   * Get verification status label
   * @param {string} status - Verification status
   * @returns {string} Human-readable label
   */
  getStatusLabel(status) {
    const labels = {
      verified: 'Verified ✓',
      pending: 'Pending...',
      failed: 'Failed ✗',
      partial: 'Partially Verified'
    };
    return labels[status] || status;
  }

  /**
   * Format engagement rate
   * @param {number} rate - Engagement rate (0-1)
   * @returns {string} Formatted percentage
   */
  formatEngagementRate(rate) {
    return `${(rate * 100).toFixed(2)}%`;
  }

  /**
   * Format follower count
   * @param {number} count - Follower count
   * @returns {string} Formatted count (e.g., 1.2K, 45.3M)
   */
  formatFollowerCount(count) {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
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
}

// Create and export singleton instance
const socialVerificationService = new SocialVerificationService();

export default socialVerificationService;

// Export platform constants
export const SocialPlatforms = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  TWITTER: 'twitter',
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook'
};

// Export verification statuses
export const VerificationStatuses = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  FAILED: 'failed',
  PARTIAL: 'partial'
};
