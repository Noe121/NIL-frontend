import React, { createContext, useContext, useReducer, useEffect } from 'react';

// User Context
const UserContext = createContext();

// Action types
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  LOGOUT: 'LOGOUT',
  SET_THEME: 'SET_THEME'
};

// Initial state
const initialState = {
  user: null,
  role: null,
  jwt: null,
  loading: false,
  theme: 'light',
  isAuthenticated: false
};

// Reducer
function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        jwt: action.payload.jwt,
        isAuthenticated: !!action.payload.jwt,
        loading: false
      };
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case USER_ACTIONS.LOGOUT:
      return {
        ...initialState
      };
    case USER_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    default:
      return state;
  }
}

// Context Provider
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Initialize user from localStorage
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const userData = localStorage.getItem('userData');
    
    if (jwt) {
      try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        const user = userData ? JSON.parse(userData) : null;
        
        dispatch({
          type: USER_ACTIONS.SET_USER,
          payload: {
            jwt,
            role: payload.role,
            user: user || { id: payload.sub, email: payload.email }
          }
        });
      } catch (error) {
        console.error('Failed to parse JWT:', error);
        localStorage.removeItem('jwt');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const login = (jwt, userData = null) => {
    localStorage.setItem('jwt', jwt);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      dispatch({
        type: USER_ACTIONS.SET_USER,
        payload: {
          jwt,
          role: payload.role,
          user: userData || { id: payload.sub, email: payload.email }
        }
      });
    } catch (error) {
      console.error('Failed to parse JWT:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userData');
    dispatch({ type: USER_ACTIONS.LOGOUT });
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
    login,
    logout,
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

export default UserContext;