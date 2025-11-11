import React, { useState } from 'react';
import { getAllStates, getTier } from '../../config/stateRules';

/**
 * State Selection Component
 * Allows users to select their state during registration
 * Shows tier badge and compliance preview
 */
const StateSelector = ({ selectedState, onStateSelect, onNext }) => {
  const [expandedState, setExpandedState] = useState(null);
  const states = getAllStates();

  const getTierColor = (tier) => {
    switch (tier) {
      case 'TIER_1':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'TIER_2':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'TIER_3':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case 'TIER_1':
        return 'Full Access ✅';
      case 'TIER_2':
        return 'Standard Track ⚠️';
      case 'TIER_3':
        return 'Restricted ❌';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2">Where are you located?</h2>
      <p className="text-gray-600 mb-6">
        We'll show you NIL opportunities available in your state.
      </p>

      {/* State Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {states.map((state) => {
          const tier = getTier(state);
          const isSelected = selectedState === state;

          return (
            <button
              key={state}
              onClick={() => {
                onStateSelect(state);
                setExpandedState(state);
              }}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
                }
              `}
            >
              <div className="font-semibold text-lg">{state}</div>
              <div
                className={`
                  text-xs font-semibold px-2 py-1 rounded mt-2
                  ${getTierColor(tier)}
                `}
              >
                {getTierLabel(tier)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Compliance Summary */}
      {expandedState && (
        <ComplianceCard state={expandedState} />
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onNext}
          disabled={!selectedState}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold transition-all
            ${selectedState
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

/**
 * Compliance Card Component
 * Shows detailed compliance rules for selected state
 */
const ComplianceCard = ({ state }) => {
  const { getStateRules } = require('../../config/stateRules');
  const rules = getStateRules(state);

  if (!rules) return null;

  const getTierBg = (tier) => {
    switch (tier) {
      case 'TIER_1':
        return 'bg-green-50 border-green-200';
      case 'TIER_2':
        return 'bg-yellow-50 border-yellow-200';
      case 'TIER_3':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 mb-6 ${getTierBg(rules.tier)}`}>
      <h3 className="font-bold text-lg mb-3">{rules.name} - {rules.tier}</h3>
      <p className="text-gray-900 mb-4">{rules.description}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* HS Athlete */}
        <div>
          <p className="font-semibold text-sm mb-1">High School Athlete:</p>
          <p className={`text-sm ${rules.hsNilAllowed ? 'text-green-700' : 'text-red-700'}`}>
            {rules.hsNilAllowed ? '✅ Allowed' : '❌ Not Allowed'}
          </p>
        </div>

        {/* Parental Consent */}
        <div>
          <p className="font-semibold text-sm mb-1">Parental Consent:</p>
          <p className="text-sm text-gray-900">
            {rules.parentalConsentRequired === 'always'
              ? '✅ Required'
              : rules.parentalConsentRequired === 'under_18'
              ? '✅ Required (under 18)'
              : '❌ Not Required'}
          </p>
        </div>

        {/* School Approval */}
        <div>
          <p className="font-semibold text-sm mb-1">School Approval:</p>
          <p className={`text-sm ${rules.schoolApprovalRequired ? 'text-yellow-700' : 'text-green-700'}`}>
            {rules.schoolApprovalRequired ? '⚠️ Required' : '✅ Not Required'}
          </p>
        </div>

        {/* Deal Review */}
        <div>
          <p className="font-semibold text-sm mb-1">Deal Review:</p>
          <p className="text-sm text-gray-900">
            {rules.reviewDelayHours === 0
              ? '✅ Instant'
              : `⏱️ ${rules.reviewDelayHours} hours`}
          </p>
        </div>
      </div>

      {/* Deal Limits */}
      {rules.minDealAmount > 0 && (
        <div className="mb-4">
          <p className="font-semibold text-sm mb-1">Deal Amount Limits:</p>
          <p className="text-sm text-gray-900">
            ${rules.minDealAmount.toLocaleString()} - ${rules.maxDealAmount.toLocaleString()}
          </p>
        </div>
      )}

      {/* Requirements */}
      {rules.requirementsList && rules.requirementsList.length > 0 && (
        <div>
          <p className="font-semibold text-sm mb-2">Requirements:</p>
          <ul className="text-sm text-gray-900 space-y-1">
            {rules.requirementsList.map((req, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { StateSelector, ComplianceCard };
export default StateSelector;
