import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export function ThemeProvider({ children, initialRole = null, initialMode = 'light' }) {
  const [currentRole, setCurrentRole] = useState(initialRole);
  const [mode, setMode] = useState(() => {
    // Initialize mode based on saved preference or system preference
    if (typeof localStorage !== 'undefined') {
      const savedMode = localStorage.getItem('theme-mode');
      if (savedMode) return savedMode;
    }
    
    // Check system preference if no saved mode and initialMode is 'light' (default)
    if (initialMode === 'light' && typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery && mediaQuery.matches) {
          return 'dark';
        }
      } catch (error) {
        // Ignore errors
      }
    }
    
    return initialMode;
  });

  // Load theme preferences from localStorage on mount
  useEffect(() => {
    const savedRole = typeof localStorage !== 'undefined' ? localStorage.getItem('theme-role') : null;
    const savedMode = typeof localStorage !== 'undefined' ? localStorage.getItem('theme-mode') : null;

    if (savedRole && !initialRole) {
      setCurrentRole(savedRole);
    }

    if (savedMode && savedMode !== initialMode) {
      setMode(savedMode);
    }

    // Listen for system color scheme changes (only if matchMedia is available)
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
          const handleChange = (e) => {
            if (!savedMode) { // Only auto-switch if no manual preference
              setMode(e.matches ? 'dark' : 'light');
            }
          };

          mediaQuery.addEventListener('change', handleChange);
          return () => {
            if (mediaQuery && typeof mediaQuery.removeEventListener === 'function') {
              mediaQuery.removeEventListener('change', handleChange);
            }
          };
        }
      } catch (error) {
        // Silently fail if matchMedia is not properly supported
        console.warn('matchMedia not fully supported:', error);
      }
    }
  }, [initialRole, initialMode]);

  // Save role to localStorage when it changes
  useEffect(() => {
    if (currentRole && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme-role', currentRole);
    }
  }, [currentRole]);

  // Save mode to localStorage when it changes
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme-mode', mode);
    }
  }, [mode]);

  const setRole = (role) => {
    setCurrentRole(role);
  };

  const setThemeMode = (newMode) => {
    setMode(newMode);
  };

  const value = {
    currentRole,
    setRole,
    mode,
    setMode: setThemeMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext };
export default ThemeContext;