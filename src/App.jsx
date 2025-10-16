import React from 'react';
import { UserProvider } from './contexts/UserContext.jsx';
import SimpleLandingPage from './SimpleLandingPage.jsx';

export default function App() {
  return (
    <UserProvider>
      <SimpleLandingPage />
    </UserProvider>
  );
}
