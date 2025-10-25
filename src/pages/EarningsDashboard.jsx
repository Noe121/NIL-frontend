import { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService.js';

export default function EarningsDashboard() {
  const [userData, setUserData] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [payoutHistory, setPayoutHistory] = useState(null);
  const [tiers, setTiers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const userJSON = localStorage.getItem('user_data');
      const user = userJSON ? JSON.parse(userJSON) : { id: 1, name: 'Demo User', followers: 5000 };
      setUserData(user);

      // Load all dashboard data in parallel
      const [earningsData, historyData, tiersData, tierByFollowers] = await Promise.all([
        paymentService.getEarningsSummary(user.id),
        paymentService.getPayoutHistory(user.id, 10, 0),
        paymentService.getAllTiers(),
        user.followers ? paymentService.getTierByFollowers(user.followers) : null
      ]);

      setEarnings(earningsData);
      setPayoutHistory(historyData);
      setTiers(tiersData);

      // Store tier info for display
      if (tierByFollowers) {
        setEarnings(prev => ({
          ...prev,
          current_tier_info: tierByFollowers
        }));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentTierInfo = earnings?.current_tier_info || earnings?.tier_info;
  const totalEarnings = earnings?.total_earnings || 0;
  const totalDeals = earnings?.total_deals || 0;
  const recentPayouts = payoutHistory?.payouts || [];
  const summary = payoutHistory?.summary || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Earnings Dashboard</h1>
          <p className="text-lg text-gray-600">Track your NIL earnings and payment tier progress</p>
        </div>

        {/* Welcome Card */}
        {userData && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h2>
                <p className="text-gray-600">
                  👥 {userData.followers?.toLocaleString() || 'N/A'} followers
                </p>
              </div>
              {currentTierInfo && (
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Current Tier</div>
                  <div className="text-2xl font-bold text-indigo-600 uppercase">
                    {currentTierInfo.current_tier}
                  </div>
                  <div className="text-sm text-green-600 font-semibold mt-1">
                    {currentTierInfo.multiplier}x multiplier
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="text-gray-600 text-sm mb-2">Total Earnings</div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">
              Average: ${summary.average_payout ? summary.average_payout.toFixed(2) : '0.00'}
            </div>
          </div>

          {/* Total Deals */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="text-gray-600 text-sm mb-2">Total Deals</div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalDeals}</div>
            <div className="text-xs text-gray-500">
              This {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
            <div className="text-gray-600 text-sm mb-2">Pending Payouts</div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              ${(summary.pending_amount || 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {summary.pending_count || 0} pending
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              activeTab === 'payouts'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Payout History
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              activeTab === 'tiers'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Tier Information
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Payment Overview</h3>

              {currentTierInfo && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Current Tier Status</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Tier</div>
                      <div className="text-2xl font-bold text-indigo-600 uppercase">
                        {currentTierInfo.current_tier}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Payout Multiplier</div>
                      <div className="text-2xl font-bold text-green-600">
                        {currentTierInfo.multiplier}x
                      </div>
                    </div>
                    {currentTierInfo.next_tier_followers && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Next Tier Threshold</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {currentTierInfo.next_tier_followers?.toLocaleString()} followers
                        </div>
                      </div>
                    )}
                    {currentTierInfo.followers_to_next_tier !== undefined && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Followers to Next Tier</div>
                        <div className="text-lg font-semibold text-blue-600">
                          {currentTierInfo.followers_to_next_tier?.toLocaleString()} more
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">How Payment Tiers Work</h4>
                <p className="text-gray-700 text-sm">
                  Your payout multiplier automatically increases as you grow your followers. More followers = higher earnings on each deal!
                </p>
              </div>
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Payout History</h3>

              {recentPayouts.length > 0 ? (
                <div className="space-y-3">
                  {recentPayouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          Deal #{payout.deal_id || payout.id}
                        </div>
                        <div className="text-sm text-gray-600">
                          {payout.tier_name ? `Tier: ${payout.tier_name.toUpperCase()}` : 'Standard Payout'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(payout.created_at || payout.updated_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${payout.net_payout?.toFixed(2) || payout.final_payout_amount?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {payout.multiplier ? `${payout.multiplier}x multiplier` : 'Paid'}
                        </div>
                      </div>

                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payout.payout_status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payout.payout_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {payout.payout_status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-600">No payout history yet. Complete your first deal to see payouts here!</p>
                </div>
              )}

              {payoutHistory?.pagination && (
                <div className="text-center text-sm text-gray-600 mt-6">
                  Showing {recentPayouts.length} of {payoutHistory.pagination.total} total payouts
                </div>
              )}
            </div>
          )}

          {/* Tiers Tab */}
          {activeTab === 'tiers' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Tiers</h3>

              {tiers?.tiers ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tiers.tiers.map((tier, idx) => (
                    <div
                      key={tier.tier_name || idx}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        currentTierInfo?.current_tier === tier.tier_name
                          ? 'bg-indigo-50 border-indigo-500 shadow-lg'
                          : 'bg-white border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 uppercase">
                            {tier.tier_name}
                          </h4>
                          {tier.min_followers && (
                            <p className="text-sm text-gray-600">
                              From {tier.min_followers?.toLocaleString()} followers
                            </p>
                          )}
                        </div>
                        {currentTierInfo?.current_tier === tier.tier_name && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded p-4 mb-4">
                        <div className="text-sm text-gray-600">Multiplier</div>
                        <div className="text-3xl font-bold text-green-600">
                          {tier.multiplier}x
                        </div>
                      </div>

                      {tier.max_followers && (
                        <p className="text-sm text-gray-600">
                          Up to {tier.max_followers?.toLocaleString()} followers
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Loading tier information...</p>
              )}

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Tip</h4>
                <p className="text-gray-700 text-sm">
                  Each tier has a higher multiplier applied to your payout. Grow your follower count to unlock higher tiers and earn more per deal!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
