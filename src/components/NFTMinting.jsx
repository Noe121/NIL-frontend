/**
 * NFTMinting Component - Interface for minting PlayerLegacyNFTs
 * Allows athletes and sponsors to create legacy NFTs with metadata
 */

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context.jsx';
import { createBlockchainService } from '../services/blockchainService.js';
import { config } from '../utils/config.js';

export function NFTMinting({
  athleteAddress = '',
  recipientAddress = '',
  onMintSuccess = null,
  onMintError = null,
  className = ''
}) {
  const web3 = useWeb3();
  const [blockchainService, setBlockchainService] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    athleteAddress: athleteAddress || web3.account || '',
    recipientAddress: recipientAddress || web3.account || '',
    title: '',
    description: '',
    imageUrl: '',
    externalUrl: '',
    royaltyFee: '500' // 5% default
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Initialize blockchain service
  useEffect(() => {
    if (web3.isConnected) {
      setBlockchainService(createBlockchainService(web3));
    }
  }, [web3.isConnected]);

  // Update form when wallet connects
  useEffect(() => {
    if (web3.account && !formData.athleteAddress) {
      setFormData(prev => ({
        ...prev,
        athleteAddress: web3.account,
        recipientAddress: prev.recipientAddress || web3.account
      }));
    }
  }, [web3.account]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.athleteAddress.trim()) {
      throw new Error('Athlete address is required');
    }
    if (!formData.recipientAddress.trim()) {
      throw new Error('Recipient address is required');
    }
    if (!formData.title.trim()) {
      throw new Error('NFT title is required');
    }
    if (!formData.description.trim()) {
      throw new Error('NFT description is required');
    }
    if (!formData.imageUrl.trim()) {
      throw new Error('Image URL is required');
    }
    
    const royalty = parseInt(formData.royaltyFee);
    if (isNaN(royalty) || royalty < 0 || royalty > 1000) {
      throw new Error('Royalty fee must be between 0 and 1000 (0-10%)');
    }
  };

  // Generate metadata JSON for NFT
  const generateMetadata = () => {
    return {
      name: formData.title,
      description: formData.description,
      image: formData.imageUrl,
      external_url: formData.externalUrl || '',
      attributes: [
        {
          trait_type: 'Athlete',
          value: formData.athleteAddress
        },
        {
          trait_type: 'Royalty Fee',
          value: `${(parseInt(formData.royaltyFee) / 100).toFixed(1)}%`
        },
        {
          trait_type: 'Created By',
          value: 'NILbx Platform'
        }
      ]
    };
  };

  // Upload metadata to IPFS (mock implementation)
  const uploadMetadata = async (metadata) => {
    // In a real implementation, this would upload to IPFS
    // For now, we'll create a data URI
    const jsonString = JSON.stringify(metadata, null, 2);
    const dataUri = `data:application/json;base64,${btoa(jsonString)}`;
    
    if (config.ui.debugMode) {
      console.log('📤 Uploading metadata:', metadata);
      console.log('📍 Metadata URI:', dataUri);
    }
    
    return dataUri;
  };

  // Handle NFT minting
  const handleMint = async () => {
    if (!web3.isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!blockchainService) {
      setError('Blockchain service not available');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Validate form
      validateForm();

      // Generate and upload metadata
      const metadata = generateMetadata();
      const tokenURI = await uploadMetadata(metadata);

      console.log('🎨 Minting NFT with data:', {
        athlete: formData.athleteAddress,
        recipient: formData.recipientAddress,
        tokenURI,
        royaltyFee: parseInt(formData.royaltyFee)
      });

      // Mint the NFT
      const result = await blockchainService.mintLegacyNFT(
        formData.athleteAddress,
        formData.recipientAddress,
        tokenURI,
        parseInt(formData.royaltyFee)
      );

      setSuccess(`NFT minted successfully! Token ID: ${result.tokenId || 'Unknown'}`);
      
      // Clear form
      setFormData({
        athleteAddress: web3.account || '',
        recipientAddress: web3.account || '',
        title: '',
        description: '',
        imageUrl: '',
        externalUrl: '',
        royaltyFee: '500'
      });

      if (onMintSuccess) {
        onMintSuccess(result);
      }

    } catch (error) {
      const errorMessage = error.message || 'Failed to mint NFT';
      setError(errorMessage);
      
      if (onMintError) {
        onMintError(error);
      }
      
      console.error('❌ NFT minting failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if blockchain is enabled
  const isBlockchainEnabled = config.features?.blockchain || false;

  // Don't render if blockchain is disabled
  if (!isBlockchainEnabled) {
    return (
      <div className={`nft-minting-disabled ${className}`}>
        <div className="bg-gray-100 border border-gray-300 text-gray-600 p-4 rounded">
          <p>NFT minting is not available in standalone mode.</p>
          <p className="text-sm mt-1">Switch to centralized mode to access blockchain features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`nft-minting ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Mint Legacy NFT
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Create a unique NFT for athlete legacy content and branding
          </p>
        </div>

        <div className="p-4">
          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Preview Mode */}
          {previewMode ? (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">NFT Preview</h4>
                
                {formData.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={formData.imageUrl}
                      alt={formData.title || 'NFT Preview'}
                      className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LXNpemU9IjEyIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <h5 className="font-medium">{formData.title || 'Untitled NFT'}</h5>
                  <p className="text-sm text-gray-600">{formData.description || 'No description provided'}</p>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div><strong>Athlete:</strong> {formData.athleteAddress || 'Not specified'}</div>
                    <div><strong>Recipient:</strong> {formData.recipientAddress || 'Not specified'}</div>
                    <div><strong>Royalty:</strong> {(parseInt(formData.royaltyFee || 0) / 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form Mode */
            <form className="space-y-4">
              {/* Athlete Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Athlete Address *
                </label>
                <input
                  type="text"
                  name="athleteAddress"
                  value={formData.athleteAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The athlete who will receive royalties from this NFT
                </p>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Address *
                </label>
                <input
                  type="text"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The address that will own this NFT
                </p>
              </div>

              {/* NFT Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NFT Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Championship Victory Moment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* NFT Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe this NFT and what makes it special..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL to the NFT image (IPFS recommended for permanence)
                </p>
              </div>

              {/* External URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  External URL
                </label>
                <input
                  type="url"
                  name="externalUrl"
                  value={formData.externalUrl}
                  onChange={handleInputChange}
                  placeholder="https://nilbx.com/athlete/profile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional link to additional content or athlete profile
                </p>
              </div>

              {/* Royalty Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Royalty Fee (basis points) *
                </label>
                <input
                  type="number"
                  name="royaltyFee"
                  value={formData.royaltyFee}
                  onChange={handleInputChange}
                  min="0"
                  max="1000"
                  step="10"
                  placeholder="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Royalty percentage for secondary sales (500 = 5%, max 10%)
                </p>
              </div>
            </form>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            {!previewMode && (
              <button
                type="button"
                onClick={handleMint}
                disabled={isLoading || !web3.isConnected}
                className="
                  px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                  disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                  text-white font-medium rounded-md transition-all duration-200
                  flex items-center space-x-2
                "
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Minting...</span>
                  </>
                ) : (
                  <>
                    <span>Mint NFT</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTMinting;