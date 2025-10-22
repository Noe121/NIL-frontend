import { useState, useEffect } from 'react';
import { dealService } from '../services/dealService.js';

export default function FutureDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState('');

  useEffect(() => {
    loadDeals();
  }, [selectedSchool]);

  const loadDeals = async () => {
    try {
      const result = await dealService.getFutureDeals(selectedSchool || null);
      setDeals(result.deals);
    } catch (error) {
      console.error('Failed to load future deals:', error);
      alert('Failed to load future deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const preSignDeal = async (dealId) => {
    try {
      const result = await dealService.preSignFutureDeal(dealId);
      alert(`✅ Pre-signed successfully! $${result.monthly_amount}/month deal reserved for you.`);

      // Refresh deals to update signup counts
      await loadDeals();
    } catch (error) {
      alert('Pre-sign failed: ' + error.message);
    }
  };

  const schools = [...new Set(deals.map(deal => deal.school_name).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading future NIL deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Future NIL Deals</h1>
          <p className="text-xl text-gray-600 mb-8">Pre-sign for upcoming Name, Image & Likeness opportunities</p>

          {/* School Filter */}
          <div className="inline-block">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="">All Schools</option>
              {schools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Future Deals Available</h3>
            <p className="text-gray-600">Check back later for new NIL opportunities.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map(deal => (
              <div key={deal.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                  <h3 className="font-bold text-xl mb-1">{deal.hotspot_name}</h3>
                  <p className="text-purple-100">{deal.school_name}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Pricing */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      ${deal.monthly_amount}/month
                    </div>
                    <div className="text-sm text-gray-500">
                      {deal.duration_months} months total
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Signed up:</span>
                      <span className="font-semibold">
                        {deal.signed_count}/{deal.max_signups}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((deal.signed_count / deal.max_signups) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Requirements</h4>
                    <p className="text-sm text-blue-800 italic">"{deal.requirement}"</p>
                  </div>

                  {/* Pre-sign Button */}
                  <button
                    onClick={() => preSignDeal(deal.id)}
                    disabled={deal.signed_count >= deal.max_signups}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {deal.signed_count >= deal.max_signups ? (
                      'Deal Full'
                    ) : (
                      'Pre-Sign Deal'
                    )}
                  </button>

                  {/* Deal Info */}
                  <div className="text-center text-xs text-gray-500 pt-2 border-t">
                    <p>Deal ID: {deal.id}</p>
                    <p>Posted: {new Date(deal.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Pre-Signing Works</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="font-semibold mb-2">Pre-Sign</h3>
                <p className="text-sm text-gray-600">Reserve your spot in future NIL deals before they become available to everyone.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-semibold mb-2">Early Access</h3>
                <p className="text-sm text-gray-600">Get priority access when deals launch, before the general public.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold mb-2">Guaranteed Spot</h3>
                <p className="text-sm text-gray-600">Your pre-signature guarantees you'll be considered for the deal when it becomes available.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}