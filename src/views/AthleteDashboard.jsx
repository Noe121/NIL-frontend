import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

export default function AthleteDashboard() {
  const [stats, setStats] = useState(null);
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
  // Fetch athlete profile and stats
  const athletesResp = await axios.get(`${API_URL}athletes`);
  setStats(athletesResp.data.athletes[0]?.stats || {});
  // Example: Fetch sponsorships (if endpoint exists)
  // const sponsorshipsResp = await axios.get(`${API_URL}sponsorships`);
  // setSponsorships(sponsorshipsResp.data.sponsorships || []);
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2>Athlete Dashboard</h2>
      <div><strong>Stats:</strong> {stats ? JSON.stringify(stats) : 'No stats available.'}</div>
      <div>
        <strong>Sponsorship Requests:</strong>
        <ul>
          {sponsorships.map((s, i) => (
            <li key={i}>{s.company} - {s.status}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
