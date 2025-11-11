import { useState, useEffect, useCallback } from 'react';
import { getStateRules, getDealRestrictions } from '../config/stateRules';

/**
 * Hook to fetch and manage state compliance rules
 * Provides dynamic rule access based on user's state
 */
export const useStateRules = (state) => {
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state) {
      setRules(null);
      return;
    }

    setLoading(true);
    try {
      // In production, this would be an API call:
      // const response = await fetch(`/api/compliance/rules/${state}`);
      // const data = await response.json();
      
      // For now, use local config
      const stateRules = getStateRules(state);
      if (stateRules) {
        setRules(stateRules);
        setError(null);
      } else {
        setError(`Rules not found for state: ${state}`);
      }
    } catch (err) {
      setError(err.message);
      setRules(null);
    } finally {
      setLoading(false);
    }
  }, [state]);

  return { rules, loading, error };
};

export default useStateRules;
