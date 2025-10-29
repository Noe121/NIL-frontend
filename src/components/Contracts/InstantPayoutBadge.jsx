/**
 * InstantPayoutBadge - Badge component for influencer deals
 * Shows instant payout benefits
 * Date: October 26, 2025
 */

import React from 'react';

export default function InstantPayoutBadge() {
  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
      <div className="flex items-center">
        <svg
          className="h-5 w-5 text-green-400 mr-2 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-sm font-semibold text-green-700">
            ⚡ Instant Payout • Paid in 24h • Keep up to 95%
          </p>
          <p className="text-xs text-green-600 mt-1">
            No NCAA compliance required • Fast approval • Higher earnings
          </p>
        </div>
      </div>
    </div>
  );
}
