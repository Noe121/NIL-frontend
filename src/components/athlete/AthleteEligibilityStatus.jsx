import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, FileText } from 'lucide-react';

/**
 * AthleteEligibilityStatus Component
 *
 * Displays comprehensive eligibility status for student-athletes including:
 * - Athlete role and current status
 * - State compliance requirements
 * - Parental consent status (if required)
 * - School approval status (if required)
 * - Next disclosure deadline (30-day NCAA rule)
 * - Overall compliance percentage
 *
 * @param {Object} athlete - Athlete data from API
 * @param {Object} compliance - Athlete compliance data
 * @param {Object} stateRules - State-specific NIL rules
 */
export default function AthleteEligibilityStatus({ athlete, compliance, stateRules }) {
  if (!athlete) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
      case 'approved':
      case true:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'non_compliant':
      case 'rejected':
      case false:
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    if (status === 'compliant' || status >= 90) return 'bg-green-50 border-green-200';
    if (status === 'warning' || (status >= 70 && status < 90)) return 'bg-yellow-50 border-yellow-200';
    if (status === 'non_compliant' || status < 70) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  const formatAthleteRole = (role) => {
    if (!role) return 'Student-Athlete';
    return role.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const daysUntilDisclosure = compliance?.next_disclosure_due
    ? Math.ceil((new Date(compliance.next_disclosure_due) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Eligibility & Compliance Status</h3>
        {compliance?.eligibility_verified && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </span>
        )}
      </div>

      {/* Overall Compliance Score */}
      <div className={`p-4 rounded-lg border ${getStatusColor(compliance?.compliance_percentage || 100)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Compliance</span>
          <span className="text-2xl font-bold text-gray-900">
            {compliance?.compliance_percentage || 100}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              (compliance?.compliance_percentage || 100) >= 90 ? 'bg-green-500' :
              (compliance?.compliance_percentage || 100) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${compliance?.compliance_percentage || 100}%` }}
          />
        </div>
      </div>

      {/* Athlete Role & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Athlete Role</label>
          <p className="text-sm font-medium text-gray-900">
            {formatAthleteRole(athlete.athlete_role)}
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <div className="flex items-center gap-2">
            {getStatusIcon(athlete.athlete_status)}
            <span className="text-sm font-medium text-gray-900 capitalize">
              {athlete.athlete_status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* State Compliance */}
      {stateRules && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">State Requirements ({athlete.home_state || compliance?.state})</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">High School NIL Allowed</span>
              {getStatusIcon(stateRules.hs_nil_allowed)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">College NIL Allowed</span>
              {getStatusIcon(stateRules.college_nil_allowed)}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">State Tier</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                stateRules.tier === 'TIER_1' ? 'bg-green-100 text-green-800' :
                stateRules.tier === 'TIER_2' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {stateRules.tier}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Parental Consent (if required) */}
      {compliance?.parental_consent_required && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Parental Consent</h4>
              <p className="text-xs text-gray-500 mt-1">Required for athletes under 18</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(compliance.parental_consent_approved)}
              <span className="text-sm font-medium">
                {compliance.parental_consent_approved ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>
          {compliance.parental_consent_date && (
            <p className="text-xs text-gray-500 mt-2">
              Approved on {new Date(compliance.parental_consent_date).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* School Approval (if required) */}
      {compliance?.school_approval_required && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">School Approval</h4>
              <p className="text-xs text-gray-500 mt-1">
                {compliance.school_notified ? 'School notified' : 'Notification required'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(compliance.school_approved)}
              <span className="text-sm font-medium">
                {compliance.school_approved ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>
          {compliance.school_contact_name && (
            <p className="text-xs text-gray-500 mt-2">
              Contact: {compliance.school_contact_name}
              {compliance.school_contact_email && ` (${compliance.school_contact_email})`}
            </p>
          )}
        </div>
      )}

      {/* Next Disclosure Deadline (NCAA 30-day rule) */}
      {compliance?.next_disclosure_due && (
        <div className={`border-t pt-4 p-3 rounded-lg ${
          daysUntilDisclosure <= 7 ? 'bg-red-50 border-red-200' :
          daysUntilDisclosure <= 14 ? 'bg-yellow-50 border-yellow-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <FileText className={`w-5 h-5 flex-shrink-0 ${
              daysUntilDisclosure <= 7 ? 'text-red-600' :
              daysUntilDisclosure <= 14 ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">Next NIL Disclosure Due</h4>
              <p className="text-xs text-gray-600 mt-1">
                Due in {daysUntilDisclosure} days ({new Date(compliance.next_disclosure_due).toLocaleDateString()})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                NCAA requires disclosure every {compliance.disclosure_frequency_days || 30} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deal Limits (from state rules) */}
      {stateRules && (stateRules.min_deal_amount > 0 || stateRules.max_deal_amount > 0) && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Deal Amount Limits</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {stateRules.min_deal_amount > 0 && (
              <div>
                <span className="text-gray-500">Minimum:</span>
                <span className="font-medium text-gray-900 ml-2">
                  ${stateRules.min_deal_amount.toFixed(2)}
                </span>
              </div>
            )}
            {stateRules.max_deal_amount > 0 && (
              <div>
                <span className="text-gray-500">Maximum:</span>
                <span className="font-medium text-gray-900 ml-2">
                  ${stateRules.max_deal_amount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Required Alert */}
      {compliance?.compliance_status === 'warning' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-900">Action Required</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Please complete pending compliance requirements to maintain eligibility.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
