import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dealService } from '../services/dealService.js';
import { featureFlags } from '../services/featureFlagService.js';

export default function ClaimDeal() {
  const { dealId } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    loadDeal();
  }, [dealId]);

  const loadDeal = async () => {
    try {
      const result = await dealService.getMyDeals();
      const myDeal = result.deals.find(d => d.id == dealId);
      setDeal(myDeal);
    } catch (error) {
      console.error('Failed to load deal:', error);
      alert('Failed to load deal details');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!deal) return;

    setClaiming(true);
    try {
      const result = await dealService.claimDeal(dealId);
      alert(`✅ Success! $${deal.athlete_payout} payout initiated to your bank account!`);
      // Refresh deal status
      await loadDeal();
    } catch (error) {
      alert('Claim failed: ' + error.message);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-12 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Deal Not Found</h2>
          <p className="text-gray-600 mb-6">This deal doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const canClaim = deal.status === 'paid';
  const isClaimed = deal.status === 'claimed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold text-center">Claim Your Deal</h1>
            <p className="text-center text-green-100 mt-2">NIL Opportunity Ready</p>
          </div>

          {/* Deal Details */}
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Payout Amount</span>
                <span className="text-2xl font-bold text-green-600">${deal.athlete_payout}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hotspot</span>
                <span className="font-semibold">{deal.hotspot_name}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Requirements</h3>
              <p className="text-sm text-blue-800 italic">"{deal.requirement}"</p>
            </div>

            {/* Status Indicator */}
            <div className={`rounded-lg p-4 text-center ${
              isClaimed
                ? 'bg-green-100 text-green-800'
                : canClaim
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="font-semibold">
                {isClaimed ? '✅ Claimed' : canClaim ? '💰 Ready to Claim' : '⏳ Pending Payment'}
              </div>
              <div className="text-sm mt-1">
                {isClaimed
                  ? `Claimed on ${new Date(deal.claimed_at || deal.updated_at).toLocaleDateString()}`
                  : canClaim
                  ? 'Payment received - claim your payout now!'
                  : 'Waiting for sponsor payment to complete'
                }
              </div>
            </div>

            {/* Claim Button */}
            {canClaim && !isClaimed && (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {claiming ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payout...
                  </div>
                ) : (
                  'Claim Payout → Bank Account'
                )}
              </button>
            )}

            {isClaimed && (
              <div className="text-center py-4">
                <div className="text-green-600 font-bold text-lg mb-2">🎉 Payout Claimed!</div>
                <p className="text-sm text-gray-600">Your payout has been initiated and should arrive in your bank account within 2-3 business days.</p>
              </div>
            )}

            {!canClaim && !isClaimed && (
              <div className="text-center py-4">
                <div className="text-yellow-600 font-bold text-lg mb-2">⏳ Payment Pending</div>
                <p className="text-sm text-gray-600">The sponsor payment is still processing. You'll be able to claim once it's completed.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="text-center text-xs text-gray-500">
              <p>Deal ID: {deal.id}</p>
              <p>Payment ID: {deal.payment_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}