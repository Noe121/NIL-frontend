import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from './utils/config.js';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', role: 'athlete' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await axios.post(`${config.authServiceUrl}register`, {
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
        <select name="role" value={form.role} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }}>
          <option value="athlete">Athlete</option>
          <option value="sponsor">Sponsor</option>
          <option value="fan">Fan</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ width: '100%', marginBottom: 8 }}>Register</button>
      </form>
      <button onClick={() => navigate('/auth')} style={{ width: '100%' }}>
        Already have an account? Login
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>Registration successful! Redirecting...</div>}
    </div>
  );
}
