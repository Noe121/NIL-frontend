/**
 * deliverableService.js
 * NILBx - Deliverable Management Service for Frontend
 *
 * Centralized service for managing deliverables across NIL deals
 * Integrates with Deliverable Service (Port 8011)
 */

const DELIVERABLE_SERVICE_URL = import.meta.env.VITE_DELIVERABLE_SERVICE_URL || 'http://localhost:8011';

/**
 * Deliverable Service
 * Manages deliverables, submissions, approvals, and rejections
 */
class DeliverableService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get authentication token from localStorage
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

  /**
   * Cache key generator
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {string} Cache key
   */
  getCacheKey(endpoint, params = {}) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

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

  // MARK: - Deliverable CRUD Operations

  /**
   * Create a new deliverable for a deal
   * @param {number} dealId - Deal ID
   * @param {Object} deliverableData - Deliverable data
   * @returns {Promise<Object>} Created deliverable
   */
  async createDeliverable(dealId, deliverableData) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deals/${dealId}/deliverables`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(deliverableData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to create deliverable: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache for this deal's deliverables
      this.clearCache(`deliverables_${dealId}`);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error creating deliverable:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all deliverables for a deal
   * @param {number} dealId - Deal ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} List of deliverables
   */
  async getDeliverables(dealId, options = {}) {
    try {
      const cacheKey = this.getCacheKey(`deliverables_${dealId}`, options);
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }

      const queryParams = new URLSearchParams();
      if (options.status) queryParams.append('status', options.status);
      if (options.type) queryParams.append('type', options.type);

      const url = `${DELIVERABLE_SERVICE_URL}/deals/${dealId}/deliverables${
        queryParams.toString() ? `?${queryParams}` : ''
      }`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch deliverables: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching deliverables:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get a specific deliverable by ID
   * @param {number} deliverableId - Deliverable ID
   * @returns {Promise<Object>} Deliverable details
   */
  async getDeliverable(deliverableId) {
    try {
      const cacheKey = `deliverable_${deliverableId}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }

      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deliverables/${deliverableId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch deliverable: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching deliverable:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update a deliverable
   * @param {number} deliverableId - Deliverable ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated deliverable
   */
  async updateDeliverable(deliverableId, updates) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deliverables/${deliverableId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to update deliverable: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache(`deliverable_${deliverableId}`);
      this.clearCache('deliverables_');

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating deliverable:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete a deliverable
   * @param {number} deliverableId - Deliverable ID
   * @returns {Promise<Object>} Response
   */
  async deleteDeliverable(deliverableId) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deliverables/${deliverableId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to delete deliverable: ${response.statusText}`);
      }

      // Clear cache
      this.clearCache(`deliverable_${deliverableId}`);
      this.clearCache('deliverables_');

      return {
        success: true,
        message: 'Deliverable deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting deliverable:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Submission Management

  /**
   * Submit a deliverable for review
   * @param {number} deliverableId - Deliverable ID
   * @param {Object} submissionData - Submission details
   * @returns {Promise<Object>} Submission response
   */
  async submitDeliverable(deliverableId, submissionData) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deliverables/${deliverableId}/submit`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to submit deliverable: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache(`deliverable_${deliverableId}`);
      this.clearCache('deliverables_');

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error submitting deliverable:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Approve a submitted deliverable
   * @param {number} deliverableId - Deliverable ID
   * @param {Object} approvalData - Approval details (notes, rating, etc.)
   * @returns {Promise<Object>} Approval response
   */
  async approveDeliverable(deliverableId, approvalData = {}) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deliverables/${deliverableId}/approve`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(approvalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to approve deliverable: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache(`deliverable_${deliverableId}`);
      this.clearCache('deliverables_');

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error approving deliverable:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reject a submitted deliverable
   * @param {number} deliverableId - Deliverable ID
   * @param {string} reason - Rejection reason
   * @param {Object} rejectionData - Additional rejection details
   * @returns {Promise<Object>} Rejection response
   */
  async rejectDeliverable(deliverableId, reason, rejectionData = {}) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deliverables/${deliverableId}/reject`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          reason,
          ...rejectionData
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to reject deliverable: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache(`deliverable_${deliverableId}`);
      this.clearCache('deliverables_');

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error rejecting deliverable:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Request revision for a deliverable
   * @param {number} deliverableId - Deliverable ID
   * @param {string} feedback - Revision feedback
   * @returns {Promise<Object>} Response
   */
  async requestRevision(deliverableId, feedback) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deliverables/${deliverableId}/request-revision`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ feedback })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to request revision: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache(`deliverable_${deliverableId}`);
      this.clearCache('deliverables_');

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error requesting revision:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Bulk Operations

  /**
   * Create multiple deliverables at once
   * @param {number} dealId - Deal ID
   * @param {Array} deliverables - Array of deliverable data
   * @returns {Promise<Object>} Bulk creation response
   */
  async createDeliverablesInBulk(dealId, deliverables) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deals/${dealId}/deliverables/bulk`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ deliverables })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to create deliverables: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache(`deliverables_${dealId}`);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error creating deliverables in bulk:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update multiple deliverables at once
   * @param {Array} updates - Array of {deliverable_id, updates} objects
   * @returns {Promise<Object>} Bulk update response
   */
  async updateDeliverablesInBulk(updates) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deliverables/bulk-update`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ updates })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to update deliverables: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear all deliverable cache
      this.clearCache('deliverable');

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating deliverables in bulk:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Analytics & Reporting

  /**
   * Get deliverable analytics for a deal
   * @param {number} dealId - Deal ID
   * @returns {Promise<Object>} Analytics data
   */
  async getDeliverableAnalytics(dealId) {
    try {
      const response = await fetch(`${DELIVERABLE_SERVICE_URL}/deals/${dealId}/deliverables/analytics`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching deliverable analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get completion percentage for deliverables
   * @param {number} dealId - Deal ID
   * @returns {Promise<number>} Completion percentage
   */
  async getCompletionPercentage(dealId) {
    const result = await this.getDeliverables(dealId);

    if (!result.success || !result.data) {
      return 0;
    }

    const deliverables = result.data;
    if (deliverables.length === 0) return 0;

    const completed = deliverables.filter(d => d.status === 'approved').length;
    return Math.round((completed / deliverables.length) * 100);
  }

  // MARK: - Helper Methods

  /**
   * Get deliverable status badge color
   * @param {string} status - Deliverable status
   * @returns {string} Color code
   */
  getStatusColor(status) {
    const colorMap = {
      pending: '#FFA726',      // Orange
      in_progress: '#29B6F6',  // Blue
      submitted: '#9C27B0',    // Purple
      approved: '#66BB6A',     // Green
      rejected: '#EF5350',     // Red
      revision_requested: '#FF7043' // Deep Orange
    };
    return colorMap[status] || '#757575'; // Gray default
  }

  /**
   * Get deliverable status label
   * @param {string} status - Deliverable status
   * @returns {string} Human-readable label
   */
  getStatusLabel(status) {
    const labelMap = {
      pending: 'Pending',
      in_progress: 'In Progress',
      submitted: 'Submitted',
      approved: 'Approved',
      rejected: 'Rejected',
      revision_requested: 'Revision Requested'
    };
    return labelMap[status] || status;
  }

  /**
   * Check if deliverable is overdue
   * @param {Object} deliverable - Deliverable object
   * @returns {boolean} Whether deliverable is overdue
   */
  isOverdue(deliverable) {
    if (!deliverable.due_date || deliverable.status === 'approved') {
      return false;
    }

    const dueDate = new Date(deliverable.due_date);
    const now = new Date();
    return now > dueDate;
  }

  /**
   * Format due date with relative time
   * @param {string} dueDateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDueDate(dueDateString) {
    const dueDate = new Date(dueDateString);
    const now = new Date();
    const diffMs = dueDate - now;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays < 7) {
      return `Due in ${diffDays} days`;
    } else {
      return dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }
}

// Create and export singleton instance
const deliverableService = new DeliverableService();

export default deliverableService;

// Export deliverable types as constants
export const DeliverableTypes = {
  SOCIAL_POST: 'social_post',
  VIDEO: 'video',
  IMAGE: 'image',
  BLOG_POST: 'blog_post',
  EVENT_APPEARANCE: 'event_appearance',
  CONTENT_CREATION: 'content_creation',
  PRODUCT_REVIEW: 'product_review',
  LIVESTREAM: 'livestream',
  PODCAST: 'podcast',
  CHECKIN: 'checkin'
};

// Export deliverable statuses
export const DeliverableStatuses = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'revision_requested'
};
