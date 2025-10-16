import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
