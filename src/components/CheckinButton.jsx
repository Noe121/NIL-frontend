import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkinService } from '../services/checkinService.js';
import Button from './Button.jsx';

/**
 * Check-in Button Component
 * Allows athletes to check-in at hotspots for NIL deals
 */
const CheckinButton = ({
  dealId,
  athleteId,
  onCheckinSuccess,
  onCheckinError,
  className = '',
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [checkinData, setCheckinData] = useState(null);
  const [featureFlags, setFeatureFlags] = useState(null);

  // Load feature flags on mount
  useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        const flags = await checkinService.getFeatureFlags();
        setFeatureFlags(flags);
      } catch (err) {
        console.warn('Could not load feature flags:', err);
        // Use defaults
        setFeatureFlags({
          enable_geo_checkins: true,
          enable_social_verification: true,
          enable_auto_payout: true
        });
      }
    };

    loadFeatureFlags();
  }, []);

  const handleCheckin = async () => {
    if (disabled || loading || verified) return;

    setLoading(true);
    setError(null);

    try {
      const result = await checkinService.checkin(dealId, athleteId);

      setCheckinData(result);

      if (result.geo_verified) {
        setVerified(true);
        if (onCheckinSuccess) {
          onCheckinSuccess(result);
        }

        // Show success message
        alert(`✅ Geo-verified at hotspot!\nDistance: ${checkinService.formatDistance(result.distance_meters)}\nPayout: $${result.payout}\n\n${featureFlags?.enable_social_verification ? 'Next: Post on social media to complete check-in!' : 'Check-in complete!'}`);
      } else {
        // Show rejection message
        const message = `❌ Not at hotspot location.\nDistance: ${checkinService.formatDistance(result.distance_meters)}\n\nPlease move closer to the hotspot and try again.`;
        setError(message);
        if (onCheckinError) {
          onCheckinError(result);
        }
        alert(message);
      }
    } catch (err) {
      const errorMessage = err.message || 'Check-in failed. Please try again.';
      setError(errorMessage);
      if (onCheckinError) {
        onCheckinError(err);
      }
      alert(`❌ Check-in Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return '📍 Checking location...';
    if (verified) return '✅ Geo-Verified!';
    return '📍 Check-in at Hotspot';
  };

  const getButtonVariant = () => {
    if (verified) return 'success';
    if (error) return 'danger';
    return 'primary';
  };

  const isButtonDisabled = () => {
    return disabled || loading || verified || !featureFlags?.enable_geo_checkins;
  };

  if (!featureFlags?.enable_geo_checkins) {
    return (
      <div className={`text-center p-4 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-600">📍 Check-in feature is currently disabled</p>
      </div>
    );
  }

  return (
    <div className={`checkin-button-container ${className}`}>
      <motion.div
        whileHover={!isButtonDisabled() ? { scale: 1.02 } : {}}
        whileTap={!isButtonDisabled() ? { scale: 0.98 } : {}}
      >
        <Button
          onClick={handleCheckin}
          disabled={isButtonDisabled()}
          variant={getButtonVariant()}
          size="large"
          fullWidth
          className="min-h-[48px] text-lg font-semibold"
          icon={loading ? '⏳' : verified ? '✅' : '📍'}
          aria-label={verified ? 'Check-in completed successfully' : 'Check-in at hotspot location'}
        >
          {getButtonText()}
        </Button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verified && checkinData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="text-green-700 text-sm">
              <p className="font-semibold">🎉 Check-in Successful!</p>
              <p>Distance from hotspot: {checkinService.formatDistance(checkinData.distance_meters)}</p>
              <p>Potential payout: ${checkinData.payout}</p>
              {featureFlags?.enable_social_verification && (
                <p className="mt-2 text-xs">
                  💡 Next step: Post on social media with @nilbx to complete verification and trigger payout!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Getting your location...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckinButton;