import { featureFlags } from './featureFlagService.js';

class PaymentService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8005';
  }

  async createPayment(amount, currency = 'usd', metadata = {}) {
    // FEATURE FLAG CHECK
    if (!featureFlags.isEnabled('enable_traditional_payments')) {
      throw new Error('Payments temporarily unavailable');
    }

    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        provider: 'stripe',
        metadata
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Payment creation failed: ${error}`);
    }

    return response.json(); // { id, checkout_url, status }
  }

  async getPaymentStatus(paymentId) {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}`);
    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }
    return response.json();
  }

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

  // Get available payment methods based on feature flags
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

  // Check if payments are enabled at all
  isPaymentsEnabled() {
    return featureFlags.isEnabled('enable_traditional_payments') ||
           featureFlags.isEnabled('enable_blockchain_payments');
  }
}

export const paymentService = new PaymentService();