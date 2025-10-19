/**
 * BlockchainDashboard Component - Main interface for blockchain features
 * Combines wallet connection, NFT minting, sponsorship tasks, and analytics
 */

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context.jsx';
import { createBlockchainService } from '../services/blockchainService.js';
import WalletConnect from './WalletConnect.jsx';
import NFTMinting from './NFTMinting.jsx';
import SponsorshipTasks from './SponsorshipTasks.jsx';
import { config } from '../utils/config.js';

export function BlockchainDashboard({
  userRole = 'athlete', // 'athlete', 'sponsor', 'fan'
  defaultTab = 'overview',
  className = ''
}) {
  const web3 = useWeb3();
  const [blockchainService, setBlockchainService] = useState(null);

  // State management
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [stats, setStats] = useState({
    nftCount: '0',
    totalTasks: '0',
    earnings: '0',
    spending: '0',
    loading: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize blockchain service
  useEffect(() => {
    if (web3.isConnected) {
      setBlockchainService(createBlockchainService(web3));
    }
  }, [web3.isConnected]);

  // Load dashboard stats
  useEffect(() => {
    if (blockchainService && web3.account) {
      loadDashboardStats();
    }
  }, [blockchainService, web3.account]);

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    if (!blockchainService || !web3.account) return;

    try {
      setStats(prev => ({ ...prev, loading: true }));

      const [
        nftCount,
        totalTasks,
        earnings,
        spending
      ] = await Promise.allSettled([
        blockchainService.getAthleteNFTCount(web3.account),
        blockchainService.getTotalTasks(),
        blockchainService.getAthleteEarnings(web3.account),
        blockchainService.getSponsorSpending(web3.account)
      ]);

      setStats({
        nftCount: nftCount.status === 'fulfilled' ? nftCount.value : '0',
        totalTasks: totalTasks.status === 'fulfilled' ? totalTasks.value : '0',
        earnings: earnings.status === 'fulfilled' ? earnings.value : '0',
        spending: spending.status === 'fulfilled' ? spending.value : '0',
        loading: false
      });

      if (config.ui.debugMode) {
        console.log('📊 Dashboard stats loaded:', {
          nftCount: nftCount.value,
          totalTasks: totalTasks.value,
          earnings: earnings.value,
          spending: spending.value
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle successful NFT mint
  const handleNFTMintSuccess = (result) => {
    console.log('🎨 NFT minted successfully:', result);
    loadDashboardStats(); // Refresh stats
  };

  // Handle task updates
  const handleTaskUpdate = (updateInfo) => {
    console.log('📋 Task updated:', updateInfo);
    loadDashboardStats(); // Refresh stats
  };

  // Get tabs based on user role
  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Overview', icon: '📊' }
    ];

    const roleTabs = {
      athlete: [
        { id: 'tasks', label: 'My Tasks', icon: '📋' },
        { id: 'nfts', label: 'Legacy NFTs', icon: '🎨' }
      ],
      sponsor: [
        { id: 'tasks', label: 'Sponsorships', icon: '📋' },
        { id: 'nfts', label: 'Mint NFTs', icon: '🎨' }
      ],
      fan: [
        { id: 'marketplace', label: 'NFT Marketplace', icon: '🛒' },
        { id: 'activity', label: 'Activity', icon: '📈' }
      ]
    };

    return [...baseTabs, ...(roleTabs[userRole] || [])];
  };

  // Check if blockchain is enabled
  const isBlockchainEnabled = config.features?.blockchain || false;

  // Don't render if blockchain is disabled
  if (!isBlockchainEnabled) {
    return (
      <div className={`blockchain-dashboard-disabled ${className}`}>
        <div className="bg-gray-100 border border-gray-300 text-gray-600 p-6 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">⛓️</div>
            <h3 className="text-lg font-medium mb-2">Blockchain Features Disabled</h3>
            <p>Blockchain features are not available in standalone mode.</p>
            <p className="text-sm mt-1">Switch to centralized mode to access Web3 features.</p>
            
            <button
              onClick={() => {
                if (config.utils?.switchToCentralized) {
                  config.utils.switchToCentralized();
                } else {
                  window.location.href = '/?mode=centralized';
                }
              }}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            >
              Switch to Centralized Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`blockchain-dashboard ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Blockchain Dashboard
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {userRole === 'athlete' ? 'Manage your NFTs and sponsorship tasks' :
                 userRole === 'sponsor' ? 'Create sponsorships and mint NFTs' :
                 'Explore NFTs and sponsorship activities'}
              </p>
            </div>
            
            {/* Wallet Connection */}
            <WalletConnect 
              variant="card"
              size="medium"
              showBalance={true}
              showNetwork={true}
            />
          </div>
        </div>

        {/* Connection Required Notice */}
        {!web3.isConnected && (
          <div className="bg-yellow-50 border-b border-yellow-200 p-4">
            <div className="flex items-center space-x-2">
              <div className="text-yellow-600">⚠️</div>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Connect your wallet to access blockchain features
                </p>
                <p className="text-xs text-yellow-700">
                  You'll need MetaMask or another Web3 wallet to interact with smart contracts
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-red-600">❌</div>
                <span className="text-sm text-red-800">{error}</span>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4">
            {getTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Total NFTs</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {stats.loading ? '...' : stats.nftCount}
                      </p>
                    </div>
                    <div className="text-2xl">🎨</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Total Tasks</p>
                      <p className="text-2xl font-bold text-green-900">
                        {stats.loading ? '...' : stats.totalTasks}
                      </p>
                    </div>
                    <div className="text-2xl">📋</div>
                  </div>
                </div>

                {userRole === 'athlete' && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">Earnings</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {stats.loading ? '...' : `${parseFloat(stats.earnings).toFixed(3)} ETH`}
                        </p>
                      </div>
                      <div className="text-2xl">💰</div>
                    </div>
                  </div>
                )}

                {userRole === 'sponsor' && (
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-800">Spending</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {stats.loading ? '...' : `${parseFloat(stats.spending).toFixed(3)} ETH`}
                        </p>
                      </div>
                      <div className="text-2xl">💳</div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Network</p>
                      <p className="text-lg font-bold text-gray-900">
                        {web3.network?.name || 'Disconnected'}
                      </p>
                    </div>
                    <div className="text-2xl">🌐</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {web3.isConnected && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {userRole === 'athlete' && (
                      <button
                        onClick={() => setActiveTab('tasks')}
                        className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="text-lg mb-1">📋</div>
                        <div className="font-medium text-sm">View Tasks</div>
                        <div className="text-xs text-gray-600">Check your sponsorship assignments</div>
                      </button>
                    )}
                    
                    {userRole === 'sponsor' && (
                      <button
                        onClick={() => setActiveTab('tasks')}
                        className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="text-lg mb-1">📋</div>
                        <div className="font-medium text-sm">Create Task</div>
                        <div className="text-xs text-gray-600">Set up new sponsorship opportunity</div>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveTab('nfts')}
                      className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="text-lg mb-1">🎨</div>
                      <div className="font-medium text-sm">
                        {userRole === 'sponsor' ? 'Mint NFT' : 'View NFTs'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {userRole === 'sponsor' ? 'Create legacy NFTs for athletes' : 'Browse your NFT collection'}
                      </div>
                    </button>

                    <button
                      onClick={loadDashboardStats}
                      className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="text-lg mb-1">🔄</div>
                      <div className="font-medium text-sm">Refresh Data</div>
                      <div className="text-xs text-gray-600">Update dashboard statistics</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <SponsorshipTasks
              userRole={userRole}
              userAddress={web3.account}
              onTaskCreated={handleTaskUpdate}
              onTaskUpdated={handleTaskUpdate}
            />
          )}

          {/* NFTs Tab */}
          {activeTab === 'nfts' && (
            <div>
              {userRole === 'sponsor' ? (
                <NFTMinting
                  athleteAddress=""
                  recipientAddress={web3.account}
                  onMintSuccess={handleNFTMintSuccess}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-lg font-medium mb-2">NFT Collection</h3>
                  <p className="text-gray-600">NFT viewing functionality coming soon</p>
                </div>
              )}
            </div>
          )}

          {/* Marketplace Tab (Fan Role) */}
          {activeTab === 'marketplace' && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-lg font-medium mb-2">NFT Marketplace</h3>
              <p className="text-gray-600">Marketplace functionality coming soon</p>
            </div>
          )}

          {/* Activity Tab (Fan Role) */}
          {activeTab === 'activity' && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-medium mb-2">Activity Feed</h3>
              <p className="text-gray-600">Activity tracking coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlockchainDashboard;