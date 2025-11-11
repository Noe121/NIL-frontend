import { useState, useCallback } from 'react';
import { getStateRules, isValidDealType, isValidDealAmount } from '../config/stateRules';

/**
 * Hook to validate deals against state compliance rules
 * Checks deal type, amount, and other restrictions
 */
export const useComplianceCheck = (userState, userAge) => {
  const [validationErrors, setValidationErrors] = useState([]);

  const validateDeal = useCallback((dealData) => {
    const errors = [];
    const rules = getStateRules(userState);

    if (!rules) {
      errors.push('State rules not found');
      return { isValid: false, errors };
    }

    // Check deal type
    if (!isValidDealType(userState, dealData.type)) {
      errors.push(`Deal type "${dealData.type}" is not allowed in ${userState}`);
    }

    // Check deal amount
    if (!isValidDealAmount(userState, dealData.amount)) {
      errors.push(
        `Deal amount $${dealData.amount} is outside allowed range: $${rules.minDealAmount} - $${rules.maxDealAmount}`
      );
    }

    // Age restrictions
    if (userAge < 18) {
      if (rules.dealTypesBlacklist.includes('alcohol') && dealData.category === 'alcohol') {
        errors.push('Minors cannot promote alcohol');
      }
      if (rules.dealTypesBlacklist.includes('gambling') && dealData.category === 'gambling') {
        errors.push('Minors cannot promote gambling');
      }
      if (rules.dealTypesBlacklist.includes('tobacco') && dealData.category === 'tobacco') {
        errors.push('Minors cannot promote tobacco');
      }
    }

    // School approval check
    if (rules.schoolApprovalRequired && !dealData.schoolApproved) {
      errors.push('This deal requires school approval before submission');
    }

    setValidationErrors(errors);
    return {
      isValid: errors.length === 0,
      errors,
      requiresReview: rules.reviewDelayHours > 0,
      reviewDelayHours: rules.reviewDelayHours
    };
  }, [userState, userAge]);

  const validateUser = useCallback((userData) => {
    const errors = [];
    const rules = getStateRules(userState);

    if (!rules) {
      errors.push('State rules not found');
      return { isValid: false, errors };
    }

    // Age check
    if (userData.age < 13) {
      errors.push('Must be 13 or older to use platform (COPPA)');
    }

    // HS athlete check
    if (userData.type === 'hs_athlete' && !rules.hsNilAllowed) {
      errors.push(`High school NIL not permitted in ${userState}`);
    }

    // MS athlete check
    if (userData.type === 'ms_athlete' && !rules.msNilAllowed) {
      errors.push('Middle school NIL not currently supported');
    }

    // Parental consent check
    if (userData.age < 18 && rules.parentalConsentRequired === 'always') {
      if (!userData.parentalConsentApproved) {
        errors.push('Parental consent required for users under 18 in this state');
      }
    }

    setValidationErrors(errors);
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [userState]);

  return {
    validateDeal,
    validateUser,
    validationErrors
  };
};

export default useComplianceCheck;
