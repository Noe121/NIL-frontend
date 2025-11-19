import { featureFlags } from './featureFlagService.js';

class PaymentService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8006';
  }

  /**
   * ====================================================================
   * TIER INFORMATION ENDPOINTS
   * ====================================================================
   */

  /**
   * Get all available payment tiers
   * @returns {Object} List of all payment tiers with details
   */
  async getAllTiers() {
    const response = await fetch(`${this.baseUrl}/tiers`);
    if (!response.ok) {
      throw new Error('Failed to fetch payment tiers');
    }
    return response.json();
  }

  /**
   * Get specific tier information by name
   * @param {string} tierName - Name of the tier (e.g., 'starter', 'growth', 'pro')
   * @returns {Object} Tier information including multiplier and details
   */
  async getTierInfo(tierName) {
    const response = await fetch(`${this.baseUrl}/tiers/${tierName}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Tier '${tierName}' not found`);
      }
      throw new Error('Failed to fetch tier information');
    }
    return response.json();
  }

  /**
   * Get tier based on follower count (auto-tier selection)
   * @param {number} followerCount - Number of followers
   * @returns {Object} Tier info with multiplier and progression details
   */
  async getTierByFollowers(followerCount) {
    if (followerCount < 500) {
      throw new Error('Minimum 500 followers required for monetization');
    }

    const response = await fetch(`${this.baseUrl}/tiers/by-followers/${followerCount}`);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to determine tier: ${error}`);
    }
    return response.json();
  }

  /**
   * ====================================================================
   * PAYOUT CALCULATION ENDPOINTS
   * ====================================================================
   */

  /**
   * Calculate payout for a deal based on follower count and amount
   * @param {number} dealAmount - Total deal amount in USD
   * @param {number} followerCount - Number of followers
   * @returns {Object} Detailed payout calculation with breakdown
   */
  async calculatePayout(dealAmount, followerCount) {
    if (!dealAmount || dealAmount <= 0) {
      throw new Error('Deal amount must be greater than 0');
    }

    if (!followerCount || followerCount < 500) {
      throw new Error('Minimum 500 followers required for monetization');
    }

    const response = await fetch(`${this.baseUrl}/calculate-payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deal_amount: dealAmount,
        follower_count: followerCount
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payout calculation failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Calculate payout by specific tier
   * @param {number} dealAmount - Total deal amount in USD
   * @param {string} tierName - Name of the tier
   * @returns {Object} Payout calculation for the specified tier
   */
  async calculatePayoutByTier(dealAmount, tierName) {
    if (!dealAmount || dealAmount <= 0) {
      throw new Error('Deal amount must be greater than 0');
    }

    if (!tierName) {
      throw new Error('Tier name is required');
    }

    const response = await fetch(`${this.baseUrl}/calculate-payout/by-tier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deal_amount: dealAmount,
        tier_name: tierName
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payout calculation failed: ${error}`);
    }

    return response.json();
  }

  /**
   * ====================================================================
   * PAYOUT PROCESSING ENDPOINTS
   * ====================================================================
   */

  /**
   * Process payout to influencer's payment account
   * @param {Object} payoutData - Payout details
   * @returns {Object} Payout processing result with payout_id
   */
  async processPayout(payoutData) {
    const {
      influencer_id,
      payment_id,
      deal_id,
      tier_name,
      base_amount
    } = payoutData;

    if (!influencer_id || !tier_name || !base_amount) {
      throw new Error('Missing required payout fields');
    }

    const response = await fetch(`${this.baseUrl}/payments/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        influencer_id,
        payment_id,
        deal_id,
        tier_name,
        base_amount
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payout processing failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Get payout history for an influencer
   * @param {number} influencerId - Influencer ID
   * @param {number} limit - Number of records to fetch (default: 10)
   * @param {number} offset - Pagination offset (default: 0)
   * @returns {Object} Payout history with pagination and summary
   */
  async getPayoutHistory(influencerId, limit = 10, offset = 0) {
    if (!influencerId) {
      throw new Error('Influencer ID is required');
    }

    const url = new URL(`${this.baseUrl}/payments/history/${influencerId}`);
    url.searchParams.append('limit', limit);
    url.searchParams.append('offset', offset);

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Payout history not found');
      }
      throw new Error('Failed to fetch payout history');
    }

    return response.json();
  }

  /**
   * ====================================================================
   * COMPLIANCE ENDPOINTS
   * ====================================================================
   */

  /**
   * Check compliance status for influencer
   * @param {Object} complianceData - Influencer data for compliance check
   * @returns {Object} Compliance status and restrictions
   */
  async checkCompliance(complianceData) {
    const {
      influencer_id,
      influencer_type
    } = complianceData;

    if (!influencer_id) {
      throw new Error('Influencer ID is required');
    }

    const response = await fetch(`${this.baseUrl}/compliance/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        influencer_id,
        influencer_type: influencer_type || 'regular_influencer'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Compliance check failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Validate if a payout complies with regulations
   * @param {Object} validationData - Payout validation data
   * @returns {Object} Validation result with allowed status and message
   */
  async validatePayoutCompliance(validationData) {
    const {
      influencer_id,
      influencer_type,
      new_payout
    } = validationData;

    if (!influencer_id || !new_payout) {
      throw new Error('Missing required validation fields');
    }

    const response = await fetch(`${this.baseUrl}/compliance/validate-payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        influencer_id,
        influencer_type: influencer_type || 'regular_influencer',
        new_payout
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Compliance validation failed: ${error}`);
    }

    return response.json();
  }

  /**
   * ====================================================================
   * PAYMENT ACCOUNT ENDPOINTS
   * ====================================================================
   */

  /**
   * Setup payment account for influencer
   * @param {Object} accountData - Payment account setup data
   * @returns {Object} Payment account details and setup status
   */
  async setupPaymentAccount(accountData) {
    const {
      influencer_id,
      stripe_account_id,
      payment_method
    } = accountData;

    if (!influencer_id) {
      throw new Error('Influencer ID is required');
    }

    const response = await fetch(`${this.baseUrl}/accounts/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        influencer_id,
        stripe_account_id: stripe_account_id || null,
        payment_method: payment_method || 'stripe'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payment account setup failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Get payment account for influencer
   * @param {number} influencerId - Influencer ID
   * @returns {Object} Payment account details
   */
  async getPaymentAccount(influencerId) {
    if (!influencerId) {
      throw new Error('Influencer ID is required');
    }

    const response = await fetch(`${this.baseUrl}/accounts/${influencerId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Payment account not found');
      }
      throw new Error('Failed to fetch payment account');
    }

    return response.json();
  }

  /**
   * ====================================================================
   * EARNINGS TRACKING ENDPOINTS
   * ====================================================================
   */

  /**
   * Get earnings summary for influencer
   * @param {number} influencerId - Influencer ID
   * @returns {Object} Earnings summary with tier info and recent payouts
   */
  async getEarningsSummary(influencerId) {
    if (!influencerId) {
      throw new Error('Influencer ID is required');
    }

    const response = await fetch(`${this.baseUrl}/earnings/${influencerId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Earnings data not found');
      }
      throw new Error('Failed to fetch earnings summary');
    }

    return response.json();
  }

  /**
   * ====================================================================
   * LEGACY/COMPATIBILITY METHODS (Deprecated - use new methods above)
   * ====================================================================
   */

  /**
   * Create Stripe payment intent for sponsor payment
   * @param {Object} paymentData - Payment details
   * @returns {Object} Payment intent data with client_secret
   */
  async createStripePaymentIntent(paymentData) {
    const {
      amount,
      sponsor_id,
      deal_id,
      description
    } = paymentData;

    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!sponsor_id) {
      throw new Error('Sponsor ID is required');
    }

    const response = await fetch(`${this.baseUrl}/stripe/payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount),
        sponsor_id: parseInt(sponsor_id),
        deal_id: deal_id ? parseInt(deal_id) : null,
        description: description || `NIL Deal Payment - $${amount}`
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payment intent creation failed: ${error}`);
    }

    return response.json();
  }

  /**
   * @deprecated Use getPayoutHistory() instead
   */
  async getPaymentStatus(paymentId) {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}`);
    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }
    return response.json();
  }

  /**
   * @deprecated Use processPayout() instead
   */
  async payout(paymentId, athleteStripeId) {
    const response = await fetch(`${this.baseUrl}/payments/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_id: paymentId,
        athlete_stripe_id: athleteStripeId
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payout failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Get available payment methods based on feature flags
   */
  getAvailableMethods() {
    const methods = [];
    if (featureFlags.isEnabled('enable_traditional_payments')) {
      methods.push({ id: 'stripe', name: 'Credit Card (Stripe)', provider: 'stripe' });
    }
    if (featureFlags.isEnabled('enable_blockchain_payments')) {
      methods.push({ id: 'blockchain', name: 'Cryptocurrency', provider: 'blockchain' });
    }
    return methods;
  }

  /**
   * Check if payments are enabled at all
   */
  isPaymentsEnabled() {
    return featureFlags.isEnabled('enable_traditional_payments') ||
           featureFlags.isEnabled('enable_blockchain_payments');
  }
}

export const paymentService = new PaymentService();