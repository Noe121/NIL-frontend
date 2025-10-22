import { paymentService } from './paymentService.js';
import { featureFlags } from './featureFlagService.js';

class DealService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  }

  async createDeal(formData) {
    if (!featureFlags.isEnabled('enable_deal_creation')) {
      throw new Error('Deal creation temporarily unavailable');
    }

    // Delegate to Payment Service
    const payment = await paymentService.createPayment(
      formData.amount,
      'usd',
      {
        deal: {
          sponsor_id: formData.sponsor_id,
          athlete_id: formData.athlete_id,
          hotspot_name: formData.hotspot_name,
          requirement: formData.requirement
        }
      }
    );

    return payment; // Contains checkout_url
  }

  async claimDeal(dealId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/deals/${dealId}/claim`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claim failed: ${error}`);
    }

    return response.json();
  }

  async getAvailableDeals(athleteId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/deals?status=paid`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deals');
    }

    return response.json();
  }

  async getFutureDeals(school = null) {
    const url = school
      ? `${this.baseUrl}/future-deals?school=${encodeURIComponent(school)}`
      : `${this.baseUrl}/future-deals`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch future deals');
    }

    return response.json();
  }

  async preSignFutureDeal(dealId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/future-deals/${dealId}/signup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pre-sign failed: ${error}`);
    }

    return response.json();
  }

  async getMyDeals() {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/deals`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch my deals');
    }

    return response.json();
  }
}

export const dealService = new DealService();