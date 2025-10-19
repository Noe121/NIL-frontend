import React from 'react';

export default function App() {
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #ff6f61, #6b48ff)',
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>🧪 NILbx - Test App</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', marginTop: '30px' }}>
        <h2>✅ Status Check</h2>
        <p>React ✅</p>
        <p>CSS ✅</p>
        <p>JavaScript ✅</p>
        <p>Vite Dev Server ✅</p>
      </div>
    </div>
  );
}