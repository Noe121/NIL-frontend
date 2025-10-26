import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ApiProvider } from './contexts/ApiContext.jsx';
import { Web3Provider } from './contexts/Web3Context.jsx';
import { useAuth } from './hooks/useAuth.js';
import { config, utils, APP_MODE, IS_CENTRALIZED, IS_DEV } from './utils/config.js';

// Core components that should load immediately
import NavigationBar from './components/NavigationBar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { ToastProvider } from './components/NotificationToast.jsx';

// Landing page loads immediately (most important)
import LandingPage from './pages/LandingPage.jsx';
import SportsPage from './pages/SportsPage.jsx';
import InfluencerLandingPage from './components/Landing/InfluencerLandingPage.jsx';
import BrandLandingPage from './components/Landing/BrandLandingPage.jsx';
import FanLandingPage from './components/Landing/FanLandingPage.jsx';
import AgencyLandingPage from './components/Landing/AgencyLandingPage.jsx';

// Lazy load other pages for better performance
const Auth = lazy(() => import('./pages/Auth.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const AthleteUserPage = lazy(() => import('./pages/AthleteUserPage.jsx'));
const AthleteProfilePage = lazy(() => import('./pages/AthleteProfilePage.jsx'));
const InfluencerUserPage = lazy(() => import('./pages/InfluencerUserPage.jsx'));
const InfluencerProfilePage = lazy(() => import('./pages/InfluencerProfilePage.jsx'));
const SponsorUserPage = lazy(() => import('./pages/SponsorUserPage.jsx'));
const FanUserPage = lazy(() => import('./pages/FanUserPage.jsx'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage.jsx'));
const CommunityPage = lazy(() => import('./pages/CommunityPage.jsx'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage.jsx'));
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage.jsx'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage.jsx'));
const ErrorPage = lazy(() => import('./pages/ErrorPage.jsx'));

// Payment System Pages
const CreateDeal = lazy(() => import('./pages/CreateDeal.jsx'));
const ClaimDeal = lazy(() => import('./pages/ClaimDeal.jsx'));
const FutureDeals = lazy(() => import('./pages/FutureDeals.jsx'));

// Components
import NavBar from './components/NavBar.jsx';

// Simple test to make sure everything works
function TestPage() {
  return (
    <div data-testid="test-page" style={{
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>🧪 Test Page</h1>
      <p>This is the test route!</p>
      <a href="/" style={{ color: 'white' }}>← Back to Home</a>
    </div>
  );
}// Safe provider wrapper
export function SafeProvider({ children }) {
  try {
    return (
      <AuthProvider>
        <ApiProvider>
          <Web3Provider>
            {children}
          </Web3Provider>
        </ApiProvider>
      </AuthProvider>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px', background: 'red', color: 'white', fontFamily: 'Arial' }}>
        <h1>❌ Provider Error</h1>
        <pre>{error.toString()}</pre>
      </div>
    );
  }
}

export default function App() {
  return (
    <ToastProvider>
      <SafeProvider>
                <div data-testid="app-container">
          <NavigationBar />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/creator" element={<InfluencerLandingPage />} />
            <Route path="/brand" element={<BrandLandingPage />} />
            <Route path="/fan" element={<FanLandingPage />} />
            <Route path="/agency" element={<AgencyLandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Public Athlete Profiles */}
            <Route path="/athletes/:id" element={<AthleteProfilePage />} />

            {/* Public Influencer Profiles */}
            <Route path="/influencer/:id" element={<InfluencerProfilePage />} />

            {/* Role-specific dashboards */}
            <Route path="/dashboard/athlete" element={
              <ProtectedRoute role="athlete">
                <AthleteUserPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/influencer" element={
              <ProtectedRoute roles={['influencer', 'student_athlete']}>
                <InfluencerUserPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/sponsor" element={
              <ProtectedRoute role="sponsor">
                <SponsorUserPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/fan" element={
              <ProtectedRoute role="fan">
                <FanUserPage />
              </ProtectedRoute>
            } />

            {/* Payment System Routes */}
            <Route path="/create-deal" element={
              <ProtectedRoute role="sponsor">
                <CreateDeal />
              </ProtectedRoute>
            } />
            <Route path="/claim-deal/:dealId" element={
              <ProtectedRoute role="athlete">
                <ClaimDeal />
              </ProtectedRoute>
            } />
            <Route path="/future-deals" element={
              <ProtectedRoute role="athlete">
                <FutureDeals />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <HelpCenterPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </div>
      </SafeProvider>
    </ToastProvider>
  );
}