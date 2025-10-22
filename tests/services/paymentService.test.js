import { describe, it, expect, vi, beforeEach } from 'vitest';
import paymentService from '../../src/services/paymentService.js';

// Mock config
const mockConfig = vi.mocked(await import('../../src/utils/config.js'));

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default state
    mockConfig.default.features.traditionalPayments = true;
    mockConfig.default.features.blockchainPayments = false;
  });

  describe('getAvailablePaymentMethods', () => {
    it('should return traditional payment methods when enabled', () => {
      const methods = paymentService.getAvailablePaymentMethods();

      expect(methods).toHaveLength(2);
      expect(methods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'stripe', name: 'Credit Card (Stripe)' }),
          expect.objectContaining({ id: 'paypal', name: 'PayPal' })
        ])
      );
    });

    it('should include blockchain methods when enabled', () => {
      // Enable blockchain payments for this test
      mockConfig.default.features.blockchainPayments = true;

      const methods = paymentService.getAvailablePaymentMethods();
      expect(methods).toHaveLength(3);
      expect(methods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'blockchain', name: 'Cryptocurrency' })
        ])
      );
    });
  });

  describe('isPaymentsEnabled', () => {
    it('should return true when traditional payments are enabled', () => {
      expect(paymentService.isPaymentsEnabled()).toBe(true);
    });

    it('should return false when no payments are enabled', () => {
      // Disable all payments for this test
      mockConfig.default.features.traditionalPayments = false;
      mockConfig.default.features.blockchainPayments = false;

      expect(paymentService.isPaymentsEnabled()).toBe(false);
    });
  });

  describe('processPayment', () => {
    it('should process payment with valid method', async () => {
      const result = await paymentService.processPayment(100, 'USD', 'stripe');

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('transactionId');
      expect(result.transactionId).toMatch(/^stripe_txn_/);
    });

    it('should throw error for invalid payment method', async () => {
      await expect(
        paymentService.processPayment(100, 'USD', 'invalid')
      ).rejects.toThrow('Payment method not available');
    });
  });
});