import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi.js';
import { config } from '../utils/config.js';
import FileUpload from '../components/FileUpload.jsx';
import SocialShare from '../components/SocialShare.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function MarketplacePage() {
  const { apiService } = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/athlete-nfts');
      setProducts(Array.isArray(response) ? response : []);
      setError('');
    } catch (err) {
      // If 401, show demo products for public browsing
      if (err.response?.status === 401) {
        const demoProducts = [
          {
            id: 'demo-1',
            title: 'Championship Game-Worn Jersey',
            price: 89.99,
            category: 'merch',
            metadata: { name: 'Championship Game-Worn Jersey' },
            athlete: 'Alex Johnson',
            image: '/api/placeholder/300/200'
          },
          {
            id: 'demo-2',
            title: 'Victory Celebration Photo',
            price: 24.99,
            category: 'content',
            metadata: { name: 'Victory Celebration Photo' },
            athlete: 'Maria Rodriguez',
            image: '/api/placeholder/300/200'
          },
          {
            id: 'demo-3',
            title: 'Training Session Signed Poster',
            price: 34.99,
            category: 'merch',
            metadata: { name: 'Training Session Signed Poster' },
            athlete: 'James Chen',
            image: '/api/placeholder/300/200'
          },
          {
            id: 'demo-4',
            title: 'Personal Best Record Certificate',
            price: 49.99,
            category: 'content',
            metadata: { name: 'Personal Best Record Certificate' },
            athlete: 'Sarah Williams',
            image: '/api/placeholder/300/300'
          },
          {
            id: 'demo-5',
            title: 'Fan Experience Package',
            price: 99.99,
            category: 'content',
            metadata: { name: 'Fan Experience Package' },
            athlete: 'Marcus Thompson',
            image: '/api/placeholder/300/200'
          },
          {
            id: 'demo-6',
            title: 'Custom Team Merchandise',
            price: 29.99,
            category: 'merch',
            metadata: { name: 'Custom Team Merchandise' },
            athlete: 'Emma Davis',
            image: '/api/placeholder/300/200'
          }
        ];

        // Add NFT products only if blockchain features are enabled
        if (config.features.blockchain) {
          demoProducts.splice(3, 0, {
            id: 'demo-nft-1',
            title: 'Personal Best Record NFT',
            price: 0.75,
            category: 'nft',
            metadata: { name: 'Personal Best Record NFT' },
            athlete: 'Sarah Williams',
            image: '/api/placeholder/300/300'
          });
        }

        setProducts(demoProducts);
        setError('');
      } else {
        setError('Failed to load products');
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.category) {
      setError('Title and category are required');
      return;
    }

    try {
      setSubmitting(true);
      await apiService.post('/merchandise', formData);
      await fetchProducts(); // Refresh the list
      setFormData({ title: '', price: 0, category: '' });
      setError('');
    } catch (err) {
      setError('Failed to list product');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePurchase = async (product) => {
    if (!config.features.blockchain) {
      setError('Blockchain features are not available');
      return;
    }

    try {
      await apiService.post('/nfts/buy', {
        token_id: product.token_id,
        price: product.price
      });
      alert('Purchase initiated! Check your wallet for confirmation.');
    } catch (err) {
      setError('Failed to initiate purchase');
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Marketplace</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Product Listing Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">List Your Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product title"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ({config.features.blockchain ? 'ETH' : 'USD'})
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                >
                  <option value="">Select Category</option>
                  {config.features.blockchain && <option value="nft">NFT</option>}
                  <option value="merch">Merchandise</option>
                  <option value="content">Digital Content</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <FileUpload
                onFileSelect={(file) => console.log('File selected:', file)}
                accept="image/*"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Listing Product...' : 'List Product'}
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Products</option>
            {config.features.blockchain && <option value="nft">NFTs</option>}
            <option value="merch">Merchandise</option>
            <option value="content">Digital Content</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.token_id || product.id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Product Image</span>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.metadata?.name || product.title || 'Unnamed Product'}
                </h3>

                <p className="text-gray-600 mb-1">
                  by {product.athlete || 'Featured Athlete'}
                </p>

                <p className="text-gray-500 text-sm mb-2">
                  Category: {product.category || 'Uncategorized'}
                </p>

                <p className="text-2xl font-bold text-blue-600 mb-4">
                  {product.price} {config.features.blockchain ? 'ETH' : 'USD'}
                </p>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => window.location.href = '/auth?redirect=/marketplace'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
                  >
                    Login to Buy
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      🔒
                    </span>
                  </button>

                  <SocialShare
                    url={`${window.location.origin}/marketplace/${product.token_id || product.id}`}
                    title={product.metadata?.name || product.title || 'Check out this product'}
                  />
                </div>
              </div>
              
              {/* Login Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-center text-white">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="font-medium">Login to Purchase</p>
                  <p className="text-sm opacity-90">Connect your wallet to buy NFTs</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
            <p className="text-gray-400">Be the first to list a product!</p>
          </div>
        )}
      </div>
    </div>
  );
}