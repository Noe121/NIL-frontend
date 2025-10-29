/**
 * CreateDealWeb3Modal - Web3/Smart Contract deal creation modal
 * Handles wallet connection, smart contract deployment, and NFT minting
 * Date: October 26, 2025
 *
 * IMPORTANT: This component is ONLY rendered if feature flag 'enable_web3_sponsorship' is TRUE
 */

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { usePaymentCalculation } from '../../hooks/usePaymentCalculation';
import Modal from '../Modal';
import LoadingSpinner from '../LoadingSpinner';

export default function CreateDealWeb3Modal({ targetUser, onClose, onSuccess }) {
  const [dealData, setDealData] = useState({
    amount: 1000,
    deliverable_type: 'instagram_post',
    duration_days: 30,
    description: ''
  });

  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState('');
  const [gasEstimate, setGasEstimate] = useState(5);

  const {
    account,
    isConnected,
    connectWallet,
    getBalance,
    isBlockchainEnabled
  } = useWeb3();

  const { flags } = useFeatureFlags();
  const { payout, platformFee } = usePaymentCalculation({
    amount: dealData.amount,
    userId: targetUser?.id,
    tierMultiplier: targetUser?.tier_multiplier || 1.0
  });

  const [usdcBalance, setUsdcBalance] = useState(0);

  // Feature flag check
  if (!isBlockchainEnabled || !flags?.enable_web3_sponsorship) {
    return (
      <Modal open onClose={onClose}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold mb-4">Web3 Sponsorships Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Smart contract deals are not available yet. Please use traditional sponsorships.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </Modal>
    );
  }

  // Load USDC balance
  useEffect(() => {
    if (isConnected && account) {
      // Mock USDC balance for now
      setUsdcBalance(5000);
    }
  }, [isConnected, account]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeployContract = async () => {
    setDeploying(true);
    setError('');

    try {
      // Get sponsor from auth
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const sponsorId = userData.id;

      if (!sponsorId) {
        throw new Error('You must be logged in as a sponsor');
      }

      if (!account) {
        throw new Error('Please connect your wallet first');
      }

      const requestData = {
        sponsor_address: account,
        athlete_address: targetUser.wallet_address,
        amount: dealData.amount,
        amount_usdc: (dealData.amount * 1e6).toString(), // USDC has 6 decimals
        deliverable_type: dealData.deliverable_type,
        description: dealData.description,
        duration_days: dealData.duration_days,
        athlete_id: targetUser.id,
        sponsor_id: sponsorId
      };

      // Call blockchain service API
      const response = await fetch('/api/v1/blockchain/sponsorship/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to deploy contract');
      }

      const contractData = await response.json();

      // Success callback
      if (onSuccess) {
        onSuccess({
          ...contractData,
          type: 'web3'
        });
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeploying(false);
    }
  };

  const totalCost = dealData.amount + 50 + gasEstimate; // Deal + NFT mint fee + gas

  return (
    <Modal open onClose={onClose} maxWidth="max-w-2xl">
      <div>
        {/* Header with Web3 Badge */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-xl -mt-6 -mx-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Web3 Sponsorship
              </h2>
              <p className="text-purple-100 text-sm">
                On-chain contract • NFT collectible • Immutable proof
              </p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="text-white font-semibold">PREMIUM</p>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="bg-gray-50 p-8 rounded-xl text-center mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">
              Connect your Web3 wallet to create an on-chain sponsorship deal
            </p>
            <button
              onClick={handleConnectWallet}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Wallet Info */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-700">Wallet Connected</p>
                  <p className="text-xs text-green-600 font-mono">{account}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-700">USDC Balance:</p>
                  <p className="text-lg font-bold text-green-900">
                    {usdcBalance.toLocaleString()} USDC
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Deal Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Amount (USDC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={dealData.amount}
                    onChange={(e) => setDealData({ ...dealData, amount: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    min="100"
                    max="100000"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    USDC
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your balance: {usdcBalance.toLocaleString()} USDC
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deliverable Type
                </label>
                <select
                  value={dealData.deliverable_type}
                  onChange={(e) => setDealData({ ...dealData, deliverable_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="instagram_post">Instagram Post</option>
                  <option value="tiktok_video">TikTok Video</option>
                  <option value="youtube_video">YouTube Video</option>
                  <option value="brand_ambassador">Brand Ambassador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Details
                </label>
                <textarea
                  value={dealData.description}
                  onChange={(e) => setDealData({ ...dealData, description: e.target.value })}
                  placeholder="Describe what you'd like promoted..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* NFT Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl mb-6 border border-purple-200">
              <h3 className="font-semibold mb-4 text-purple-900">🎨 NFT Collectible Preview</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-4xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">NILBx Deal #{Date.now()}</p>
                    <p className="text-sm text-gray-600">Sponsor: You</p>
                    <p className="text-sm text-gray-600">Athlete: @{targetUser?.username}</p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        Payout: ${payout.toLocaleString()}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {targetUser?.tier} Tier
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-3">
                This NFT will be minted on Polygon and sent to {targetUser?.username}'s wallet as proof of this sponsorship
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h3 className="font-semibold mb-4">💰 Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Deal Amount (USDC):</span>
                  <span className="font-semibold">{dealData.amount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>NFT Mint Fee:</span>
                  <span className="font-semibold">50 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Gas Fee:</span>
                  <span className="font-semibold text-gray-600">~{gasEstimate} USDC</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Cost:</span>
                  <span className="text-purple-600">{totalCost} USDC</span>
                </div>
              </div>
            </div>

            {/* Insufficient Balance Warning */}
            {usdcBalance < totalCost && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-sm text-yellow-700">
                  ⚠️ Insufficient USDC balance. You need {totalCost} USDC but only have {usdcBalance} USDC.
                </p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleDeployContract}
              disabled={deploying || !dealData.amount || !dealData.description || usdcBalance < totalCost}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deploying ? (
                <>
                  <LoadingSpinner size="sm" />
                  Deploying Contract...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Deploy Smart Contract & Mint NFT
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              This will create an immutable on-chain contract on Polygon. Transaction cannot be reversed.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
