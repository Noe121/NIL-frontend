import { useState, useCallback } from 'react';
import { config } from '../utils/config.js';

/**
 * Hook for validating user registration against state compliance rules
 * 
 * Usage:
 * const { validate, loading, error, result } = useComplianceValidation();
 * const result = await validate('CA', 'hs_athlete', 17);
 */
export const useComplianceValidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const validateRegistration = useCallback(async (state, userType, age) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.apiUrl}/compliance/validate-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: state.toUpperCase(),
          user_type: userType.toLowerCase(),
          age: parseInt(age, 10)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Validation failed');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateDeal = useCallback(async (state, dealType, dealAmount, userAge, userType) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.apiUrl}/compliance/validate-deal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: state.toUpperCase(),
          deal_type: dealType,
          deal_amount: parseFloat(dealAmount),
          user_age: parseInt(userAge, 10),
          user_type: userType.toLowerCase()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Deal validation failed');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    validateRegistration,
    validateDeal,
    loading,
    error,
    result
  };
};

/**
 * Hook for fetching state rules from the backend
 * 
 * Usage:
 * const { stateRules, loading, error } = useStateRulesAPI('CA');
 */
export const useStateRulesAPI = (state) => {
  const [stateRules, setStateRules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStateRules = useCallback(async () => {
    if (!state) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.apiUrl}/compliance/rules/${state}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`State not found or not configured: ${state}`);
      }

      const data = await response.json();
      setStateRules(data.rules);
    } catch (err) {
      setError(err.message);
      setStateRules(null);
    } finally {
      setLoading(false);
    }
  }, [state]);

  // Fetch on mount and when state changes
  React.useEffect(() => {
    fetchStateRules();
  }, [fetchStateRules]);

  return {
    stateRules,
    loading,
    error,
    refetch: fetchStateRules
  };
};

/**
 * Hook for managing selected state during registration
 * 
 * Usage:
 * const { selectedState, selectState, clearState, isValid } = useStateSelection();
 */
export const useStateSelection = () => {
  const [selectedState, setSelectedState] = useState('');
  const [complianceRules, setComplianceRules] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectState = useCallback(async (state) => {
    setSelectedState(state);
    setLoading(true);
    
    try {
      const response = await fetch(`${config.apiUrl}/compliance/rules/${state}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComplianceRules(data.rules);
      }
    } catch (err) {
      console.error('Failed to fetch compliance rules:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearState = useCallback(() => {
    setSelectedState('');
    setComplianceRules(null);
  }, []);

  const isValid = selectedState.length > 0;

  return {
    selectedState,
    selectState,
    clearState,
    complianceRules,
    loading,
    isValid
  };
};

/**
 * Hook for fetching all states grouped by tier
 * 
 * Usage:
 * const { states, loading, error } = useStatesByTier('TIER_1');
 */
export const useStatesByTier = (tier) => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${config.apiUrl}/compliance/states/by-tier/${tier}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch states for tier: ${tier}`);
        }

        const data = await response.json();
        setStates(data.states || []);
      } catch (err) {
        setError(err.message);
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    if (tier) {
      fetchStates();
    }
  }, [tier]);

  return {
    states,
    loading,
    error
  };
};

/**
 * Hook for fetching all state rules
 * 
 * Usage:
 * const { allStates, loading, error } = useAllStates();
 */
export const useAllStates = () => {
  const [allStates, setAllStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchAllStates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${config.apiUrl}/compliance/rules`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch all states');
        }

        const data = await response.json();
        setAllStates(data.states || []);
      } catch (err) {
        setError(err.message);
        setAllStates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStates();
  }, []);

  return {
    allStates,
    loading,
    error
  };
};

export default {
  useComplianceValidation,
  useStateRulesAPI,
  useStateSelection,
  useStatesByTier,
  useAllStates
};
