import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import AccessibilityValidator from './AccessibilityValidator.jsx';

/**
 * RoleDemo Component - Allows testing of role-based backgrounds
 * This component provides a quick way to simulate different user roles
 * for testing the background themes
 */
export default function RoleDemo() {
  const { user, role, login, logout } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const testRoles = [
    { 
      role: 'athlete', 
      name: 'Test Athlete', 
      email: 'athlete@test.com',
      description: 'Vibrant gradient with sports-inspired colors'
    },
    { 
      role: 'sponsor', 
      name: 'Test Sponsor', 
      email: 'sponsor@test.com',
      description: 'Professional blue gradient with geometric pattern'
    },
    { 
      role: 'fan', 
      name: 'Test Fan', 
      email: 'fan@test.com',
      description: 'Warm pink gradient with community feeling'
    }
  ];

  const simulateLogin = (testRole) => {
    const testUser = testRoles.find(r => r.role === testRole);
    
    // Create a mock JWT token with the role in the payload (same as TestApp)
    const mockPayload = {
      sub: '123',
      email: testUser.email,
      role: testRole,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    };
    
    // Create a properly formatted JWT (header.payload.signature)
    const mockHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const mockPayloadEncoded = btoa(JSON.stringify(mockPayload));
    const mockSignature = 'mock-signature';
    const mockJWT = `${mockHeader}.${mockPayloadEncoded}.${mockSignature}`;
    
    login(mockJWT, testUser);
  };

  const handleLogout = () => {
    logout();
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        cursor: 'pointer'
      }} onClick={() => setIsExpanded(true)}>
        <span style={{ fontSize: '14px', color: '#333' }}>🎨 Role Demo</span>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(255,255,255,0.95)',
      padding: '15px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      minWidth: '280px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>🎨 Background Demo</h3>
        <button 
          onClick={() => setIsExpanded(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>
      
      {user ? (
        <div style={{ marginBottom: '15px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
            Current: <strong>{role}</strong> ({user.name})
          </p>
          <button
            onClick={handleLogout}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              width: '100%'
            }}
          >
            Logout (Reset to Default)
          </button>
        </div>
      ) : (
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
          Currently: Default (Unauthenticated)
        </p>
      )}
      
      <div>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
          Test Role Backgrounds:
        </p>
        {testRoles.map(testRole => (
          <button
            key={testRole.role}
            onClick={() => simulateLogin(testRole.role)}
            disabled={role === testRole.role}
            style={{
              display: 'block',
              width: '100%',
              margin: '5px 0',
              padding: '10px',
              background: role === testRole.role ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: role === testRole.role ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              textAlign: 'left'
            }}
          >
            <strong style={{ textTransform: 'capitalize' }}>{testRole.role}</strong>
            <br />
            <span style={{ fontSize: '12px', opacity: 0.9 }}>
              {testRole.description}
            </span>
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '15px' }}>
        <button
          onClick={() => setShowAccessibility(true)}
          style={{
            width: '100%',
            padding: '10px',
            background: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          ♿ Check Accessibility Compliance
        </button>
      </div>
      
      <div style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
          <strong>Note:</strong> This demo simulates user authentication to test role-based backgrounds. 
          The actual background changes are visible on the landing page.
        </p>
      </div>
      
      {/* Accessibility Validator Modal */}
      <AccessibilityValidator 
        isVisible={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
    </div>
  );
}