import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.jsx';
import { GamificationProvider } from './contexts/GamificationContext.jsx';
import { ToastProvider } from './components/NotificationToast.jsx';
import LandingPage from './LandingPage.jsx';
import Auth from './Auth.jsx';
import Register from './Register.jsx';
import MultiStepRegister from './components/MultiStepRegister.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import UserInfo from './UserInfo.jsx';
import {
  LazyAthleteDashboard,
  LazySponsorDashboard,
  LazyFanDashboard,
  LazyLandingPage,
  LazyUserInfo
  // TODO: Uncomment when views are created
  // LazyProfileManagement,
  // LazySponsorshipManagement,
  // LazyAthleteSearch,
  // LazyAnalytics,
  // LazyReports,
  // LazySchedule,
  // LazyStore,
  // LazyNotifications,
  // LazyAthleteProfiles
} from './components/LazyComponents.jsx';

export default function App() {

  return (
    <UserProvider>
      <GamificationProvider>
        <ToastProvider position="top-right">
          <BrowserRouter>
            <NavigationBar />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/multi-step" element={<MultiStepRegister />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <>
                      <UserInfo />
                      <LandingPage />
                    </>
                  </ProtectedRoute>
                }
              />
              {/* Role-based Dashboards */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            } />
            {/* Temporarily disabled routes - TODO: Implement views */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="p-6"><h1>Profile Management - Coming Soon</h1></div>
              </ProtectedRoute>
            } />
            <Route path="/sponsorships" element={
              <ProtectedRoute>
                <div className="p-6"><h1>Sponsorship Management - Coming Soon</h1></div>
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute>
                <div className="p-6"><h1>Schedule - Coming Soon</h1></div>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <div className="p-6"><h1>Analytics - Coming Soon</h1></div>
              </ProtectedRoute>
            } />
          {/* Sponsor Views */}
          <Route path="/athlete-search" element={
            <ProtectedRoute>
              <div className="p-6"><h1>Athlete Search - Coming Soon</h1></div>
            </ProtectedRoute>
          } />
          <Route path="/sponsorship-management" element={
            <ProtectedRoute>
              <div className="p-6"><h1>Sponsorship Management - Coming Soon</h1></div>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <div className="p-6"><h1>Reports - Coming Soon</h1></div>
            </ProtectedRoute>
          } />
          {/* Fan Views */}
          <Route path="/athlete-profiles" element={
            <ProtectedRoute>
              <div className="p-6"><h1>Athlete Profiles - Coming Soon</h1></div>
            </ProtectedRoute>
          } />
          <Route path="/store" element={
            <ProtectedRoute>
              <div className="p-6"><h1>Store - Coming Soon</h1></div>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <div className="p-6"><h1>Notifications - Coming Soon</h1></div>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </GamificationProvider>
</UserProvider>
  );
}

// Role-based Dashboard Component
const RoleDashboard = () => {
  const { user } = React.useContext(UserContext);
  
  switch (user?.role) {
    case 'athlete':
      return <LazyAthleteDashboard />;
    case 'sponsor':
      return <LazySponsorDashboard />;
    case 'fan':
      return <LazyFanDashboard />;
    default:
      return <div>Loading Dashboard...</div>;
  }
};
