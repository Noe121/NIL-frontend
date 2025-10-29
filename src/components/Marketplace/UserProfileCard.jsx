/**
 * UserProfileCard - Card component for displaying athlete/influencer profiles in marketplace
 * Includes "Sponsor" button to initiate deals
 * Date: October 26, 2025
 */

import React, { useState } from 'react';
import CreateDealModal from '../Contracts/CreateDealModal';
import CreateDealWeb3Modal from '../Contracts/CreateDealWeb3Modal';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { useAuth } from '../../hooks/useAuth';

export default function UserProfileCard({ user }) {
  const [showTraditionalModal, setShowTraditionalModal] = useState(false);
  const [showWeb3Modal, setShowWeb3Modal] = useState(false);
  const [showContractTypeSelector, setShowContractTypeSelector] = useState(false);

  const { flags } = useFeatureFlags();
  const { user: currentUser } = useAuth();

  const isSponsor = currentUser?.role === 'sponsor';
  const isAthlete = user.role === 'athlete';
  const web3Enabled = flags?.enable_web3_sponsorship;

  const handleSponsorClick = () => {
    // If Web3 is enabled, show contract type selector
    // Otherwise, directly open traditional modal
    if (web3Enabled) {
      setShowContractTypeSelector(true);
    } else {
      setShowTraditionalModal(true);
    }
  };

  const handleContractTypeSelect = (type) => {
    setShowContractTypeSelector(false);
    if (type === 'web3') {
      setShowWeb3Modal(true);
    } else {
      setShowTraditionalModal(true);
    }
  };

  const handleDealSuccess = (deal) => {
    alert(`Deal created successfully! Deal ID: ${deal.deal_id || deal.id}`);
    // Optionally redirect to deals page
    // window.location.href = '/deals';
  };

  const getTierBadgeColor = (tier) => {
    const colors = {
      'MEGA': 'bg-purple-100 text-purple-800',
      'Elite': 'bg-blue-100 text-blue-800',
      'Pro': 'bg-green-100 text-green-800',
      'Rising': 'bg-yellow-100 text-yellow-800',
      'Starter': 'bg-gray-100 text-gray-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Profile Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-6xl">
                {isAthlete ? '🏃' : '🎬'}
              </span>
            </div>
          )}

          {/* Tier Badge */}
          {user.tier && (
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierBadgeColor(user.tier)}`}>
                {user.tier}
              </span>
            </div>
          )}

          {/* Verified Badge */}
          {user.verified && (
            <div className="absolute top-3 left-3">
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {user.display_name || user.username}
              </h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>

          {/* Athlete/Influencer Info */}
          <div className="mb-4 space-y-1">
            {isAthlete ? (
              <>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Sport:</span> {user.sport}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">School:</span> {user.school}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Niche:</span> {user.niche}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Platform:</span> {user.primary_platform}
                </p>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {user.follower_count?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {user.tier_multiplier}x
              </p>
              <p className="text-xs text-gray-600">Multiplier</p>
            </div>
          </div>

          {/* Engagement Rate */}
          {user.engagement_rate && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Engagement Rate</span>
                <span className="text-xs font-semibold text-gray-900">
                  {user.engagement_rate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min(user.engagement_rate, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isSponsor ? (
            <button
              onClick={handleSponsorClick}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
            >
              🤝 Sponsor @{user.username}
            </button>
          ) : (
            <button
              onClick={() => window.location.href = '/auth?redirect=/marketplace'}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Login to Sponsor
            </button>
          )}

          {/* View Profile Link */}
          <a
            href={isAthlete ? `/athletes/${user.id}` : `/influencer/${user.id}`}
            className="block text-center text-sm text-blue-600 hover:text-blue-700 mt-3"
          >
            View Full Profile →
          </a>
        </div>
      </div>

      {/* Contract Type Selector Modal */}
      {showContractTypeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Contract Type</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Traditional Option */}
              <button
                onClick={() => handleContractTypeSelect('traditional')}
                className="border-2 border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition text-left group"
              >
                <div className="text-4xl mb-3">📄</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">Traditional</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Fast, compliant, 3-click deal with PDF contract
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ 3 seconds to complete</li>
                  <li>✓ Stripe payment</li>
                  <li>✓ NCAA compliant</li>
                  <li>✓ 95% of users choose this</li>
                </ul>
              </button>

              {/* Web3 Option */}
              <button
                onClick={() => handleContractTypeSelect('web3')}
                className="border-2 border-purple-300 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition text-left group"
              >
                <div className="text-4xl mb-3">🔗</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600">Web3 Premium</h3>
                <p className="text-sm text-gray-600 mb-4">
                  On-chain contract with NFT collectible
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ Smart contract deployment</li>
                  <li>✓ NFT minted as proof</li>
                  <li>✓ Immutable on-chain</li>
                  <li>✓ $50 NFT mint fee</li>
                </ul>
              </button>
            </div>

            <button
              onClick={() => setShowContractTypeSelector(false)}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Traditional Modal */}
      {showTraditionalModal && (
        <CreateDealModal
          targetUser={user}
          onClose={() => setShowTraditionalModal(false)}
          onSuccess={handleDealSuccess}
          contractType="traditional"
        />
      )}

      {/* Web3 Modal */}
      {showWeb3Modal && (
        <CreateDealWeb3Modal
          targetUser={user}
          onClose={() => setShowWeb3Modal(false)}
          onSuccess={handleDealSuccess}
        />
      )}
    </>
  );
}
