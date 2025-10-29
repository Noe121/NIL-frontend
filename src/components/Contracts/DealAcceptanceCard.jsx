/**
 * DealAcceptanceCard - Card component for athletes to accept pending deals
 * Displays deal details and allows acceptance/rejection
 * Date: October 26, 2025
 */

import React, { useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';

export default function DealAcceptanceCard({ deal, onAccept, onReject }) {
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await onAccept(deal.id);
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this deal?')) {
      return;
    }

    setRejecting(true);
    try {
      await onReject(deal.id);
    } finally {
      setRejecting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const deliverableTypes = {
    instagram_post: 'Instagram Post',
    instagram_story: 'Instagram Story (3x)',
    tiktok_video: 'TikTok Video',
    youtube_video: 'YouTube Video',
    twitter_thread: 'Twitter/X Thread',
    event_appearance: 'Event Appearance',
    product_review: 'Product Review',
    brand_ambassador: 'Brand Ambassador (Monthly)'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {deal.sponsor?.company_name || 'New Sponsor'}
              </h3>
              <p className="text-blue-100 text-sm">
                {formatDate(deal.created_at)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold">
              ${deal.payout_amount?.toLocaleString() || deal.amount?.toLocaleString()}
            </p>
            <p className="text-blue-100 text-xs">Your Payout</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Deal Overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Deliverable:</span>
            <span className="text-sm font-semibold text-gray-900">
              {deliverableTypes[deal.deal_type] || deal.deal_type}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Deal Amount:</span>
            <span className="text-sm text-gray-900">${deal.amount?.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Duration:</span>
            <span className="text-sm text-gray-900">{deal.duration_days || 30} days</span>
          </div>
          {deal.tier && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Your Tier:</span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                {deal.tier} ({deal.tier_multiplier}x)
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {deal.description && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-1">Campaign Details:</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {showDetails || deal.description.length < 150
                ? deal.description
                : `${deal.description.substring(0, 150)}...`}
            </p>
            {deal.description.length > 150 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-blue-600 hover:text-blue-700 mt-1"
              >
                {showDetails ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Compliance Notice (if applicable) */}
        {deal.ncaa_compliance_required && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>NCAA Compliance:</strong> This deal has been reviewed and approved for NCAA compliance.
              Ensure no school logos appear in your content.
            </p>
          </div>
        )}

        {/* Contract Type Badge */}
        <div className="flex items-center gap-2 mb-4">
          {deal.contract_type === 'web3' ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              🔗 Web3 Contract + NFT
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              📄 Traditional Contract
            </span>
          )}
          {deal.status === 'pending_acceptance' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
              ⏳ Pending Your Approval
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            disabled={accepting || rejecting}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {rejecting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Rejecting...
              </span>
            ) : (
              'Reject'
            )}
          </button>
          <button
            onClick={handleAccept}
            disabled={accepting || rejecting}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {accepting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Accepting...
              </span>
            ) : (
              `✓ Accept & Earn $${deal.payout_amount?.toLocaleString()}`
            )}
          </button>
        </div>

        {/* View Contract Link */}
        {deal.contract_url && (
          <div className="mt-3 text-center">
            <a
              href={deal.contract_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              📄 View Full Contract (PDF)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
