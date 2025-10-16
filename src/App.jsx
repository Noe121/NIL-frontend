import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import Auth from './Auth.jsx';
import Register from './Register.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import NavBar from './NavBar.jsx';
import UserInfo from './UserInfo.jsx';
import AthleteDashboard from './views/AthleteDashboard.jsx';
import SponsorDashboard from './views/SponsorDashboard.jsx';
import FanDashboard from './views/FanDashboard.jsx';

export default function App() {
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'));
  const [role, setRole] = useState(null);

  const handleAuth = (token) => {
    setJwt(token);
    // Decode JWT to get role
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    } catch {
      setRole(null);
    }
  };

  const handleLogout = () => {
    setJwt(null);
    setRole(null);
  };

  // If JWT exists on load, decode role
  React.useEffect(() => {
    if (jwt) {
      try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        setRole(payload.role);
      } catch {
        setRole(null);
      }
    }
  }, [jwt]);

  return (
    <BrowserRouter>
      <NavBar jwt={jwt} onLogout={handleLogout} role={role} />
      <Routes>
        <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
        <Route path="/register" element={<Register />} />
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
          role === 'athlete' ? <AthleteDashboard /> :
          role === 'sponsor' ? <SponsorDashboard /> :
          role === 'fan' ? <FanDashboard /> : <div>Dashboard</div>
        } />
        <Route path="/profile" element={<div>Profile Management</div>} />
        <Route path="/sponsorships" element={<div>Sponsorships</div>} />
        <Route path="/schedule" element={<div>Schedule</div>} />
        <Route path="/analytics" element={<div>Analytics</div>} />
        {/* Sponsor Views */}
        <Route path="/athlete-search" element={<div>Athlete Search</div>} />
        <Route path="/sponsorship-management" element={<div>Sponsorship Management</div>} />
        <Route path="/reports" element={<div>Reports</div>} />
        {/* Fan Views */}
        <Route path="/athlete-profiles" element={<div>Athlete Profiles</div>} />
        <Route path="/store" element={<div>Store</div>} />
        <Route path="/notifications" element={<div>Notifications</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
