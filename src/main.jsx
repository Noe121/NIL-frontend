import axios from 'axios';
import React, { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Attach JWT to all axios requests if present
axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('jwt');
		if (token) {
			config.headers = config.headers || {};
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Safe Router wrapper to catch router errors
function SafeRouter({ children }) {
  try {
    return <BrowserRouter>{children}</BrowserRouter>;
  } catch (error) {
    console.error('Router error:', error);
    return (
      <div style={{ padding: '20px', color: '#d32f2f' }}>
        <h1>Router Error</h1>
        <p>Failed to initialize routing: {error.message}</p>
      </div>
    );
  }
}

// Export SafeRouter for use in App.jsx
window.SafeRouter = SafeRouter;
window.Routes = Routes;
window.Route = Route;

// Comprehensive Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: '#d32f2f' }}>🚨 Something went wrong!</h1>
          <details style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
            <summary>Error Details</summary>
            <strong>Error:</strong> {this.state.error && this.state.error.toString()}
            <br />
            <strong>Stack:</strong>
            {this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
