import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar({ jwt, onLogout, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    onLogout && onLogout();
    navigate('/auth');
  };

  return (
    <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #eee', marginBottom: 24 }}>
      <Link to="/">Home</Link>
      {role === 'athlete' || role === 'student_athlete' ? <Link to="/dashboard">Dashboard</Link> : null}
      {role === 'athlete' || role === 'student_athlete' ? <Link to="/profile">Profile</Link> : null}
      {role === 'athlete' || role === 'student_athlete' ? <Link to="/sponsorships">Sponsorships</Link> : null}
      {role === 'athlete' || role === 'student_athlete' ? <Link to="/schedule">Schedule</Link> : null}
      {role === 'athlete' || role === 'student_athlete' ? <Link to="/analytics">Analytics</Link> : null}

      {role === 'sponsor' && <Link to="/dashboard">Dashboard</Link>}
      {role === 'sponsor' && <Link to="/athlete-search">Athlete Search</Link>}
      {role === 'sponsor' && <Link to="/sponsorship-management">Sponsorship Management</Link>}
      {role === 'sponsor' && <Link to="/reports">Reports</Link>}
      {role === 'sponsor' && <Link to="/profile">Profile</Link>}

      {role === 'fan' && <Link to="/dashboard">Dashboard</Link>}
      {role === 'fan' && <Link to="/athlete-profiles">Athlete Profiles</Link>}
      {role === 'fan' && <Link to="/store">Store</Link>}
      {role === 'fan' && <Link to="/notifications">Notifications</Link>}
      {role === 'fan' && <Link to="/profile">Profile</Link>}

      {!jwt && <Link to="/auth">Login</Link>}
      {!jwt && <Link to="/register">Register</Link>}
      {jwt && <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Logout</button>}
    </nav>
  );
}
