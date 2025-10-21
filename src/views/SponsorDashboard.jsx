import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../utils/config.js';

export default function SponsorDashboard() {
  const [budget, setBudget] = useState(null);
  const [activeSponsorships, setActiveSponsorships] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
  // Fetch sponsor profile and budget
  const sponsorsResp = await axios.get(`${config.apiUrl}sponsors`);
  setBudget(sponsorsResp.data.sponsors[0]?.budget || 0);
  // Example: Fetch sponsorships and recommendations (if endpoints exist)
  // const sponsorshipsResp = await axios.get(`${config.apiUrl}sponsorships`);
  // setActiveSponsorships(sponsorshipsResp.data.sponsorships || []);
  // const recResp = await axios.get(`${config.apiUrl}athletes`);
  // setRecommendations(recResp.data.athletes || []);
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
      <h2>Sponsor Dashboard</h2>
      <div><strong>Budget:</strong> ${budget}</div>
      <div>
        <strong>Active Sponsorships:</strong>
        <ul>
          {activeSponsorships.map((s, i) => (
            <li key={i}>{s.athlete} - {s.status}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Recommended Athletes:</strong>
        <ul>
          {recommendations.map((a, i) => (
            <li key={i}>{a.name} ({a.sport})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
