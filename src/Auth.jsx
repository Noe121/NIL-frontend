import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:9000/';

export default function Auth({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '', role: 'athlete' });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const resp = await axios.post(`${API_URL}login`, new URLSearchParams({
          username: form.email,
          password: form.password,
        }));
        localStorage.setItem('jwt', resp.data.access_token);
        onAuth && onAuth(resp.data.access_token);
      } else {
        // Registration endpoint (to be implemented in auth-service)
        await axios.post(`${API_URL}register`, {
          email: form.email,
          password: form.password,
          role: form.role,
        });
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Auth failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        {!isLogin && (
          <select name="role" value={form.role} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }}>
            <option value="athlete">Athlete</option>
            <option value="sponsor">Sponsor</option>
            <option value="fan">Fan</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit" style={{ width: '100%', marginBottom: 8 }}>{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} style={{ width: '100%' }}>
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
