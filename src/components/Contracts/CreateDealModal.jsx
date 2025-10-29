/**
 * CreateDealModal - Unified contract creation modal for Traditional and Web3 deals
 * Supports both Athletes and Influencers with conditional UI
 * Date: October 26, 2025
 */

import React, { useState, useEffect } from 'react';
import { usePaymentCalculation } from '../../hooks/usePaymentCalculation';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import Modal from '../Modal';
import NCAAComplianceWarning from './NCAAComplianceWarning';
import InstantPayoutBadge from './InstantPayoutBadge';
import PayoutBreakdown from './PayoutBreakdown';
import LoadingSpinner from '../LoadingSpinner';

export default function CreateDealModal({ targetUser, onClose, onSuccess, contractType = 'traditional' }) {
  const [dealData, setDealData] = useState({
    amount: 1000,
    deliverable_type: 'instagram_post',
    duration_days: 30,
    description: ''
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const { flags } = useFeatureFlags();
  const { payout, platformFee, loading: calculatingPayout } = usePaymentCalculation({
    amount: dealData.amount,
    userId: targetUser?.id,
    tierMultiplier: targetUser?.tier_multiplier || 1.0
  });

  const isAthlete = targetUser?.role === 'athlete';
  const isTraditional = contractType === 'traditional';

  // Deliverable options
  const deliverableOptions = [
    { value: 'instagram_post', label: 'Instagram Post' },
    { value: 'instagram_story', label: 'Instagram Story (3x)' },
    { value: 'tiktok_video', label: 'TikTok Video' },
    { value: 'youtube_video', label: 'YouTube Video' },
    { value: 'twitter_thread', label: 'Twitter/X Thread' },
    { value: 'event_appearance', label: 'Event Appearance' },
    { value: 'product_review', label: 'Product Review' },
    { value: 'brand_ambassador', label: 'Brand Ambassador (Monthly)' }
  ];

  // Duration options
  const durationOptions = [
    { value: 7, label: '1 Week' },
    { value: 30, label: '1 Month' },
    { value: 90, label: '3 Months' },
    { value: 180, label: '6 Months' },
    { value: 365, label: '1 Year' }
  ];

  const handlePayment = async (paymentMethod) => {
    setProcessing(true);
    setError('');

    try {
      // Get sponsor from auth context or localStorage
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const sponsorId = userData.id;

      if (!sponsorId) {
        throw new Error('You must be logged in as a sponsor to create deals');
      }

      const requestData = {
        sponsor_id: sponsorId,
        athlete_id: targetUser.id,
        amount: dealData.amount,
        deal_type: dealData.deliverable_type,
        description: dealData.description,
        duration_days: dealData.duration_days,
        payment_method: paymentMethod
      };

      // Call API to create deal
      const response = await fetch('/api/v1/payments/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create deal');
      }

      const deal = await response.json();

      // Success callback
      if (onSuccess) {
        onSuccess(deal);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal open onClose={onClose} maxWidth="max-w-2xl">
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={targetUser?.profile_image || '/placeholder-avatar.png'}
            className="w-16 h-16 rounded-full object-cover"
            alt={targetUser?.display_name}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Sponsor @{targetUser?.username}
            </h2>
            {isAthlete && (
              <p className="text-sm text-gray-600">
                {targetUser?.sport} • {targetUser?.school}
              </p>
            )}
            {!isAthlete && (
              <p className="text-sm text-gray-600">
                {targetUser?.niche} • {targetUser?.primary_platform}
              </p>
            )}
          </div>
        </div>

        {/* NCAA Compliance Warning (Athletes Only) */}
        {isAthlete && <NCAAComplianceWarning />}

        {/* Instant Payout Badge (Influencers Only) */}
        {!isAthlete && <InstantPayoutBadge />}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Deal Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="number"
                value={dealData.amount}
                onChange={(e) => setDealData({ ...dealData, amount: parseInt(e.target.value) || 0 })}
                className="pl-8 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="100"
                max="100000"
                step="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deliverable Type
            </label>
            <select
              value={dealData.deliverable_type}
              onChange={(e) => setDealData({ ...dealData, deliverable_type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {deliverableOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Duration
            </label>
            <select
              value={dealData.duration_days}
              onChange={(e) => setDealData({ ...dealData, duration_days: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {durationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Details
            </label>
            <textarea
              value={dealData.description}
              onChange={(e) => setDealData({ ...dealData, description: e.target.value })}
              placeholder={`Describe what you'd like ${targetUser?.username} to promote...`}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Payout Calculation */}
        <PayoutBreakdown
          dealAmount={dealData.amount}
          platformFee={platformFee}
          tier={targetUser?.tier}
          tierMultiplier={targetUser?.tier_multiplier}
          payout={payout}
          isAthlete={isAthlete}
          loading={calculatingPayout}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => handlePayment('stripe')}
            disabled={processing || dealData.amount < 100 || !dealData.description.trim()}
            className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Pay Now via Stripe
              </>
            )}
          </button>
        </div>

        {/* Minimum Deal Amount Notice */}
        {dealData.amount < 100 && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Minimum deal amount is $100
          </p>
        )}
      </div>
    </Modal>
  );
}
