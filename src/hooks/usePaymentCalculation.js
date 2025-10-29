/**
 * usePaymentCalculation - Hook for calculating deal payouts
 * Handles tier multipliers and platform fees
 * Date: October 26, 2025
 */

import { useState, useEffect } from 'react';

export function usePaymentCalculation({ amount, userId, tierMultiplier = 1.0 }) {
  const [payout, setPayout] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    calculatePayout();
  }, [amount, userId, tierMultiplier]);

  const calculatePayout = async () => {
    if (!amount || amount <= 0) {
      setPayout(0);
      setPlatformFee(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Option 1: Use API endpoint for accurate calculation
      if (userId) {
        try {
          const response = await fetch('/api/v1/payments/calculate-payout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
              amount: amount,
              user_id: userId
            })
          });

          if (response.ok) {
            const data = await response.json();
            setPayout(data.final_athlete_payout || 0);
            setPlatformFee(data.platform_fee || 0);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.warn('API calculation failed, using client-side calculation', apiError);
        }
      }

      // Option 2: Client-side calculation (fallback)
      const calculatedPlatformFee = amount * 0.20;
      const sponsorShare = amount - calculatedPlatformFee;
      const basePayout = sponsorShare * tierMultiplier;

      // Subtract Stripe processing fee (2.9% + $0.30)
      const stripeFee = (basePayout * 0.029) + 0.30;
      const finalPayout = Math.max(0, basePayout - stripeFee);

      setPayout(Math.round(finalPayout * 100) / 100);
      setPlatformFee(Math.round(calculatedPlatformFee * 100) / 100);
    } catch (err) {
      setError(err.message);
      setPayout(0);
      setPlatformFee(0);
    } finally {
      setLoading(false);
    }
  };

  return {
    payout,
    platformFee,
    loading,
    error,
    recalculate: calculatePayout
  };
}
