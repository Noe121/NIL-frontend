

import { useState, useEffect } from 'react';
import axios from 'axios';
export default function LandingPage() {
  const [athletes, setAthletes] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingAthletes, setLoadingAthletes] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // TODO: Replace with your ALB DNS or use env variable
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/';

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
    <>
      <style>{`
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
        header { background: linear-gradient(90deg, #1e3c72, #2a5298); color: #fff; padding: 2rem 0; text-align: center; }
        header h1 { font-size: 2.5rem; margin: 0.5rem 0; }
        header p.slogan { font-size: 1.5rem; font-weight: bold; letter-spacing: 1px; margin: 0; text-transform: uppercase; }
        main { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        section { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(30,60,114,0.08); padding: 1.5rem; margin-bottom: 1.5rem; }
        section h2 { color: #1e3c72; margin-bottom: 0.8rem; }
        section p { color: #555; margin: 0; }
        .mission { font-style: italic; color: #2a5298; margin-bottom: 1rem; }
        .form-container { background: #f4f8fc; border-radius: 10px; box-shadow: 0 1px 6px rgba(30,60,114,0.07); padding: 1.5rem; text-align: center; }
        .form-container h3 { color: #2a5298; margin-bottom: 1rem; }
        .form-container input, .form-container select { width: 100%; padding: 0.7rem; margin-bottom: 0.7rem; border-radius: 6px; border: 1px solid #ccc; }
        .form-container button { background: #2a5298; color: #fff; padding: 0.8rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; }
        .form-container button:hover { background: #1e3c72; }
        .social-links { margin-top: 1.5rem; }
        .social-links h4 { color: #2a5298; margin-bottom: 0.5rem; }
        .social-links a { color: #1e3c72; text-decoration: none; margin: 0 0.5rem; font-size: 1.2rem; }
        .social-links a:hover { text-decoration: underline; }
        .social-links img { width: 24px; vertical-align: middle; margin-right: 0.3rem; }
        footer { text-align: center; color: #888; margin: 2rem 0 1rem; font-size: 0.9rem; }
        .athlete-list { margin-top: 1rem; }
        .athlete-list ul { list-style: none; padding: 0; }
        .athlete-list li { padding: 0.5rem; border-bottom: 1px solid #eee; }
      `}</style>
      <header>
        <h1>NILbx.com</h1>
        <p className="slogan">Crafting Your Brand, Elevating Your Experience</p>
      </header>
      <main>
        <section className="mission">
          <p>At NILbx, our mission is to revolutionize the Name, Image, and Likeness (NIL) landscape by creating a platform that empowers athletes to craft their personal brands, connects sponsors and boosters with opportunities to elevate their experience, and unites fans through exclusive engagement. Together, we’re building the future of college sports.</p>
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
    </>
  );
}
