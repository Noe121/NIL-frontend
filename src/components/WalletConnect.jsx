/**
 * WalletConnect Component - Handles Web3 wallet connection
 * Provides user interface for connecting MetaMask and other Web3 wallets
 */

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context.jsx';
import { config } from '../utils/config.js';

export function WalletConnect({ 
  variant = 'button', // 'button', 'card', 'minimal'
  size = 'medium', // 'small', 'medium', 'large'
  showBalance = true,
  showNetwork = true,
  onConnect = null,
  onDisconnect = null,
  className = ''
}) {
  const {
    account,
    isConnected,
    isLoading,
    error,
    network,
    networkSupported,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getBalance,
    clearError
  } = useWeb3();

  const [balance, setBalance] = useState('0');
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // Load balance when account changes
  useEffect(() => {
    if (isConnected && account && showBalance) {
      loadBalance();
    }
  }, [isConnected, account, showBalance]);

  // Load wallet balance
  const loadBalance = async () => {
    try {
      setIsBalanceLoading(true);
      const balanceValue = await getBalance();
      setBalance(parseFloat(balanceValue).toFixed(4));
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      clearError();
      const connectedAccount = await connectWallet();
      
      if (onConnect) {
        onConnect(connectedAccount);
      }
      
      if (config.ui.debugMode) {
        console.log('🔗 Wallet connected from component:', connectedAccount);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnectWallet();
    setBalance('0');
    
    if (onDisconnect) {
      onDisconnect();
    }
    
    if (config.ui.debugMode) {
      console.log('🔌 Wallet disconnected from component');
    }
  };

  // Handle network switch
  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork();
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get size classes
  const getSizeClasses = () => {
    const sizes = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base', 
      large: 'px-6 py-3 text-lg'
    };
    return sizes[size] || sizes.medium;
  };

  // Check if blockchain is enabled
  const isBlockchainEnabled = config.features?.blockchain || false;

  // Don't render if blockchain is disabled
  if (!isBlockchainEnabled) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div className={`wallet-connect-error ${className}`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button
              onClick={clearError}
              className="ml-2 text-red-500 hover:text-red-700"
              aria-label="Clear error"
            >
              ✕
            </button>
          </div>
          {error.includes('MetaMask') && (
            <div className="mt-2">
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline"
              >
                Install MetaMask
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Network warning
  if (isConnected && !networkSupported) {
    return (
      <div className={`wallet-connect-network-warning ${className}`}>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm">Unsupported network</span>
            <button
              onClick={handleSwitchNetwork}
              className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
            >
              Switch Network
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Connected state - Card variant
  if (isConnected && variant === 'card') {
    return (
      <div className={`wallet-connect-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Wallet Icon */}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-900">
                {formatAddress(account)}
              </div>
              
              {showNetwork && network && (
                <div className="text-xs text-gray-500">
                  {network.name}
                </div>
              )}
              
              {showBalance && (
                <div className="text-xs text-gray-500">
                  {isBalanceLoading ? 'Loading...' : `${balance} ETH`}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleDisconnect}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            title="Disconnect wallet"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  // Connected state - Button variant
  if (isConnected) {
    return (
      <div className={`wallet-connect-connected ${className}`}>
        <div className="flex items-center space-x-2">
          {variant === 'minimal' ? (
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{formatAddress(account)}</span>
              {showBalance && !isBalanceLoading && (
                <span className="text-gray-500">({balance} ETH)</span>
              )}
            </div>
          ) : (
            <>
              <div className={`flex items-center space-x-2 bg-green-100 border border-green-400 text-green-700 rounded ${getSizeClasses()}`}>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{formatAddress(account)}</span>
                {showBalance && !isBalanceLoading && (
                  <span>({balance} ETH)</span>
                )}
              </div>
              
              <button
                onClick={handleDisconnect}
                className={`bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors ${getSizeClasses()}`}
                title="Disconnect wallet"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Not connected state
  return (
    <div className={`wallet-connect-disconnected ${className}`}>
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`
          bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
          disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
          text-white font-medium rounded transition-all duration-200
          flex items-center space-x-2 ${getSizeClasses()}
        `}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <span>Connect Wallet</span>
            {variant !== 'minimal' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </>
        )}
      </button>
      
      {variant === 'card' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Connect your Web3 wallet to access blockchain features
        </div>
      )}
    </div>
  );
}

export default WalletConnect;