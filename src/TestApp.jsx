import React, { useState } from 'react';
import { useUser } from './contexts/UserContext.jsx';

export default function TestApp() {
  const { user, role, login, logout } = useUser();
  const [testMode, setTestMode] = useState(false);

  // Simple role simulation
  const simulateRole = (roleType) => {
    const testUser = { name: `Test ${roleType}`, email: `${roleType}@test.com` };
    
    // Create a mock JWT token with the role in the payload
    const mockPayload = {
      sub: '123',
      email: `${roleType}@test.com`,
      role: roleType,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    };
    
    // Create a properly formatted JWT (header.payload.signature)
    const mockHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const mockPayloadEncoded = btoa(JSON.stringify(mockPayload));
    const mockSignature = 'mock-signature';
    const mockJWT = `${mockHeader}.${mockPayloadEncoded}.${mockSignature}`;
    
    login(mockJWT, testUser);
  };

  // Role-based background
  const getBackground = () => {
    switch (role) {
      case 'athlete':
        return 'linear-gradient(135deg, #ff6f61, #6b48ff)'; // Coral to purple
      case 'sponsor':
        return 'linear-gradient(135deg, #2c3e50, #3498db)'; // Slate to blue
      case 'fan':
        return 'linear-gradient(135deg, #ff9a9e, #fad0c4)'; // Pink to peach
      default:
        return 'linear-gradient(135deg, #f8f9fa, #e9ecef)'; // Light gray
    }
  };

  return (
    <div 
      key={`background-${role || 'default'}`} // Force re-render on role change
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        background: getBackground(),
        minHeight: '100vh',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother transition
        willChange: 'background' // Optimize for background changes
      }}
    >
      <h1 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        NILbx Role-Based Backgrounds ✨
      </h1>
      
      {user && (
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <p><strong>Current User:</strong> {user.name} ({role})</p>
          <p><strong>Background:</strong> {getBackground()}</p>
          <button
            onClick={logout}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}

      <div style={{
        background: 'rgba(255,255,255,0.9)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h2>🎨 Test Role Backgrounds</h2>
        <p>Click a role to see the background change:</p>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => simulateRole('athlete')}
            disabled={role === 'athlete'}
            style={{
              background: role === 'athlete' ? '#95a5a6' : '#ff6f61',
              color: 'white',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '8px',
              cursor: role === 'athlete' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              transform: role === 'athlete' ? 'scale(0.95)' : 'scale(1)',
              boxShadow: role === 'athlete' ? 'none' : '0 4px 8px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              if (role !== 'athlete') {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.background = '#ff5722';
              }
            }}
            onMouseOut={(e) => {
              if (role !== 'athlete') {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = '#ff6f61';
              }
            }}
          >
            🏃 Athlete (Vibrant)
          </button>
          
          <button
            onClick={() => simulateRole('sponsor')}
            disabled={role === 'sponsor'}
            style={{
              background: role === 'sponsor' ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '8px',
              cursor: role === 'sponsor' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              transform: role === 'sponsor' ? 'scale(0.95)' : 'scale(1)',
              boxShadow: role === 'sponsor' ? 'none' : '0 4px 8px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              if (role !== 'sponsor') {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.background = '#2980b9';
              }
            }}
            onMouseOut={(e) => {
              if (role !== 'sponsor') {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = '#3498db';
              }
            }}
          >
            💼 Sponsor (Professional)
          </button>
          
          <button
            onClick={() => simulateRole('fan')}
            disabled={role === 'fan'}
            style={{
              background: role === 'fan' ? '#95a5a6' : '#ff9a9e',
              color: 'white',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '8px',
              cursor: role === 'fan' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              transform: role === 'fan' ? 'scale(0.95)' : 'scale(1)',
              boxShadow: role === 'fan' ? 'none' : '0 4px 8px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              if (role !== 'fan') {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.background = '#ff6b7a';
              }
            }}
            onMouseOut={(e) => {
              if (role !== 'fan') {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = '#ff9a9e';
              }
            }}
          >
            💖 Fan (Community)
          </button>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.9)',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <h3>✅ Features Working:</h3>
        <ul>
          <li>React 18 + Vite development environment</li>
          <li>UserContext with authentication simulation</li>
          <li>Role-based background switching</li>
          <li>Smooth CSS transitions</li>
          <li>Responsive design</li>
        </ul>
        
        <h3>🎯 Role Themes:</h3>
        <ul>
          <li><strong>Athlete:</strong> Coral to purple gradient (vibrant/dynamic)</li>
          <li><strong>Sponsor:</strong> Slate to blue gradient (sophisticated/professional)</li>
          <li><strong>Fan:</strong> Pink to peach gradient (warm/community)</li>
          <li><strong>Default:</strong> Light gray gradient (neutral/clean)</li>
        </ul>
      </div>
    </div>
  );
}