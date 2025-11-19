import React, { useState, useEffect } from 'react';

/**
 * Athlete Roster Component
 * Displays all athletes at the school with their NIL status
 */
const AthleteRoster = ({ schoolId, schoolType }) => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadAthletes();
  }, [schoolId]);

  const loadAthletes = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8011';
      const response = await fetch(
        `${baseUrl}/api/school/${schoolId}/athletes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to load athletes');
      const data = await response.json();
      setAthletes(data.athletes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort athletes
  let filteredAthletes = athletes.filter((athlete) => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = filterSport === 'all' || athlete.sport === filterSport;
    return matchesSearch && matchesSport;
  });

  filteredAthletes = filteredAthletes.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'deals') return (b.active_deals || 0) - (a.active_deals || 0);
    if (sortBy === 'revenue') return (b.total_revenue || 0) - (a.total_revenue || 0);
    return 0;
  });

  const sports = [...new Set(athletes.map((a) => a.sport))].sort();

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading athlete roster...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Search Athlete</label>
            <input
              type="text"
              placeholder="Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sport Filter */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Sport</label>
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sports</option>
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name (A-Z)</option>
              <option value="deals">Active Deals (High-Low)</option>
              <option value="revenue">Revenue (High-Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Athlete</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Sport</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Class</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Active Deals</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Total Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredAthletes.length > 0 ? (
              filteredAthletes.map((athlete) => (
                <tr key={athlete.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                        {athlete.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{athlete.name}</p>
                        <p className="text-xs text-slate-600">ID: {athlete.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{athlete.sport || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{athlete.class_year || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">
                    {athlete.active_deals || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">
                    ${(athlete.total_revenue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <AthleteStatusBadge status={athlete.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-600">
                  No athletes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Athletes"
          value={athletes.length}
          icon="👥"
          color="bg-blue-50 border-blue-200"
        />
        <SummaryCard
          label="Active Deals"
          value={athletes.reduce((sum, a) => sum + (a.active_deals || 0), 0)}
          icon="📊"
          color="bg-green-50 border-green-200"
        />
        <SummaryCard
          label="Total Revenue"
          value={`$${athletes.reduce((sum, a) => sum + (a.total_revenue || 0), 0).toLocaleString()}`}
          icon="💰"
          color="bg-purple-50 border-purple-200"
        />
      </div>
    </div>
  );
};

/**
 * Athlete Status Badge
 */
const AthleteStatusBadge = ({ status }) => {
  const statusConfig = {
    active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
    pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    inactive: { label: 'Inactive', bg: 'bg-slate-100', text: 'text-slate-700' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

/**
 * Summary Card
 */
const SummaryCard = ({ label, value, icon, color }) => (
  <div className={`${color} border rounded-lg p-4`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

export default AthleteRoster;
