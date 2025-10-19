

import React, { useState, useEffect } from 'react';
import { useUser } from './contexts/UserContext.jsx';
import RoleDemo from './components/RoleDemo.jsx';
import axios from 'axios';
export default function LandingPage() {
  const { user, role, isAuthenticated } = useUser();
  const [athletes, setAthletes] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingAthletes, setLoadingAthletes] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // TODO: Replace with your ALB DNS or use env variable
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/';

  // Get role-based background styles
  const getRoleBasedBackground = () => {
    if (!isAuthenticated || !role) {
      // Default background for unauthenticated users
      return 'linear-gradient(90deg, #1e3c72, #2a5298)';
    }
    
    switch (role) {
      case 'athlete':
        // Vibrant, dynamic colors for young athletes
        return 'linear-gradient(135deg, #ff6f61, #6b48ff)';
      case 'sponsor':
        // Professional tones for sponsors/donors
        return 'linear-gradient(90deg, #2c3e50, #3498db)';
      case 'fan':
        // Warm, community-focused tones for fans
        return 'linear-gradient(135deg, #ff9a9e, #fad0c4)';
      default:
        return 'linear-gradient(90deg, #1e3c72, #2a5298)';
    }
  };

  // Get role-based content styling
  const getRoleBasedContentStyle = () => {
    if (!isAuthenticated || !role) {
      return {
        headerColor: '#fff',
        sectionBackground: '#fff',
        textColor: '#333'
      };
    }
    
    switch (role) {
      case 'athlete':
        return {
          headerColor: '#fff',
          sectionBackground: 'rgba(255, 255, 255, 0.95)',
          textColor: '#333',
          accentColor: '#ff6f61'
        };
      case 'sponsor':
        return {
          headerColor: '#fff', 
          sectionBackground: 'rgba(255, 255, 255, 0.95)',
          textColor: '#333',
          accentColor: '#3498db'
        };
      case 'fan':
        return {
          headerColor: '#fff',
          sectionBackground: 'rgba(255, 255, 255, 0.95)', 
          textColor: '#333',
          accentColor: '#ff9a9e'
        };
      default:
        return {
          headerColor: '#fff',
          sectionBackground: '#fff',
          textColor: '#333',
          accentColor: '#2a5298'
        };
    }
  };

  const contentStyle = getRoleBasedContentStyle();

  // Fetch athletes on mount
  useEffect(() => {
    setLoadingAthletes(true);
    axios.get(`${apiUrl}athletes`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setAthletes(response.data);
        } else if (response.data.athletes) {
          setAthletes(response.data.athletes);
        }
        setError('');
      })
      .catch(error => {
        setError('Error fetching athletes');
        setAthletes([]);
      })
      .finally(() => setLoadingAthletes(false));
  }, [apiUrl]);

  // Simple email validation
  const validateEmail = (email) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Client-side validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    setLoadingSubmit(true);
    axios.post(`${apiUrl}early-access`, formData)
      .then(response => {
        setMessage(response.data.message || 'Submitted!');
        setError('');
        setFormData({ name: '', email: '', role: '' });
      })
      .catch(error => {
        setError('Error submitting form');
        setMessage('');
      })
      .finally(() => setLoadingSubmit(false));
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <div
      key={`landing-${role || 'default'}`} // Force re-render on role change
      style={{
        background: getRoleBasedBackground(),
        minHeight: '100vh',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'background'
      }}
    >
      {/* Role Demo Component for Testing */}
      <RoleDemo />
      
      <style>{`
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0; 
          padding: 0; 
          line-height: 1.6; 
          color: ${contentStyle.textColor}; 
        }
        
        /* Role-based background overlays for visual interest */
        ${role === 'athlete' ? `
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20 20 L40 40 L60 20 L80 40" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/></svg>');
            background-size: 200px 200px;
            opacity: 0.1;
            pointer-events: none;
            z-index: -1;
          }
        ` : ''}
        
        ${role === 'sponsor' ? `
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: -1;
          }
        ` : ''}
        
        ${role === 'fan' ? `
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
            background-size: 150px 150px;
            pointer-events: none;
            z-index: -1;
          }
        ` : ''}
        
        header { 
          color: ${contentStyle.headerColor}; 
          padding: 2rem 0; 
          text-align: center; 
          position: relative;
          z-index: 1;
        }
        header h1 { 
          font-size: 2.5rem; 
          margin: 0.5rem 0; 
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        header p.slogan { 
          font-size: 1.5rem; 
          font-weight: bold; 
          letter-spacing: 1px; 
          margin: 0; 
          text-transform: uppercase; 
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        main { 
          max-width: 800px; 
          margin: 2rem auto; 
          padding: 0 1rem; 
          position: relative;
          z-index: 1;
        }
        
        section { 
          background: ${contentStyle.sectionBackground}; 
          border-radius: 12px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
          padding: 1.5rem; 
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        section h2 { 
          color: ${contentStyle.accentColor}; 
          margin-bottom: 0.8rem; 
        }
        section p { 
          color: ${contentStyle.textColor}; 
          margin: 0; 
        }
        
        .mission { 
          font-style: italic; 
          color: ${contentStyle.accentColor}; 
          margin-bottom: 1rem; 
          text-align: center;
          font-weight: 500;
        }
        
        .form-container { 
          background: ${contentStyle.sectionBackground}; 
          border-radius: 12px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
          padding: 1.5rem; 
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .form-container h3 { 
          color: ${contentStyle.accentColor}; 
          margin-bottom: 1rem; 
        }
        .form-container input, .form-container select { 
          width: 100%; 
          padding: 0.7rem; 
          margin-bottom: 0.7rem; 
          border-radius: 6px; 
          border: 1px solid #ccc;
          background: rgba(255,255,255,0.9);
        }
        .form-container button { 
          background: ${contentStyle.accentColor}; 
          color: #fff; 
          padding: 0.8rem 2rem; 
          border: none; 
          border-radius: 8px; 
          font-size: 1.1rem; 
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .form-container button:hover { 
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          filter: brightness(1.1);
        }
        
        .social-links { 
          margin-top: 1.5rem; 
          text-align: center;
        }
        .social-links h4 { 
          color: ${contentStyle.headerColor}; 
          margin-bottom: 0.5rem; 
        }
        .social-links a { 
          color: ${contentStyle.headerColor}; 
          text-decoration: none; 
          margin: 0 0.5rem; 
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        .social-links a:hover { 
          text-decoration: underline;
          transform: scale(1.1);
        }
        .social-links img { 
          width: 24px; 
          vertical-align: middle; 
          margin-right: 0.3rem; 
          filter: brightness(0) invert(1);
        }
        
        footer { 
          text-align: center; 
          color: ${contentStyle.headerColor}; 
          margin: 2rem 0 1rem; 
          font-size: 0.9rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        
        .athlete-list { 
          margin-top: 1rem; 
        }
        .athlete-list ul { 
          list-style: none; 
          padding: 0; 
        }
        .athlete-list li { 
          padding: 0.5rem; 
          border-bottom: 1px solid rgba(0,0,0,0.1);
          transition: background 0.3s ease;
        }
        .athlete-list li:hover {
          background: rgba(${contentStyle.accentColor === '#ff6f61' ? '255,111,97' : 
                            contentStyle.accentColor === '#3498db' ? '52,152,219' : 
                            contentStyle.accentColor === '#ff9a9e' ? '255,154,158' : '42,82,152'}, 0.1);
        }
        
        /* Welcome message for authenticated users */
        .welcome-message {
          background: ${contentStyle.sectionBackground};
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          text-align: center;
          border: 2px solid ${contentStyle.accentColor};
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .welcome-message h3 {
          color: ${contentStyle.accentColor};
          margin: 0 0 0.5rem 0;
        }
        .welcome-message p {
          margin: 0;
          color: ${contentStyle.textColor};
        }
        
        /* Responsive design */
        @media (max-width: 600px) { 
          .form-container { 
            padding: 1rem; 
          }
          header h1 {
            font-size: 2rem;
          }
          header p.slogan {
            font-size: 1.2rem;
          }
        }
      `}</style>
      <header>
        <h1>NILbx.com</h1>
        <p className="slogan">Crafting Your Brand, Elevating Your Experience</p>
      </header>
      <main>
        {isAuthenticated && user && (
          <div className="welcome-message">
            <h3>Welcome back, {user.name || user.email}!</h3>
            <p>You're logged in as a {role}. Enjoy your personalized experience!</p>
            <div className="dashboard-link" style={{ marginTop: '1rem' }}>
              <a 
                href={`/dashboard/${role}`} 
                style={{
                  backgroundColor: contentStyle.accentColor,
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => e.target.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.target.style.filter = 'brightness(1)'}
              >
                Go to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
              </a>
            </div>
          </div>
        )}
        
        <section className="mission">
          <p>At NILbx, our mission is to revolutionize the Name, Image, and Likeness (NIL) landscape by creating a platform that empowers athletes to craft their personal brands, connects sponsors and boosters with opportunities to elevate their experience, and unites fans through exclusive engagement. Together, we're building the future of college sports.</p>
        </section>
        <section>
          <h2>For Athletes</h2>
          <p>Showcase your skills, grow your personal brand, and unlock NIL opportunities. NILbx connects you with sponsors, investors, and fans to support your journey to greatness.</p>
          <div className="athlete-list">
            <h3>Featured Athletes</h3>
            {loadingAthletes ? (
              <p>Loading athletes...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <ul>
                {athletes.length === 0 ? (
                  <li>No athletes found.</li>
                ) : (
                  athletes.map((athlete, index) => (
                    <li key={index}>{athlete.name || athlete[0] || 'Unnamed Athlete'}</li>
                  ))
                )}
              </ul>
            )}
          </div>
        </section>
        <section>
          <h2>For Sponsors & Boosters</h2>
          <p>Discover and support promising athletes or seasoned stars. Offer sponsorships, mentorship, and be part of their inspiring stories in the evolving world of college athletics.</p>
        </section>
        <section>
          <h2>For Fans</h2>
          <p>Engage with your favorite athletes like never before. Access exclusive content, merchandise, and experiences—your support fuels their success!</p>
        </section>
        <div className="form-container">
          <h3>Get Early Access</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loadingSubmit}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loadingSubmit}
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={loadingSubmit}
            >
              <option value="">I am a...</option>
              <option value="athlete">Athlete</option>
              <option value="sponsor">Sponsor/Booster</option>
              <option value="fan">Fan</option>
            </select>
            <button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? 'Submitting...' : 'Notify Me'}
            </button>
          </form>
          {error && <p style={{ marginTop: '1rem', color: 'red' }}>{error}</p>}
          {message && <p style={{ marginTop: '1rem', color: '#1e3c72' }}>{message}</p>}
        </div>
        <div className="social-links">
          <h4>Connect with us:</h4>
          <a href="https://twitter.com/NILbxOfficial" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg" alt="Twitter" /> Twitter
          </a>
          <a href="https://instagram.com/NILbxOfficial" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" /> Instagram
          </a>
          <a href="mailto:info@nilbx.com">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maildotru.svg" alt="Email" /> Email
          </a>
        </div>
      </main>
      <footer>
        &copy; 2025 NILbx.com. All rights reserved.
      </footer>
    </div>
  );
}
