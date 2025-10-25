/**
 * Check-in Service
 * Handles geo-location check-ins and social verification for NIL deals
 */

class CheckinService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_CHECKIN_SERVICE_URL || 'http://localhost:8006';
    this.featureFlagUrl = import.meta.env.VITE_FEATURE_FLAG_URL || 'http://localhost:8004';
  }

  /**
   * Get current geolocation position
   * @returns {Promise<GeolocationPosition>}
   */
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { ...defaultOptions, ...options }
      );
    });
  }

  /**
   * Check in at a hotspot for a deal
   * @param {number} dealId - The deal ID
   * @param {number} athleteId - The athlete ID
   * @returns {Promise<Object>} Check-in result
   */
  async checkin(dealId, athleteId) {
    try {
      // Get current location
      const position = await this.getCurrentPosition();

      const checkinData = {
        deal_id: dealId,
        athlete_id: athleteId,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      };

      const response = await fetch(`${this.baseUrl}/checkins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkinData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Check-in failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Check-in error:', error);
      throw error;
    }
  }

  /**
   * Verify social media post for check-in
   * @param {number} checkinId - The check-in ID
   * @param {string} socialUrl - URL to social media post
   * @returns {Promise<Object>} Verification result
   */
  async verifySocialPost(checkinId, socialUrl) {
    try {
      const response = await fetch(`${this.baseUrl}/checkins/${checkinId}/social-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          social_url: socialUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Social verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Social verification error:', error);
      throw error;
    }
  }

  /**
   * Get geo-fences for a deal
   * @param {number} dealId - The deal ID
   * @returns {Promise<Object>} Geo-fences data
   */
  async getGeoFences(dealId) {
    try {
      const response = await fetch(`${this.baseUrl}/geo-fences/${dealId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch geo-fences');
      }

      return await response.json();
    } catch (error) {
      console.error('Geo-fences fetch error:', error);
      throw error;
    }
  }

  /**
   * Check if check-in features are enabled
   * @returns {Promise<Object>} Feature flags
   */
  async getFeatureFlags() {
    try {
      const response = await fetch(`${this.featureFlagUrl}/flags`);

      if (!response.ok) {
        // Return defaults if service unavailable
        return {
          enable_geo_checkins: true,
          enable_social_verification: true,
          enable_auto_payout: true
        };
      }

      return await response.json();
    } catch (error) {
      console.warn('Feature flag service unavailable, using defaults');
      return {
        enable_geo_checkins: true,
        enable_social_verification: true,
        enable_auto_payout: true
      };
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   * @param {number} lat1 - Latitude 1
   * @param {number} lng1 - Longitude 1
   * @param {number} lat2 - Latitude 2
   * @param {number} lng2 - Longitude 2
   * @returns {number} Distance in meters
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Format distance for display
   * @param {number} meters - Distance in meters
   * @returns {string} Formatted distance
   */
  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  }
}

// Export singleton instance
export const checkinService = new CheckinService();
export default checkinService;