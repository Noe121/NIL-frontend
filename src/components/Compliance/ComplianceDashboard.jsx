import React from 'react';
import { getStateRules } from '../../config/stateRules';

/**
 * Compliance Dashboard Component
 * Shows user's compliance status and restrictions
 */
const ComplianceDashboard = ({ user }) => {
  const rules = getStateRules(user?.state);

  if (!rules) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">State compliance rules not found</p>
      </div>
    );
  }

  const getTierBadge = (tier) => {
    const styles = {
      TIER_1: 'bg-green-100 text-green-800 border-green-300',
      TIER_2: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      TIER_3: 'bg-red-100 text-red-800 border-red-300'
    };
    return styles[tier] || 'bg-gray-100 text-gray-800';
  };

  const getTierIcon = (tier) => {
    const icons = {
      TIER_1: '✅',
      TIER_2: '⚠️',
      TIER_3: '❌'
    };
    return icons[tier] || '❓';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header - State & Tier Badge */}
      <div className={`p-6 rounded-lg border-2 ${getTierBadge(rules.tier)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{rules.name}</h1>
            <p className="text-sm text-gray-600 mt-1">{rules.description}</p>
          </div>
          <div className="text-5xl">{getTierIcon(rules.tier)}</div>
        </div>
      </div>

      {/* User Information */}
      {user && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Your Profile</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">User Type</p>
              <p className="font-semibold capitalize">{user.type?.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-semibold">{user.age} years old</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">School</p>
              <p className="font-semibold">{user.school || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">State</p>
              <p className="font-semibold">{user.state}</p>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Compliance Status</h2>
        <div className="space-y-3">
          <ComplianceItem
            label="Age Verification"
            status={user?.ageVerified}
            required={true}
          />
          {rules.parentalConsentRequired !== 'never' && (
            <ComplianceItem
              label="Parental Consent"
              status={user?.parentalConsentApproved}
              required={rules.parentalConsentRequired === 'always' || (user?.age < 18 && rules.parentalConsentRequired === 'under_18')}
            />
          )}
          {rules.schoolNotificationRequired && (
            <ComplianceItem
              label="School Notification"
              status={user?.schoolNotified}
              required={true}
            />
          )}
          {rules.schoolApprovalRequired && (
            <ComplianceItem
              label="School Approval"
              status={user?.schoolApproved}
              required={true}
            />
          )}
        </div>
      </div>

      {/* Deal Requirements */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <h2 className="font-bold text-lg mb-4">Deal Requirements</h2>
        <ul className="space-y-2">
          {rules.requirementsList.map((req, idx) => (
            <li key={idx} className="flex items-start text-blue-900">
              <span className="mr-3 text-lg">✓</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Deal Restrictions */}
      {rules.dealTypesBlacklist.length > 0 && (
        <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
          <h2 className="font-bold text-lg mb-4">Restricted Deal Types</h2>
          <div className="flex flex-wrap gap-2">
            {rules.dealTypesBlacklist.map((type, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-semibold"
              >
                {type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Deal Amount Limits */}
      {rules.minDealAmount > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Deal Amount Limits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Minimum Amount</p>
              <p className="text-3xl font-bold text-green-600">${rules.minDealAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Maximum Amount</p>
              <p className="text-3xl font-bold text-green-600">${rules.maxDealAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Review Timeline */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Deal Review Timeline</h2>
        {rules.reviewDelayHours === 0 ? (
          <div className="text-center py-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">⚡ Instant Approval</p>
            <p className="text-gray-900 mt-2">Your deals are approved immediately!</p>
          </div>
        ) : (
          <div className="text-center py-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">⏱️ {rules.reviewDelayHours} Hour Review</p>
            <p className="text-gray-900 mt-2">Deals in {rules.name} require a review period</p>
          </div>
        )}
      </div>

      {/* State Tier Info */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="font-bold text-lg mb-4">State Tier Information</h2>
        <div className="space-y-2 text-sm text-gray-700">
          {rules.tier === 'TIER_1' && (
            <>
              <p>✅ <strong>Green Light State</strong></p>
              <p>Your state is very permissive with NIL opportunities. You can start earning right away!</p>
            </>
          )}
          {rules.tier === 'TIER_2' && (
            <>
              <p>⚠️ <strong>Standard Track State</strong></p>
              <p>Your state requires parental consent and/or school notification. Please complete all requirements before submitting deals.</p>
            </>
          )}
          {rules.tier === 'TIER_3' && (
            <>
              <p>❌ <strong>Restricted State</strong></p>
              <p>High school NIL opportunities are limited in your state. Consider registering as an influencer instead.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Compliance Item Component
 * Shows individual compliance status
 */
const ComplianceItem = ({ label, status, required }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <div className={`
          w-6 h-6 rounded-full mr-3 flex items-center justify-center text-white text-sm font-bold
          ${status ? 'bg-green-500' : required ? 'bg-red-500' : 'bg-gray-400'}
        `}>
          {status ? '✓' : required ? '!' : '○'}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${
        status ? 'text-green-600' : required ? 'text-red-600' : 'text-gray-900'
      }`}>
        {status ? 'Complete' : required ? 'Required' : 'Optional'}
      </span>
    </div>
  );
};

export { ComplianceDashboard, ComplianceItem };
export default ComplianceDashboard;
