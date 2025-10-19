/**
 * Web3Context - Blockchain integration context for NILbx platform
 * Handles wallet connections, smart contract interactions, and Ethereum transactions
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';
import { config } from '../utils/config.js';

// Smart contract ABIs (derived from the Solidity contracts)
import { PlayerLegacyNFTABI, SponsorshipContractABI } from '../contracts/abis.js';

// Action types for reducer
const WEB3_ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_SIGNER: 'SET_SIGNER',
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_NETWORK: 'SET_NETWORK',
  SET_CONTRACTS: 'SET_CONTRACTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  DISCONNECT: 'DISCONNECT'
};

// Initial state
const initialState = {
  provider: null,
  signer: null,
  account: null,
  network: null,
  contracts: {
    playerLegacyNFT: null,
    sponsorshipContract: null
  },
  isConnected: false,
  isLoading: false,
  error: null,
  networkSupported: false
};

// Web3 reducer
function web3Reducer(state, action) {
  switch (action.type) {
    case WEB3_ACTIONS.SET_PROVIDER:
      return { ...state, provider: action.payload };
      
    case WEB3_ACTIONS.SET_SIGNER:
      return { ...state, signer: action.payload };
      
    case WEB3_ACTIONS.SET_ACCOUNT:
      return { 
        ...state, 
        account: action.payload,
        isConnected: !!action.payload
      };
      
    case WEB3_ACTIONS.SET_NETWORK:
      return { 
        ...state, 
        network: action.payload,
        networkSupported: action.payload ? action.payload.chainId === parseInt(config.blockchain?.chainId || '1') : false
      };
      
    case WEB3_ACTIONS.SET_CONTRACTS:
      return { ...state, contracts: action.payload };
      
    case WEB3_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case WEB3_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
      
    case WEB3_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
      
    case WEB3_ACTIONS.DISCONNECT:
      return { 
        ...initialState,
        provider: state.provider // Keep provider for read-only operations
      };
      
    default:
      return state;
  }
}

// Create context
const Web3Context = createContext();

// Contract addresses from deployment
const CONTRACT_ADDRESSES = {
  PlayerLegacyNFT: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // From deployment.json
  SponsorshipContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' // From deployment.json
};

// Web3 Provider Component
export function Web3Provider({ children }) {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  // Initialize provider on mount
  useEffect(() => {
    initializeProvider();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Initialize Web3 provider
  const initializeProvider = async () => {
    try {
      dispatch({ type: WEB3_ACTIONS.SET_LOADING, payload: true });

      let provider;
      
      if (window.ethereum) {
        // MetaMask or other injected wallet
        provider = new ethers.BrowserProvider(window.ethereum);
      } else if (config.blockchain?.rpcUrl) {
        // Fallback to RPC provider
        provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
      } else {
        throw new Error('No Web3 provider available');
      }

      dispatch({ type: WEB3_ACTIONS.SET_PROVIDER, payload: provider });

      // Get network info
      const network = await provider.getNetwork();
      dispatch({ type: WEB3_ACTIONS.SET_NETWORK, payload: network });

      // Initialize contracts (read-only)
      await initializeContracts(provider);

      dispatch({ type: WEB3_ACTIONS.SET_LOADING, payload: false });
      
      if (config.ui.debugMode) {
        console.log('🔗 Web3 provider initialized:', {
          hasMetaMask: !!window.ethereum,
          network: network.name,
          chainId: network.chainId.toString()
        });
      }
    } catch (error) {
      console.error('Failed to initialize Web3 provider:', error);
      dispatch({ type: WEB3_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Initialize smart contracts
  const initializeContracts = async (provider, signer = null) => {
    try {
      const contractProvider = signer || provider;
      
      const contracts = {
        playerLegacyNFT: new ethers.Contract(
          CONTRACT_ADDRESSES.PlayerLegacyNFT,
          PlayerLegacyNFTABI,
          contractProvider
        ),
        sponsorshipContract: new ethers.Contract(
          CONTRACT_ADDRESSES.SponsorshipContract,
          SponsorshipContractABI,
          contractProvider
        )
      };

      dispatch({ type: WEB3_ACTIONS.SET_CONTRACTS, payload: contracts });
      
      if (config.ui.debugMode) {
        console.log('📄 Smart contracts initialized:', Object.keys(contracts));
      }
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
      throw error;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      dispatch({ type: WEB3_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: WEB3_ACTIONS.CLEAR_ERROR });

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = accounts[0];
      dispatch({ type: WEB3_ACTIONS.SET_ACCOUNT, payload: account });

      // Get signer
      const signer = await state.provider.getSigner();
      dispatch({ type: WEB3_ACTIONS.SET_SIGNER, payload: signer });

      // Initialize contracts with signer
      await initializeContracts(state.provider, signer);

      dispatch({ type: WEB3_ACTIONS.SET_LOADING, payload: false });

      if (config.ui.debugMode) {
        console.log('💰 Wallet connected:', account);
      }

      return account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      dispatch({ type: WEB3_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    dispatch({ type: WEB3_ACTIONS.DISCONNECT });
    
    if (config.ui.debugMode) {
      console.log('🔌 Wallet disconnected');
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      dispatch({ type: WEB3_ACTIONS.SET_ACCOUNT, payload: accounts[0] });
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    // Reload the page as recommended by MetaMask
    window.location.reload();
  };

  // Switch to correct network
  const switchNetwork = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const targetChainId = '0x' + parseInt(config.blockchain?.chainId || '1').toString(16);
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }]
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  };

  // Get account balance
  const getBalance = async (address = state.account) => {
    if (!state.provider || !address) return '0';
    
    try {
      const balance = await state.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getBalance,
    
    // Contract helpers
    contracts: state.contracts,
    
    // Utilities
    clearError: () => dispatch({ type: WEB3_ACTIONS.CLEAR_ERROR }),
    isBlockchainEnabled: config.features?.blockchain || false
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook to use Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  
  return context;
}

// Export context for advanced usage
export { Web3Context };