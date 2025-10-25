import { describe, it, expect, beforeEach, vi } from 'vitest';
import { paymentService } from '../src/services/paymentService.js';

/**
 * Frontend Integration Tests for Payment Service
 * 
 * These tests verify that the frontend payment service correctly
 * interfaces with the backend payment service API.
 */

describe('Payment Service - Tier Information', () => {
  beforeEach(() => {
    // Mock fetch for testing
    global.fetch = vi.fn();
  });

  it('should fetch all tiers successfully', async () => {
    const mockTiers = {
      tiers: [
        { tier_name: 'starter', multiplier: 0.575, min_followers: 500 },
        { tier_name: 'growth', multiplier: 1.125, min_followers: 2500 }
      ],
      tier_count: 2
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTiers
    });

    const result = await paymentService.getAllTiers();
    expect(result.tier_count).toBe(2);
    expect(result.tiers).toHaveLength(2);
  });

  it('should get tier info by name', async () => {
    const mockTier = {
      tier_name: 'pro',
      info: {
        multiplier: 2.25,
        min_followers: 10000,
        max_followers: 50000
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTier
    });

    const result = await paymentService.getTierInfo('pro');
    expect(result.tier_name).toBe('pro');
    expect(result.info.multiplier).toBe(2.25);
  });

  it('should get tier by follower count', async () => {
    const mockResult = {
      follower_count: 5000,
      current_tier: 'growth',
      multiplier: 1.125,
      followers_to_next_tier: 4500
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const result = await paymentService.getTierByFollowers(5000);
    expect(result.current_tier).toBe('growth');
    expect(result.multiplier).toBe(1.125);
  });

  it('should throw error for insufficient followers', async () => {
    await expect(
      paymentService.getTierByFollowers(250)
    ).rejects.toThrow('Minimum 500 followers required');
  });
});

describe('Payment Service - Payout Calculations', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should calculate payout correctly', async () => {
    const mockCalculation = {
      deal_amount: 1000,
      tier_name: 'growth',
      payout_multiplier: 1.125,
      calculated_payout: 1125,
      service_fee: 225,
      net_payout: 900,
      breakdown: {
        deal_amount: 1000,
        multiplier: 1.125,
        payout_before_fees: 1125,
        service_fee_rate: 0.20,
        service_fee: 225,
        tax_withholding_rate: 0.05,
        tax_withholding: 50,
        net_payout: 850
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCalculation
    });

    const result = await paymentService.calculatePayout(1000, 5000);
    expect(result.deal_amount).toBe(1000);
    expect(result.tier_name).toBe('growth');
    expect(result.net_payout).toBeGreaterThan(0);
    expect(result.breakdown).toBeDefined();
  });

  it('should validate deal amount', async () => {
    await expect(
      paymentService.calculatePayout(0, 5000)
    ).rejects.toThrow('Deal amount must be greater than 0');

    await expect(
      paymentService.calculatePayout(-100, 5000)
    ).rejects.toThrow('Deal amount must be greater than 0');
  });

  it('should calculate payout by specific tier', async () => {
    const mockResult = {
      success: true,
      calculation: {
        deal_amount: 500,
        tier_name: 'starter',
        multiplier: 0.575,
        payout_before_fees: 287.50,
        service_fee: 57.50,
        net_payout: 230
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const result = await paymentService.calculatePayoutByTier(500, 'starter');
    expect(result.success).toBe(true);
    expect(result.calculation.tier_name).toBe('starter');
  });
});

describe('Payment Service - Payout Processing', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should process payout successfully', async () => {
    const mockResult = {
      success: true,
      payout_id: 101,
      influencer_id: 1,
      calculation: {
        net_payout: 800,
        service_fee: 200
      },
      status: 'pending_processing'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult
    });

    const result = await paymentService.processPayout({
      influencer_id: 1,
      payment_id: 'pay_123',
      deal_id: 50,
      tier_name: 'growth',
      base_amount: 1000
    });

    expect(result.success).toBe(true);
    expect(result.payout_id).toBe(101);
    expect(result.status).toBe('pending_processing');
  });

  it('should get payout history', async () => {
    const mockHistory = {
      influencer_id: 1,
      payouts: [
        {
          id: 1,
          deal_id: 10,
          net_payout: 800,
          tier_name: 'growth',
          created_at: '2025-10-20T10:00:00Z'
        },
        {
          id: 2,
          deal_id: 11,
          net_payout: 600,
          tier_name: 'starter',
          created_at: '2025-10-21T15:30:00Z'
        }
      ],
      summary: {
        total_payouts: 2,
        total_amount: 1400,
        average_payout: 700
      },
      pagination: {
        total: 2,
        limit: 10,
        offset: 0
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHistory
    });

    const result = await paymentService.getPayoutHistory(1);
    expect(result.payouts).toHaveLength(2);
    expect(result.summary.total_amount).toBe(1400);
  });
});

