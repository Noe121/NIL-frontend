import React, { createContext, useContext, useState, useEffect } from 'react';

// Data Management Context
const DataManagementContext = createContext();

// Demo data replacement states
const REPLACEMENT_STATES = {
  DEMO: 'demo',
  TRANSITIONING: 'transitioning',
  REAL: 'real'
};

export const DataManagementProvider = ({ children }) => {
  const [dataStates, setDataStates] = useState({
    testimonials: REPLACEMENT_STATES.DEMO,
    userProfiles: REPLACEMENT_STATES.DEMO,
    statistics: REPLACEMENT_STATES.DEMO,
    pricing: REPLACEMENT_STATES.REAL, // Pricing is always real
    userFeedback: REPLACEMENT_STATES.DEMO
  });

  const [feedbackData, setFeedbackData] = useState([]);

  // Check if real data is available for a data type
  const hasRealData = (dataType) => {
    // This would typically check against your backend API
    // For now, we'll simulate based on user interactions
    const stored = localStorage.getItem(`nilbx_real_${dataType}_available`);
    return stored === 'true';
  };

  // Mark data type as having real data available
  const markRealDataAvailable = (dataType) => {
    setDataStates(prev => ({
      ...prev,
      [dataType]: REPLACEMENT_STATES.TRANSITIONING
    }));

    // Store in localStorage for persistence
    localStorage.setItem(`nilbx_real_${dataType}_available`, 'true');

    // Simulate transition delay
    setTimeout(() => {
      setDataStates(prev => ({
        ...prev,
        [dataType]: REPLACEMENT_STATES.REAL
      }));
    }, 2000); // 2 second transition
  };

  // Record user feedback about demo content
  const recordFeedback = (dataType, feedback) => {
    const feedbackEntry = {
      id: Date.now(),
      dataType,
      feedback,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    setFeedbackData(prev => [...prev, feedbackEntry]);

    // Store feedback (in production, this would go to your backend)
    const existingFeedback = JSON.parse(localStorage.getItem('nilbx_user_feedback') || '[]');
    existingFeedback.push(feedbackEntry);
    localStorage.setItem('nilbx_user_feedback', JSON.stringify(existingFeedback));

    // If user indicates demo content is confusing, consider marking as needing real data
    if (feedback.confusing === true || feedback.helpful === false) {
      // This could trigger notifications to replace demo content
      console.log(`User feedback indicates ${dataType} demo content needs improvement`);
    }
  };

  // Get current data state for a type
  const getDataState = (dataType) => {
    return dataStates[dataType] || REPLACEMENT_STATES.DEMO;
  };

  // Check if we should show demo content
  const shouldShowDemo = (dataType) => {
    return getDataState(dataType) === REPLACEMENT_STATES.DEMO;
  };

  // Check if transitioning
  const isTransitioning = (dataType) => {
    return getDataState(dataType) === REPLACEMENT_STATES.TRANSITIONING;
  };

  // Get replacement progress (for UI indicators)
  const getReplacementProgress = (dataType) => {
    switch (getDataState(dataType)) {
      case REPLACEMENT_STATES.DEMO:
        return 0;
      case REPLACEMENT_STATES.TRANSITIONING:
        return 50;
      case REPLACEMENT_STATES.REAL:
        return 100;
      default:
        return 0;
    }
  };

  // Initialize data states on mount
  useEffect(() => {
    // Check for existing real data availability
    Object.keys(dataStates).forEach(dataType => {
      if (hasRealData(dataType)) {
        setDataStates(prev => ({
          ...prev,
          [dataType]: REPLACEMENT_STATES.REAL
        }));
      }
    });

    // Load existing feedback
    const existingFeedback = JSON.parse(localStorage.getItem('nilbx_user_feedback') || '[]');
    setFeedbackData(existingFeedback);
  }, []);

  const value = {
    dataStates,
    feedbackData,
    hasRealData,
    markRealDataAvailable,
    recordFeedback,
    getDataState,
    shouldShowDemo,
    isTransitioning,
    getReplacementProgress,
    REPLACEMENT_STATES
  };

  return (
    <DataManagementContext.Provider value={value}>
      {children}
    </DataManagementContext.Provider>
  );
};

export const useDataManagement = () => {
  const context = useContext(DataManagementContext);
  if (!context) {
    throw new Error('useDataManagement must be used within a DataManagementProvider');
  }
  return context;
};

// Hook for components to easily manage demo/real data display
export const useDemoData = (dataType, demoData, realData) => {
  const { shouldShowDemo, isTransitioning, getReplacementProgress } = useDataManagement();

  return {
    data: shouldShowDemo(dataType) ? demoData : realData,
    isDemo: shouldShowDemo(dataType),
    isTransitioning: isTransitioning(dataType),
    progress: getReplacementProgress(dataType)
  };
};