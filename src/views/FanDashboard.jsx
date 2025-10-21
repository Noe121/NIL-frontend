import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../utils/config.js';

export default function FanDashboard() {
  const [favorites, setFavorites] = useState([]);
  const [newContent, setNewContent] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
  // Fetch fan profile and favorites
  const fansResp = await axios.get(`${config.apiUrl}fans`);
  setFavorites(fansResp.data.fans[0]?.favorite_athletes || []);
  // Example: Fetch new content and deals (if endpoints exist)
  // const contentResp = await axios.get(`${config.apiUrl}fan-content`);
  // setNewContent(contentResp.data.content || []);
  // const dealsResp = await axios.get(`${config.apiUrl}fan-deals`);
  // setDeals(dealsResp.data.deals || []);
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
      <h2>Fan Dashboard</h2>
      <div>
        <strong>Favorites:</strong>
        <ul>
          {favorites.map((a, i) => (
            <li key={i}>{a.name} ({a.sport})</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>New Content:</strong>
        <ul>
          {newContent.map((c, i) => (
            <li key={i}>{c.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Deals:</strong>
        <ul>
          {deals.map((d, i) => (
            <li key={i}>{d.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