describe('Payment Service - Compliance', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should check compliance status', async () => {
    const mockCompliance = {
      influencer_id: 1,
      is_eligible: true,
      approval_status: 'approved',
      restrictions: null,
      annual_earnings: 15000,
      earnings_cap: null
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCompliance
    });

    const result = await paymentService.checkCompliance({
      influencer_id: 1,
      influencer_type: 'regular_influencer'
    });

    expect(result.is_eligible).toBe(true);
    expect(result.approval_status).toBe('approved');
  });

  it('should validate payout compliance', async () => {
    const mockValidation = {
      influencer_id: 1,
      is_allowed: true,
      message: 'Payout is within compliance limits',
      new_payout: 500
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockValidation
    });

    const result = await paymentService.validatePayoutCompliance({
      influencer_id: 1,
      influencer_type: 'regular_influencer',
      new_payout: 500
    });

    expect(result.is_allowed).toBe(true);
    expect(result.message).toBeDefined();
  });
});

describe('Payment Service - Payment Accounts', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should setup payment account', async () => {
    const mockAccount = {
      influencer_id: 1,
      stripe_account_id: 'acct_123456',
      onboarding_complete: false,
      kyc_verified: false,
      setup_required_fields: ['kyc_verification', 'bank_account']
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAccount
    });

    const result = await paymentService.setupPaymentAccount({
      influencer_id: 1,
      stripe_account_id: 'acct_123456',
      payment_method: 'stripe'
    });

    expect(result.influencer_id).toBe(1);
    expect(result.setup_required_fields).toHaveLength(2);
  });

  it('should get payment account', async () => {
    const mockAccount = {
      influencer_id: 1,
      account: {
        stripe_account_id: 'acct_123456',
        onboarding_complete: true,
        kyc_verified: true
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAccount
    });

    const result = await paymentService.getPaymentAccount(1);
    expect(result.account.stripe_account_id).toBe('acct_123456');
  });
});

describe('Payment Service - Earnings Tracking', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should get earnings summary', async () => {
    const mockEarnings = {
      influencer_id: 1,
      current_tier: 'growth',
      total_earnings: 5000,
      total_deals: 10,
      tier_info: {
        multiplier: 1.125,
        min_followers: 2500
      },
      recent_payouts: [
        {
          id: 1,
          net_payout: 800,
          deal_id: 10,
          created_at: '2025-10-20T10:00:00Z'
        }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEarnings
    });

    const result = await paymentService.getEarningsSummary(1);
    expect(result.total_earnings).toBe(5000);
    expect(result.total_deals).toBe(10);
    expect(result.recent_payouts).toHaveLength(1);
  });
});

describe('Payment Service - Error Handling', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should handle 404 errors gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => 'Tier not found'
    });

    await expect(
      paymentService.getTierInfo('nonexistent')
    ).rejects.toThrow('Tier');
  });

  it('should handle network errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      paymentService.getAllTiers()
    ).rejects.toThrow();
  });

  it('should validate required fields', async () => {
    await expect(
      paymentService.processPayout({})
    ).rejects.toThrow('Missing required');

    await expect(
      paymentService.getPaymentAccount(null)
    ).rejects.toThrow('Influencer ID is required');
  });
});

describe('Payment Service - Feature Flags', () => {
  it('should check payment availability', () => {
    const isEnabled = paymentService.isPaymentsEnabled();
    expect(typeof isEnabled).toBe('boolean');
  });

  it('should get available payment methods', () => {
    const methods = paymentService.getAvailableMethods();
    expect(Array.isArray(methods)).toBe(true);
  });
});
