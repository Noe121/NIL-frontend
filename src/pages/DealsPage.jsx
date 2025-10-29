/**
 * DealsPage - Page for athletes/influencers to view and manage their deals
 * Shows pending, active, and completed deals
 * Date: October 26, 2025
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import DealAcceptanceCard from '../components/Contracts/DealAcceptanceCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // pending, active, completed
  const { user } = useAuth();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/deals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const data = await response.json();
      setDeals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDeal = async (dealId) => {
    try {
      const response = await fetch(`/api/v1/deals/${dealId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          athlete_id: user?.id,
          digital_signature: `${user?.username}_${new Date().toISOString()}`,
          accept_terms: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to accept deal');
      }

      // Refresh deals
      await fetchDeals();

      // Show success message
      alert('Deal accepted! Your payout will be processed within 24-48 hours.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRejectDeal = async (dealId) => {
    try {
      const response = await fetch(`/api/v1/deals/${dealId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject deal');
      }

      // Refresh deals
      await fetchDeals();

      alert('Deal rejected successfully.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (activeTab === 'pending') {
      return deal.status === 'pending_acceptance' || deal.status === 'pending_compliance';
    } else if (activeTab === 'active') {
      return deal.status === 'active';
    } else {
      return deal.status === 'completed' || deal.status === 'cancelled';
    }
  });

  const tabCounts = {
    pending: deals.filter(d => d.status === 'pending_acceptance' || d.status === 'pending_compliance').length,
    active: deals.filter(d => d.status === 'active').length,
    completed: deals.filter(d => d.status === 'completed' || d.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading your deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Deals</h1>
          <p className="text-lg text-gray-600">
            Manage your sponsorship opportunities and earnings
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'pending'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending {tabCounts.pending > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-orange-500 rounded-full">
                  {tabCounts.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'active'
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Active {tabCounts.active > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-green-500 rounded-full">
                  {tabCounts.active}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'completed'
                  ? 'bg-gray-50 text-gray-600 border-b-2 border-gray-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed ({tabCounts.completed})
            </button>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredDeals.length > 0 ? (
            filteredDeals.map(deal => (
              <DealAcceptanceCard
                key={deal.id}
                deal={deal}
                onAccept={handleAcceptDeal}
                onReject={handleRejectDeal}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-16">
              <div className="text-6xl mb-4">
                {activeTab === 'pending' && '📬'}
                {activeTab === 'active' && '🤝'}
                {activeTab === 'completed' && '✅'}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {activeTab === 'pending' && 'No Pending Deals'}
                {activeTab === 'active' && 'No Active Deals'}
                {activeTab === 'completed' && 'No Completed Deals'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'pending' && 'New sponsorship offers will appear here'}
                {activeTab === 'active' && 'Accepted deals will appear here'}
                {activeTab === 'completed' && 'Your deal history will appear here'}
              </p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {deals.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Earnings Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  ${deals
                    .filter(d => d.status === 'completed')
                    .reduce((sum, d) => sum + (d.payout_amount || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Earned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  ${deals
                    .filter(d => d.status === 'active')
                    .reduce((sum, d) => sum + (d.payout_amount || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">Active Deals</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  ${deals
                    .filter(d => d.status === 'pending_acceptance')
                    .reduce((sum, d) => sum + (d.payout_amount || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">Pending Offers</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
