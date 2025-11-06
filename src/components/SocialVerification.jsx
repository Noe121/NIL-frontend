import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { checkinService } from '../services/checkinService.js';
import Button from './Button.jsx';
import FormField from './FormField.jsx';

/**
 * Social Verification Component
 * Handles social media post verification for check-ins
 */
const SocialVerification = ({
  checkinId,
  onVerificationSuccess,
  onVerificationError,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [socialUrl, setSocialUrl] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  const handleVerification = async () => {
    if (!socialUrl.trim()) {
      setError('Please enter a social media URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await checkinService.verifySocialPost(checkinId, socialUrl.trim());

      if (result.verified) {
        setVerified(true);
        if (onVerificationSuccess) {
          onVerificationSuccess(result);
        }

        alert(`✅ Social verification successful!\nStatus: ${result.status}\n${result.auto_payout_triggered ? '🎉 Auto-payout has been triggered!' : 'Payout will be processed shortly.'}`);
      } else {
        throw new Error('Social post verification failed. Please ensure your post includes @nilbx and the hotspot location.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Social verification failed';
      setError(errorMessage);
      if (onVerificationError) {
        onVerificationError(err);
      }
      alert(`❌ Verification Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderText = () => {
    return 'https://twitter.com/yourusername/status/1234567890?text=@nilbx+hotspot';
  };

  const getHelpText = () => {
    return 'Paste the URL of your social media post that includes @nilbx and mentions the hotspot location.';
  };

  if (verified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center p-6 bg-green-50 border border-green-200 rounded-lg ${className}`}
      >
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Verification Complete!</h3>
        <p className="text-green-700">
          Your social media post has been verified. Payout processing has begun!
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`social-verification ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">📱 Complete Your Check-in</h4>
        <p className="text-blue-700 text-sm">
          Post on social media with <strong>@nilbx</strong> and mention the hotspot location,
          then paste the URL below to complete verification and trigger your payout!
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          name="social-media-post-url"
          label="Social Media Post URL"
          type="url"
          value={socialUrl}
          onChange={setSocialUrl}
          placeholder={getPlaceholderText()}
          helpText={getHelpText()}
          required
          disabled={loading}
        />

        <motion.div
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          <Button
            onClick={handleVerification}
            disabled={loading || !socialUrl.trim()}
            variant="primary"
            size="large"
            fullWidth
            className="min-h-[48px]"
            icon={loading ? '⏳' : '✅'}
          >
            {loading ? 'Verifying Post...' : 'Verify Social Post'}
          </Button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Supported platforms:</strong> Twitter, Instagram, Facebook</p>
          <p><strong>Required tags:</strong> @nilbx + hotspot location</p>
          <p><strong>Example:</strong> "Just checked in at Starbucks Downtown! @nilbx #NILdeal"</p>
        </div>
      </div>
    </div>
  );
};

export default SocialVerification;