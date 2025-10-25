import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkinService } from '../services/checkinService.js';
import CheckinButton from './CheckinButton.jsx';
import SocialVerification from './SocialVerification.jsx';

/**
 * Complete Check-in Flow Component
 * Handles the full check-in process: geo-checkin → social verification → payout
 */
const CheckinFlow = ({
  dealId,
  athleteId,
  onCheckinComplete,
  onCheckinError,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState('checkin'); // 'checkin' | 'social' | 'complete'
  const [checkinData, setCheckinData] = useState(null);
  const [featureFlags, setFeatureFlags] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const loadFeatureFlags = async () => {
    try {
      const flags = await checkinService.getFeatureFlags();
      setFeatureFlags(flags);
    } catch (err) {
      console.warn('Failed to load feature flags, using defaults');
      setFeatureFlags({
        enable_geo_checkins: true,
        enable_social_verification: true,
        enable_auto_payout: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckinSuccess = (result) => {
    setCheckinData(result);
    setCurrentStep('social');
  };

  const handleCheckinError = (error) => {
    setError(error.message);
    if (onCheckinError) {
      onCheckinError(error);
    }
  };

  const handleSocialVerificationSuccess = (result) => {
    setCurrentStep('complete');
    if (onCheckinComplete) {
      onCheckinComplete({
        checkin: checkinData,
        verification: result
      });
    }
  };

  const handleSocialVerificationError = (error) => {
    setError(error.message);
    if (onCheckinError) {
      onCheckinError(error);
    }
  };

  const resetFlow = () => {
    setCurrentStep('checkin');
    setCheckinData(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className={`checkin-flow-loading ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading check-in features...</span>
        </div>
      </div>
    );
  }

  if (!featureFlags?.enable_geo_checkins) {
    return (
      <div className={`checkin-flow-disabled ${className}`}>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">Check-in features are currently disabled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`checkin-flow ${className}`}>
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${currentStep === 'checkin' ? 'text-blue-600' : currentStep === 'social' ? 'text-yellow-600' : 'text-green-600'}`}>
            Step {currentStep === 'checkin' ? '1' : currentStep === 'social' ? '2' : '3'}: {
              currentStep === 'checkin' ? 'Geo Check-in' :
              currentStep === 'social' ? 'Social Verification' :
              'Complete'
            }
          </span>
          <span className="text-xs text-gray-500">
            {currentStep === 'checkin' ? 'Location verification' :
             currentStep === 'social' ? 'Social media post' :
             'Payout triggered'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
            initial={{ width: '33%' }}
            animate={{
              width: currentStep === 'checkin' ? '33%' :
                     currentStep === 'social' ? '66%' : '100%'
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'checkin' && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📍 Check In at Hotspot</h3>
              <p className="text-gray-600 text-sm mb-4">
                Verify you're at the deal location to unlock your discount and start the payout process.
              </p>
            </div>

            <CheckinButton
              dealId={dealId}
              athleteId={athleteId}
              onCheckinSuccess={handleCheckinSuccess}
              onCheckinError={handleCheckinError}
              featureFlags={featureFlags}
            />
          </motion.div>
        )}

        {currentStep === 'social' && checkinData && (
          <motion.div
            key="social"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📱 Complete Social Verification</h3>
              <p className="text-gray-600 text-sm mb-4">
                Post on social media tagging @nilbx and mentioning the hotspot location to complete your check-in and trigger payout.
              </p>
            </div>

            <SocialVerification
              checkinId={checkinData.checkin_id}
              onVerificationSuccess={handleSocialVerificationSuccess}
              onVerificationError={handleSocialVerificationError}
            />

            <div className="mt-4 text-center">
              <button
                onClick={resetFlow}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                ← Back to check-in
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center p-8 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Check-in Complete!</h3>
            <p className="text-green-700 mb-4">
              Your social verification has been confirmed and payout processing has begun.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
              <p className="text-sm text-gray-600">
                <strong>Check-in ID:</strong> {checkinData?.checkin_id}<br/>
                <strong>Status:</strong> Verified & Processing<br/>
                <strong>Next:</strong> Payout will be deposited to your account within 24 hours
              </p>
            </div>
            <button
              onClick={resetFlow}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Check In Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckinFlow;