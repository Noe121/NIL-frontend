import React, { useState, useEffect } from 'react';
import { useUser } from './contexts/UserContext.jsx';
import RoleDemo from './components/RoleDemo.jsx';

export default function SimpleLandingPage() {
  const { user, role, isAuthenticated } = useUser();
  const [athletes, setAthletes] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [message, setMessage] = useState('');

  // Role-based background styles
  const getRoleBasedBackground = () => {
    switch (role) {
      case 'athlete':
        return 'linear-gradient(135deg, #ff6f61, #6b48ff)'; // Coral to purple
      case 'sponsor':
        return 'linear-gradient(135deg, #2c3e50, #3498db)'; // Slate to blue
      case 'fan':
        return 'linear-gradient(135deg, #ff9a9e, #fad0c4)'; // Pink to peach
      default:
        return 'linear-gradient(135deg, #1e3c72, #2a5298)'; // Default blue
    }
  };

  const getRoleBasedContentStyle = () => {
    return {
      headerColor: '#fff',
      sectionBackground: 'rgba(255, 255, 255, 0.95)',
      textColor: '#333',
      accentColor: role === 'athlete' ? '#ff6f61' : 
                   role === 'sponsor' ? '#3498db' : 
                   role === 'fan' ? '#ff9a9e' : '#2a5298'
    };
  };

  const contentStyle = getRoleBasedContentStyle();

  // Mock data
  useEffect(() => {
    setAthletes([
      { id: 1, name: 'Sarah Johnson', sport: 'Basketball', achievements: 'All-State Player', image: null },
      { id: 2, name: 'Mike Chen', sport: 'Football', achievements: 'Team Captain', image: null },
      { id: 3, name: 'Emma Davis', sport: 'Soccer', achievements: 'Regional Champion', image: null }
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Thank you for your interest! We\'ll be in touch soon.');
    setFormData({ name: '', email: '', role: '' });
  };

  return (
    <div
      key={`landing-${role || 'default'}`}
      style={{
        background: getRoleBasedBackground(),
        minHeight: '100vh',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'background',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Role Demo Component */}
      <RoleDemo />
      
      {/* Header */}
      <header style={{ 
        color: contentStyle.headerColor, 
        padding: '2rem 0', 
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>
          NILbx.com
        </h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', margin: 0 }}>
          Crafting Your Brand, Elevating Your Experience
        </p>
        
        {/* Welcome Message for Authenticated Users */}
        {user && (
          <div style={{
            background: contentStyle.sectionBackground,
            borderRadius: '12px',
            padding: '1rem',
            margin: '1.5rem auto',
            maxWidth: '600px',
            textAlign: 'center',
            border: `2px solid ${contentStyle.accentColor}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ color: contentStyle.accentColor, margin: '0 0 0.5rem 0' }}>
              Welcome back, {user.name}!
            </h3>
            <p style={{ margin: 0, color: contentStyle.textColor }}>
              You're logged in as a <strong>{role}</strong>. Enjoy your personalized experience!
            </p>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        
        {/* Mission Section */}
        <section style={{ 
          background: contentStyle.sectionBackground, 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h2 style={{ color: contentStyle.accentColor, marginBottom: '0.8rem' }}>
            Our Mission
          </h2>
          <p style={{ color: contentStyle.textColor, lineHeight: 1.6 }}>
            At NILbx, our mission is to revolutionize the Name, Image, and Likeness (NIL) landscape by creating a platform that empowers athletes to craft their personal brands, connects sponsors and boosters with opportunities to elevate their experience, and unites fans through exclusive engagement. Together, we're building the future of college sports.
          </p>
        </section>

        {/* Athletes Section */}
        <section style={{ 
          background: contentStyle.sectionBackground, 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h2 style={{ color: contentStyle.accentColor, marginBottom: '0.8rem' }}>
            Featured Athletes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {athletes.map(athlete => (
              <div key={athlete.id} style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                border: `1px solid ${contentStyle.accentColor}20`
              }}>
                <h3 style={{ color: contentStyle.accentColor, margin: '0 0 0.5rem 0' }}>
                  {athlete.name}
                </h3>
                <p style={{ margin: '0.5rem 0', color: contentStyle.textColor }}>
                  <strong>Sport:</strong> {athlete.sport}
                </p>
                <p style={{ margin: '0.5rem 0', color: contentStyle.textColor }}>
                  <strong>Achievements:</strong> {athlete.achievements}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Early Access Form */}
        <section style={{ 
          background: contentStyle.sectionBackground, 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h2 style={{ color: contentStyle.accentColor, marginBottom: '0.8rem' }}>
            Join Our Early Access
          </h2>
          
          {message && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '0.75rem',
              borderRadius: '0.25rem',
              marginBottom: '1rem',
              border: '1px solid #c3e6cb'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: contentStyle.textColor }}>
                Name:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${contentStyle.accentColor}40`,
                  borderRadius: '0.25rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: contentStyle.textColor }}>
                Email:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${contentStyle.accentColor}40`,
                  borderRadius: '0.25rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: contentStyle.textColor }}>
                I am a:
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${contentStyle.accentColor}40`,
                  borderRadius: '0.25rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select your role</option>
                <option value="athlete">Student Athlete</option>
                <option value="sponsor">Sponsor/Business</option>
                <option value="fan">Fan/Supporter</option>
              </select>
            </div>
            
            <button
              type="submit"
              style={{
                background: contentStyle.accentColor,
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '1rem',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
            >
              Join Early Access
            </button>
          </form>
        </section>

        {/* Social Links */}
        <section style={{ 
          background: contentStyle.sectionBackground, 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h2 style={{ color: contentStyle.accentColor, marginBottom: '0.8rem' }}>
            Connect With Us
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="https://twitter.com/NILbxOfficial" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: contentStyle.accentColor,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.25rem',
              transition: 'all 0.3s ease'
            }}>
              Twitter
            </a>
            <a href="https://instagram.com/NILbxOfficial" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: contentStyle.accentColor,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.25rem',
              transition: 'all 0.3s ease'
            }}>
              Instagram
            </a>
            <a href="mailto:info@nilbx.com" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: contentStyle.accentColor,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.25rem',
              transition: 'all 0.3s ease'
            }}>
              Email
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: 'rgba(255,255,255,0.8)',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}>
        &copy; 2025 NILbx.com. All rights reserved.
      </footer>
    </div>
  );
}