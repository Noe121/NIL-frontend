/**
 * useFeatureFlags - Hook for accessing feature flags
 * Fetches and caches feature flags from the feature flag service
 * Date: October 26, 2025
 */

import { useState, useEffect } from 'react';

// Default feature flags (fallback if API fails)
const DEFAULT_FLAGS = {
  enable_traditional_sponsorship: true,
  enable_web3_sponsorship: false,  // Disabled by default until 10K DAU
  enable_stripe_payments: true,
  enable_paypal_payments: true,
  enable_crypto_payments: false,
  enable_nft_minting: false,
  enable_ncaa_compliance: true,
  enable_influencer_deals: true,
  enable_future_deals: false,
  enable_mega_tier: true
};

let cachedFlags = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFeatureFlags() {
  const [flags, setFlags] = useState(cachedFlags || DEFAULT_FLAGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    // Use cache if available and fresh
    const now = Date.now();
    if (cachedFlags && (now - lastFetchTime) < CACHE_DURATION) {
      setFlags(cachedFlags);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/feature-flags/flags', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feature flags');
      }

      const data = await response.json();

      // Convert array of flags to object
      const flagsObject = {};
      if (Array.isArray(data)) {
        data.forEach(flag => {
          flagsObject[flag.key] = flag.enabled;
        });
      } else {
        Object.assign(flagsObject, data);
      }

      // Merge with defaults
      const mergedFlags = { ...DEFAULT_FLAGS, ...flagsObject };

      cachedFlags = mergedFlags;
      lastFetchTime = now;
      setFlags(mergedFlags);
    } catch (err) {
      console.error('Failed to fetch feature flags:', err);
      setError(err.message);
      setFlags(DEFAULT_FLAGS); // Use defaults on error
    } finally {
      setLoading(false);
    }
  };

  const isEnabled = (flagKey) => {
    return flags[flagKey] === true;
  };

  const refresh = () => {
    cachedFlags = null;
    lastFetchTime = 0;
    fetchFlags();
  };

  return {
    flags,
    loading,
    error,
    isEnabled,
    refresh
  };
}
