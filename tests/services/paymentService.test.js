import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentService } from '../../src/services/paymentService.js';


// Mock featureFlags
vi.mock('../../src/services/featureFlagService.js', () => {
  let flags = {
    enable_traditional_payments: true,
    enable_blockchain_payments: false
  };
  return {
    featureFlags: {
      isEnabled: (flagName) => flags[flagName],
      setFlags: (newFlags) => { flags = { ...flags, ...newFlags }; }
    }
  };
});
const { featureFlags } = await import('../../src/services/featureFlagService.js');


describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    featureFlags.setFlags({
      enable_traditional_payments: true,
      enable_blockchain_payments: false
    });
  });

  describe('getAvailableMethods', () => {
    it('should return traditional payment methods when enabled', () => {
      const methods = paymentService.getAvailableMethods();

      expect(methods).toHaveLength(1);
      expect(methods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'stripe', name: 'Credit Card (Stripe)' })
        ])
      );
    });

    it('should include blockchain methods when enabled', () => {
      featureFlags.setFlags({ enable_blockchain_payments: true });
      const methods = paymentService.getAvailableMethods();
      expect(methods).toHaveLength(2);
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
      featureFlags.setFlags({
        enable_traditional_payments: false,
        enable_blockchain_payments: false
      });
      expect(paymentService.isPaymentsEnabled()).toBe(false);
    });
  });


});