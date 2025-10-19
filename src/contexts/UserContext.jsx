import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { authService } from '../services/authService.js';

// User Context
const UserContext = createContext();

// Action types
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  LOGIN: 'LOGIN',
  SET_LOADING: 'SET_LOADING',
  LOGOUT: 'LOGOUT',
  SET_THEME: 'SET_THEME',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Initial state
const initialState = {
  user: null,
  role: null,
  token: null,
  loading: false,
  theme: 'light',
  isAuthenticated: false,
  error: null
};

// Reducer
function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        loading: false,
        error: null
      };
    case USER_ACTIONS.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case USER_ACTIONS.LOGOUT:
      return {
        ...initialState,
        theme: state.theme // Preserve theme on logout
      };
    case USER_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    case USER_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        loading: false
      };
    default:
      return state;
  }
}

// Context Provider
export function UserProvider({ children, initialUser = null }) {
  const initialState = useMemo(() => ({
    user: initialUser || null,
    role: initialUser ? 'user' : null,
    token: initialUser ? 'mock-token' : null,
    isAuthenticated: !!initialUser,
    loading: false,
    theme: 'light',
    error: null
  }), [initialUser]);

  const [state, dispatch] = useReducer(userReducer, initialState);

  // Initialize user from authentication service
  useEffect(() => {
    if (!initialUser) {
      const initializeAuth = async () => {
        if (authService.isAuthenticated()) {
          dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
          
          try {
            // Try to get current user from token first
            const tokenUser = authService.getUserFromToken();
            const tokenRole = authService.getRoleFromToken();
            
            if (tokenUser && tokenRole) {
              dispatch({
                type: USER_ACTIONS.SET_USER,
                payload: {
                  user: tokenUser,
                  role: tokenRole,
                  token: authService.getToken()
                }
              });
            }
            
            // Then verify with backend and get fresh user data
            const result = await authService.getCurrentUser();
            if (result.success) {
              dispatch({
                type: USER_ACTIONS.SET_USER,
                payload: {
                  user: result.user,
                  role: result.role,
                  token: authService.getToken()
                }
              });
            } else {
              // Token is invalid, logout
              dispatch({ type: USER_ACTIONS.LOGOUT });
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            dispatch({ type: USER_ACTIONS.LOGOUT });
          } finally {
            dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
          }
        }
      };

      initializeAuth();
    }
  }, [initialUser]);

  // Auto-refresh user session
  useEffect(() => {
    if (state.isAuthenticated && !initialUser) {
      const interval = setInterval(() => {
        authService.extendSession();
      }, 5 * 60 * 1000); // Extend session every 5 minutes

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, initialUser]);

  const login = async (credentials) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        dispatch({
          type: USER_ACTIONS.LOGIN,
          payload: {
            user: result.user,
            role: result.role,
            token: result.token
          }
        });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const logout = async () => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: USER_ACTIONS.LOGOUT });
    }
  };

  const updateProfile = async (profileData) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Call API to update profile
      const result = await authService.updateProfile?.(profileData);
      
      if (result?.success) {
        dispatch({
          type: USER_ACTIONS.UPDATE_PROFILE,
          payload: profileData
        });
        return { success: true };
      } else {
        return { success: false, error: result?.error || 'Update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Update failed' };
    } finally {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const setLoading = (loading) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: loading });
  };

  const setTheme = (theme) => {
    dispatch({ type: USER_ACTIONS.SET_THEME, payload: theme });
    localStorage.setItem('theme', theme);
  };

  const value = {
    ...state,
    dispatch, // Expose dispatch for direct actions
    login,
    logout,
    updateProfile,
    setLoading,
    setTheme
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { UserContext };
export default UserContext;