/**
 * PayoutBreakdown - Displays payout calculation breakdown
 * Shows platform fee, tier multiplier, and final payout
 * Date: October 26, 2025
 */

import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

export default function PayoutBreakdown({
  dealAmount,
  platformFee,
  tier,
  tierMultiplier,
  payout,
  isAthlete,
  loading
}) {
  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-gray-600">Calculating payout...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl mb-6 border border-green-200">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Deal Amount:</span>
          <span className="font-semibold text-gray-900">
            ${dealAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Platform Fee (20%):</span>
          <span className="font-semibold text-red-600">
            -${platformFee.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-700">
            Tier Multiplier ({tier || 'N/A'}):
          </span>
          <span className="font-semibold text-blue-600">
            {tierMultiplier}x
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>Base Amount: ${(dealAmount - platformFee).toLocaleString()}</span>
          <span>× {tierMultiplier} = ${(payout).toLocaleString()}</span>
        </div>

        <div className="border-t border-green-300 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-gray-900">
              {isAthlete ? 'Athlete' : 'Influencer'} Gets:
            </span>
            <span className="font-bold text-3xl text-green-600">
              ${payout.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tier Explanation */}
        <div className="text-xs text-gray-600 bg-white/50 p-3 rounded">
          <p className="font-semibold mb-1">💡 How Payouts Work:</p>
          <p>
            Higher tier = higher payout multiplier. The {tier || 'current'} tier ({tierMultiplier}x)
            means the {isAthlete ? 'athlete' : 'influencer'} earns {tierMultiplier}x more than
            the base amount after platform fees.
          </p>
        </div>
      </div>
    </div>
  );
}
