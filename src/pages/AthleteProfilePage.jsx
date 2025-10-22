import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { config } from '../utils/config.js';

export default function AthleteProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiService } = useApi();
  const { user } = useAuth();
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAthleteProfile();
  }, [id]);

  const fetchAthleteProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAthlete(id);
      setAthlete(response);
      setError('');
    } catch (err) {
      // If 401 or athlete not found, show demo profile
      if (err.response?.status === 401 || err.response?.status === 404) {
        // Demo athlete data based on ID
        const demoAthletes = {
          'demo': {
            id: 'demo',
            name: 'Alex Johnson',
            sport: 'Basketball',
            university: 'State University',
            year: 'Junior',
            bio: 'Passionate basketball player with a drive to excel both on and off the court. Committed to academic excellence and community service.',
            stats: {
              points_per_game: 18.5,
              rebounds_per_game: 7.2,
              assists_per_game: 3.8,
              field_goal_percentage: 0.485
            },
            achievements: [
              'All-Conference First Team',
              'Academic All-American',
              'Community Service Award'
            ],
            social_links: {
              instagram: '@alexjohnson_bball',
              twitter: '@AlexJohnson23'
            },
            followers: 15420,
            sponsors: 3
          },
          'public-1': {
            id: 'public-1',
            name: 'Alex Johnson',
            sport: 'Basketball',
            university: 'State University',
            year: 'Junior',
            bio: 'Passionate basketball player focused on excellence in athletics and academics.',
            stats: {
              points_per_game: 18.5,
              rebounds_per_game: 7.2,
              assists_per_game: 3.8,
              field_goal_percentage: 0.485
            },
            achievements: ['All-Conference First Team', 'Academic Excellence'],
            social_links: { instagram: '@alexjohnson_bball' },
            followers: 15420,
            sponsors: 3
          },
          'public-2': {
            id: 'public-2',
            name: 'Maria Rodriguez',
            sport: 'Soccer',
            university: 'Metro University',
            year: 'Senior',
            bio: 'Dedicated soccer player with international experience and leadership skills.',
            stats: {
              goals: 24,
              assists: 16,
              minutes_played: 1840,
              shots_on_target: 68
            },
            achievements: ['Team Captain', 'Regional Player of the Year'],
            social_links: { instagram: '@maria_soccer' },
            followers: 12850,
            sponsors: 2
          },
          'public-3': {
            id: 'public-3',
            name: 'James Chen',
            sport: 'Track & Field',
            university: 'Pacific University',
            year: 'Sophomore',
            bio: 'Elite sprinter with Olympic aspirations and strong academic performance.',
            stats: {
              '100m_pb': '10.23s',
              '200m_pb': '20.89s',
              long_jump_pb: '7.85m',
              season_bests: 4
            },
            achievements: ['Conference Champion', 'NCAA Qualifier'],
            social_links: { twitter: '@JamesChenTrack' },
            followers: 9200,
            sponsors: 1
          }
        };

        const demoAthlete = demoAthletes[id] || demoAthletes['demo'];
        setAthlete(demoAthlete);
      } else {
        setError('Failed to load athlete profile');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Athlete Not Found</h2>
          <p className="text-gray-600 mb-6">The athlete profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {athlete.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{athlete.name}</h1>
              <p className="text-xl text-gray-600">{athlete.sport} • {athlete.university}</p>
              <p className="text-gray-500">{athlete.year} Year</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-600">
                  👥 {athlete.followers?.toLocaleString() || 0} followers
                </span>
                <span className="text-sm text-gray-600">
                  🤝 {athlete.sponsors || 0} sponsors
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              {!user && (
                <button
                  onClick={() => navigate('/auth?redirect=' + window.location.pathname)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Follow Athlete
                </button>
              )}
              {!user && (
                <button
                  onClick={() => navigate('/auth?redirect=/marketplace')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Sponsor This Athlete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-700">{athlete.bio}</p>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(athlete.stats || {}).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{value}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <div className="space-y-2">
                {athlete.achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-yellow-500">🏆</span>
                    <span>{achievement}</span>
                  </div>
                )) || <p className="text-gray-500">No achievements listed</p>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-2">
                {athlete.social_links?.instagram && (
                  <a
                    href={`https://instagram.com/${athlete.social_links.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-700 hover:text-pink-600"
                  >
                    <span>📷</span>
                    <span>{athlete.social_links.instagram}</span>
                  </a>
                )}
                {athlete.social_links?.twitter && (
                  <a
                    href={`https://twitter.com/${athlete.social_links.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <span>🐦</span>
                    <span>{athlete.social_links.twitter}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Call to Action */}
            {!user && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Support This Athlete</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Help {athlete.name} reach their goals through sponsorship opportunities.
                </p>
                <button
                  onClick={() => navigate('/auth?redirect=/marketplace')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Start Sponsoring
                </button>
              </div>
            )}

            {/* Login Prompt for Premium Features */}
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">🔒 Premium Features</h3>
                <ul className="text-sm text-yellow-800 space-y-1 mb-4">
                  <li>• Direct messaging</li>
                  <li>• Exclusive content access</li>
                  <li>• Behind-the-scenes updates</li>
                  <li>• Priority sponsorship opportunities</li>
                </ul>
                <button
                  onClick={() => navigate('/auth?redirect=' + window.location.pathname)}
                  className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Login to Unlock
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}