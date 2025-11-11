/**
 * paymentDisputeService.js
 * NILBx - Payment Dispute Service for Frontend
 *
 * Centralized service for managing payment disputes and refunds
 * Integrates with Payment Service (Port 8005)
 */

const PAYMENT_SERVICE_URL = 'http://localhost:8005';

/**
 * Payment Dispute Service
 * Handles payment disputes, refunds, and chargebacks
 */
class PaymentDisputeService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
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

  // MARK: - Dispute Management

  /**
   * Get available dispute reasons
   * @returns {Promise<Object>} List of dispute reasons
   */
  async getDisputeReasons() {
    try {
      const response = await fetch(`${PAYMENT_SERVICE_URL}/disputes/reasons`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dispute reasons: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching dispute reasons:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a payment dispute
   * @param {Object} disputeData - Dispute details
   * @returns {Promise<Object>} Created dispute
   */
  async createDispute(disputeData) {
    try {
      const {
        paymentId,
        userId,
        reason,
        category,
        description,
        evidence = null,
        requestedAmount = null
      } = disputeData;

      const response = await fetch(`${PAYMENT_SERVICE_URL}/disputes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          payment_id: paymentId,
          user_id: userId,
          reason,
          category,
          description,
          evidence,
          requested_amount: requestedAmount
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to create dispute: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache('disputes_');

      return {
        success: true,
        data: data.dispute
      };
    } catch (error) {
      console.error('Error creating dispute:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all disputes for a user
   * @param {number} userId - User ID
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} List of disputes
   */
  async getDisputes(userId, options = {}) {
    try {
      const {
        status = null,
        limit = 50,
        offset = 0
      } = options;

      const queryParams = new URLSearchParams({
        user_id: userId,
        limit,
        offset
      });

      if (status) queryParams.append('status', status);

      const url = `${PAYMENT_SERVICE_URL}/disputes?${queryParams}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch disputes: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching disputes:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get a specific dispute by ID
   * @param {number} disputeId - Dispute ID
   * @returns {Promise<Object>} Dispute details
   */
  async getDispute(disputeId) {
    try {
      const response = await fetch(`${PAYMENT_SERVICE_URL}/disputes/${disputeId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dispute: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching dispute:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add evidence to an existing dispute
   * @param {number} disputeId - Dispute ID
   * @param {Object} evidence - Evidence data
   * @returns {Promise<Object>} Updated dispute
   */
  async addDisputeEvidence(disputeId, evidence) {
    try {
      const response = await fetch(`${PAYMENT_SERVICE_URL}/disputes/${disputeId}/evidence`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ evidence })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to add evidence: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache(`dispute_${disputeId}`);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error adding dispute evidence:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel a dispute
   * @param {number} disputeId - Dispute ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Response
   */
  async cancelDispute(disputeId, reason) {
    try {
      const response = await fetch(`${PAYMENT_SERVICE_URL}/disputes/${disputeId}/cancel`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel dispute: ${response.statusText}`);
      }

      // Clear cache
      this.clearCache(`dispute_${disputeId}`);
      this.clearCache('disputes_');

      return {
        success: true,
        message: 'Dispute cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling dispute:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Refund Management

  /**
   * Request a refund
   * @param {Object} refundData - Refund details
   * @returns {Promise<Object>} Refund response
   */
  async requestRefund(refundData) {
    try {
      const {
        paymentId,
        userId,
        amount,
        reason,
        fullRefund = false
      } = refundData;

      const response = await fetch(`${PAYMENT_SERVICE_URL}/refunds`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          payment_id: paymentId,
          user_id: userId,
          amount,
          reason,
          full_refund: fullRefund
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Failed to request refund: ${response.statusText}`);
      }

      const data = await response.json();

      // Clear cache
      this.clearCache('refunds_');

      return {
        success: true,
        data: data.refund
      };
    } catch (error) {
      console.error('Error requesting refund:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get refund status
   * @param {number} refundId - Refund ID
   * @returns {Promise<Object>} Refund details
   */
  async getRefund(refundId) {
    try {
      const response = await fetch(`${PAYMENT_SERVICE_URL}/refunds/${refundId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch refund: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching refund:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all refunds for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} List of refunds
   */
  async getRefunds(userId) {
    try {
      const response = await fetch(`${PAYMENT_SERVICE_URL}/refunds?user_id=${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch refunds: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching refunds:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Helper Methods

  /**
   * Get dispute status color for UI
   * @param {string} status - Dispute status
   * @returns {string} Color code
   */
  getDisputeStatusColor(status) {
    const colors = {
      pending: '#FFA726',       // Orange
      under_review: '#2196F3',  // Blue
      resolved: '#66BB6A',      // Green
      rejected: '#EF5350',      // Red
      cancelled: '#9E9E9E'      // Gray
    };
    return colors[status] || '#757575';
  }

  /**
   * Get dispute status label
   * @param {string} status - Dispute status
   * @returns {string} Human-readable label
   */
  getDisputeStatusLabel(status) {
    const labels = {
      pending: 'Pending Review',
      under_review: 'Under Review',
      resolved: 'Resolved',
      rejected: 'Rejected',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  }

  /**
   * Get dispute category icon
   * @param {string} category - Dispute category
   * @returns {string} Icon emoji
   */
  getDisputeCategoryIcon(category) {
    const icons = {
      non_delivery: '📦',
      quality_issue: '⚠️',
      unauthorized: '🚫',
      duplicate: '📋',
      incorrect_amount: '💰',
      service_not_rendered: '❌',
      fraudulent: '🔴'
    };
    return icons[category] || '❓';
  }

  /**
   * Format currency amount
   * @param {number} amount - Amount in dollars
   * @returns {string} Formatted currency
   */
  formatAmount(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Check if dispute can be cancelled
   * @param {Object} dispute - Dispute object
   * @returns {boolean} Whether dispute can be cancelled
   */
  canCancelDispute(dispute) {
    return ['pending', 'under_review'].includes(dispute.status);
  }

  /**
   * Check if evidence can be added
   * @param {Object} dispute - Dispute object
   * @returns {boolean} Whether evidence can be added
   */
  canAddEvidence(dispute) {
    return dispute.status === 'under_review';
  }

  /**
   * Get dispute category display name
   * @param {string} category - Category key
   * @returns {string} Display name
   */
  getCategoryDisplayName(category) {
    const names = {
      non_delivery: 'Non-Delivery',
      quality_issue: 'Quality Issue',
      unauthorized: 'Unauthorized Transaction',
      duplicate: 'Duplicate Charge',
      incorrect_amount: 'Incorrect Amount',
      service_not_rendered: 'Service Not Rendered',
      fraudulent: 'Fraudulent Transaction',
      other: 'Other'
    };
    return names[category] || category;
  }

  /**
   * Get dispute category description
   * @param {string} category - Category key
   * @returns {string} Description
   */
  getCategoryDescription(category) {
    const descriptions = {
      non_delivery: 'The deliverable was not provided as agreed',
      quality_issue: 'The deliverable did not meet quality standards',
      unauthorized: 'Payment was made without authorization',
      duplicate: 'Multiple charges for the same deal',
      incorrect_amount: 'Charged amount differs from agreement',
      service_not_rendered: 'Services outlined in the deal were not performed',
      fraudulent: 'Suspected fraudulent transaction',
      other: 'Other dispute reason'
    };
    return descriptions[category] || '';
  }

  // MARK: - Cache Management

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
const paymentDisputeService = new PaymentDisputeService();

export default paymentDisputeService;

// Export dispute categories
export const DisputeCategories = {
  NON_DELIVERY: 'non_delivery',
  QUALITY_ISSUE: 'quality_issue',
  UNAUTHORIZED: 'unauthorized',
  DUPLICATE: 'duplicate',
  INCORRECT_AMOUNT: 'incorrect_amount',
  SERVICE_NOT_RENDERED: 'service_not_rendered',
  FRAUDULENT: 'fraudulent',
  OTHER: 'other'
};

// Export dispute statuses
export const DisputeStatuses = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

// Export refund statuses
export const RefundStatuses = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};
