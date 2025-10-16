import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>NILbx Test Page</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        background: 'linear-gradient(135deg, #ff6f61, #6b48ff)', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h2>🎉 React Application Loaded Successfully!</h2>
        <p>The frontend is running correctly.</p>
      </div>
    </div>
  );
}