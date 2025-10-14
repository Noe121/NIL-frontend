import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import Auth from './Auth.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function App() {
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'));

  const handleAuth = (token) => {
    setJwt(token);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
