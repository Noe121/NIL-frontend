// LOCAL CACHE (works if service down)
const DEFAULT_FLAGS = {
  enable_traditional_payments: true,
  enable_blockchain_payments: false,
  enable_payment_sandbox: true,
  enable_deal_creation: true,
  enable_user_registration: true
};

class FeatureFlagService {
  constructor() {
    this.flags = { ...DEFAULT_FLAGS };
    this.loadFlags();
  }

  async loadFlags() {
    try {
      const response = await fetch(`${import.meta.env.VITE_FEATURE_FLAG_URL}/flags`);
      if (response.ok) {
        const serverFlags = await response.json();
        // Map server flags to our expected format
        this.flags = {
          ...this.flags,
          enable_traditional_payments: serverFlags.payment_stripe || this.flags.enable_traditional_payments,
          enable_blockchain_payments: serverFlags.payment_blockchain || this.flags.enable_blockchain_payments,
          enable_payment_sandbox: serverFlags.payment_sandbox || this.flags.enable_payment_sandbox,
          enable_deal_creation: true, // Always enable for now
          enable_user_registration: true // Always enable for now
        };
      }
    } catch (error) {
      console.log('Feature flag service unavailable, using defaults:', error.message);
    }
  }

  isEnabled(flagName) {
    return this.flags[flagName] ?? false;
  }

  getAllFlags() {
    return this.flags;
  }

  // Force refresh flags
  async refresh() {
    await this.loadFlags();
  }
}

export const featureFlags = new FeatureFlagService();