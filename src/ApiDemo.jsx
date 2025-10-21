import React, { useState, useEffect } from "react";
import { config } from './utils/config.js';

export default function ApiDemo() {
  const [athletes, setAthletes] = useState([]);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${config.apiUrl}athletes`)
      .then(res => res.json())
      .then(data => setAthletes(data.athletes || []));
  }, []);

  const handleRegister = e => {
    e.preventDefault();
    fetch(`${config.apiUrl}athletes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sport, email })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || "");
        // Refresh list
        fetch(`${config.apiUrl}athletes`)
          .then(res => res.json())
          .then(data => setAthletes(data.athletes || []));
      });
  };

  return (
    <div>
      <h2>Athletes</h2>
      <ul>
        {athletes.map((a, i) => (
          <li key={i}>{a[0]} ({a[1]}) - {a[2]}</li>
        ))}
      </ul>
      <h3>Register Athlete</h3>
      <form onSubmit={handleRegister}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={sport} onChange={e => setSport(e.target.value)} placeholder="Sport" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
