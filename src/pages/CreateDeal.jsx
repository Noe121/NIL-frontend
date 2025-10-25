import { useState } from 'react';
import { dealService } from '../services/dealService.js';
import { featureFlags } from '../services/featureFlagService.js';

export default function CreateDeal() {
  const [form, setForm] = useState({
    athlete_id: '',
    amount: '',
    hotspot_name: '',
    requirement: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user ID from localStorage or context
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const sponsorId = userData.id || 1; // Default for demo

      const payment = await dealService.createDeal({
        ...form,
        sponsor_id: sponsorId,
        amount: parseFloat(form.amount)
      });

      // Redirect to Stripe checkout
      window.location.href = payment.checkout_url;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!featureFlags.isEnabled('enable_deal_creation')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-12 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-4">Deal Creation Unavailable</h2>
          <p className="text-gray-600">This feature is temporarily disabled. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create NIL Deal</h1>
          <p className="text-lg text-gray-600">Connect athletes with sponsors through Name, Image & Likeness opportunities</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Athlete ID
                </label>
                <input
                  name="athlete_id"
                  type="number"
                  placeholder="123"
                  value={form.athlete_id}
                  onChange={(e) => setForm({ ...form, athlete_id: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Amount ($)
                </label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="500.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotspot Name
              </label>
              <input
                name="hotspot_name"
                placeholder="Downtown Grill & Bar"
                value={form.hotspot_name}
                onChange={(e) => setForm({ ...form, hotspot_name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                name="requirement"
                placeholder="1 Instagram post per week + tag @NILBx + story highlight featuring the hotspot"
                value={form.requirement}
                onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Pay with Card → Create Deal'
              )}
            </button>

            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>💰 NILBx Service Fee: 20% (${(parseFloat(form.amount || 0) * 0.20).toFixed(2)})</p>
              <p>🏆 Athlete Receives: 80% (${(parseFloat(form.amount || 0) * 0.80).toFixed(2)})</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}