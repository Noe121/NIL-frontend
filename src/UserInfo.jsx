import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from './utils/config.js';

export default function UserInfo() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await axios.get(`${config.apiUrl}me`);
        setUser(resp.data);
      } catch (err) {
        setError('Could not fetch user info');
      }
    };
    fetchUser();
  }, []);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!user) return <div>Loading user info...</div>;

  return (
    <div style={{ marginBottom: 16, background: '#f7f7f7', padding: 12, borderRadius: 6 }}>
      <strong>User:</strong> {user.email || user.username} <br />
      <strong>Role:</strong> {user.role}
    </div>
  );
}
