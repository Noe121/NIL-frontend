import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import SimpleLandingPage from './SimpleLandingPage.jsx';
import LandingPage from './LandingPage.jsx';
import Auth from './Auth.jsx';
import Register from './Register.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import ResetPassword from './ResetPassword.jsx';
import MultiStepRegister from './components/MultiStepRegister.jsx';
import UserInfo from './UserInfo.jsx';
import AthleteDashboard from './views/AthleteDashboard.jsx';
import SponsorDashboard from './views/SponsorDashboard.jsx';
import FanDashboard from './views/FanDashboard.jsx';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SimpleLandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/multi-step" element={<MultiStepRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserInfo />
              </ProtectedRoute>
            } 
          />
          
          {/* Role-specific dashboards */}
          <Route 
            path="/dashboard/athlete" 
            element={
              <ProtectedRoute requiredRole="athlete">
                <AthleteDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/sponsor" 
            element={
              <ProtectedRoute requiredRole="sponsor">
                <SponsorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/fan" 
            element={
              <ProtectedRoute requiredRole="fan">
                <FanDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

// Component that redirects to appropriate dashboard based on user role
function RoleDashboard() {
  const { role } = useUser();
  
  switch (role) {
    case 'athlete':
      return <Navigate to="/dashboard/athlete" replace />;
    case 'sponsor':
      return <Navigate to="/dashboard/sponsor" replace />;
    case 'fan':
      return <Navigate to="/dashboard/fan" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}