import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi.js';
import { config } from '../utils/config.js';
import AnalyticsChart from '../components/AnalyticsChart.jsx';
import SocialShare from '../components/SocialShare.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function LeaderboardPage() {
  const { apiService } = useApi();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('athletes');
  const [timePeriod, setTimePeriod] = useState('all-time');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchRankings();
  }, [category, timePeriod]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/leaderboard/${category}?period=${timePeriod}`);
      setRankings(Array.isArray(response) ? response : []);

      // Generate chart data for analytics
      if (config.features.advancedAnalytics && response.length > 0) {
        const chartPoints = response.slice(0, 10).map((item, index) => ({
          name: item.name || `Rank ${index + 1}`,
          value: item.points || 0
        }));
        setChartData(chartPoints);
      }

      setError('');
    } catch (err) {
      // If 401, show public demo data
      if (err.response?.status === 401) {
        const demoData = {
          athletes: [
            { id: 'demo-1', name: 'Alex Johnson', points: 15420, badges: ['Champion'] },
            { id: 'demo-2', name: 'Maria Rodriguez', points: 14850, badges: ['Consistent'] },
            { id: 'demo-3', name: 'James Chen', points: 14200, badges: ['Gold'] },
            { id: 'demo-4', name: 'Sarah Williams', points: 13890, badges: ['Silver'] },
            { id: 'demo-5', name: 'Marcus Thompson', points: 13500, badges: ['Bronze'] },
            { id: 'demo-6', name: 'Emma Davis', points: 12950 },
            { id: 'demo-7', name: 'David Wilson', points: 12400 },
            { id: 'demo-8', name: 'Lisa Brown', points: 11800 },
            { id: 'demo-9', name: 'Kevin Lee', points: 11200 },
            { id: 'demo-10', name: 'Anna Taylor', points: 10800 }
          ],
          sponsors: [
            { id: 'demo-s1', name: 'SportsPro Equipment', points: 25600, badges: ['Top Sponsor'] },
            { id: 'demo-s2', name: 'Athlete Nutrition Co.', points: 24300, badges: ['Gold'] },
            { id: 'demo-s3', name: 'Campus Gear', points: 22800, badges: ['Silver'] },
            { id: 'demo-s4', name: 'Victory Supplements', points: 21500 },
            { id: 'demo-s5', name: 'Elite Training', points: 20100 },
            { id: 'demo-s6', name: 'Pro Performance', points: 18900 },
            { id: 'demo-s7', name: 'Champion Athletics', points: 17600 },
            { id: 'demo-s8', name: 'Peak Fitness', points: 16400 },
            { id: 'demo-s9', name: 'Next Level Sports', points: 15200 },
            { id: 'demo-s10', name: 'Prime Athletics', points: 14100 }
          ],
          fans: [
            { id: 'demo-f1', name: 'SuperFan2024', points: 9850, badges: ['Top Fan'] },
            { id: 'demo-f2', name: 'AthleteSupporter', points: 9200, badges: ['Dedicated'] },
            { id: 'demo-f3', name: 'SportsEnthusiast', points: 8750 },
            { id: 'demo-f4', name: 'TeamPlayer', points: 8100 },
            { id: 'demo-f5', name: 'VictorySeeker', points: 7650 },
            { id: 'demo-f6', name: 'ChampFollower', points: 7200 },
            { id: 'demo-f7', name: 'GameChanger', points: 6850 },
            { id: 'demo-f8', name: 'ScoreKeeper', points: 6400 },
            { id: 'demo-f9', name: 'PlayMaker', points: 6050 },
            { id: 'demo-f10', name: 'EndZoneHero', points: 5700 }
          ]
        };
        
        setRankings(demoData[category] || []);
        
        // Generate chart data for demo
        const chartPoints = demoData[category]?.slice(0, 10).map((item, index) => ({
          name: item.name,
          value: item.points
        })) || [];
        setChartData(chartPoints);
        
        setError('');
      } else {
        setError('Failed to load rankings');
        setRankings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'gold': return 'bg-yellow-400 text-yellow-900';
      case 'silver': return 'bg-gray-300 text-gray-900';
      case 'bronze': return 'bg-orange-400 text-orange-900';
      case 'champion': return 'bg-purple-400 text-purple-900';
      case 'consistent': return 'bg-blue-400 text-blue-900';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'athletes': return 'Athlete Rankings';
      case 'sponsors': return 'Sponsor Rankings';
      case 'fans': return 'Fan Rankings';
      default: return 'Rankings';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Loading leaderboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Leaderboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['athletes', 'sponsors', 'fans'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    category === cat
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label htmlFor="time-period" className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              id="time-period"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all-time">All Time</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
              <option value="daily">Today</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rankings List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">{getCategoryTitle()}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {timePeriod === 'all-time' ? 'All time' :
                   timePeriod === 'monthly' ? 'This month' :
                   timePeriod === 'weekly' ? 'This week' : 'Today'}
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {rankings.map((user, index) => (
                  <div
                    key={user.id}
                    className={`p-6 ${user.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900' :
                            index === 1 ? 'bg-gray-300 text-gray-900' :
                            index === 2 ? 'bg-orange-400 text-orange-900' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.name}
                            {user.isCurrentUser && <span className="text-blue-600 ml-2">(You)</span>}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {user.points?.toLocaleString() || 0} points
                          </p>

                          {user.isCurrentUser && (
                            <p className="text-xs text-blue-600 mt-1">
                              Your Rank: {user.rank || index + 1}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {user.badges?.map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                          >
                            {badge}
                          </span>
                        ))}

                        {user.badge && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(user.badge)}`}>
                            {user.badge}
                          </span>
                        )}

                        <SocialShare
                          url={`${window.location.origin}/leaderboard/${category}/${user.id}`}
                          title={`Check out ${user.name}'s ranking on the NIL leaderboard!`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {rankings.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-500 text-lg">No rankings available yet.</p>
                  <p className="text-gray-400">Be the first to earn points!</p>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Sidebar */}
          {config.features.advancedAnalytics && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Points Distribution</h3>
                <AnalyticsChart
                  data={chartData}
                  title="Points Distribution"
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Participants</span>
                    <span className="text-sm font-medium">{rankings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Top Score</span>
                    <span className="text-sm font-medium">
                      {rankings.length > 0 ? rankings[0]?.points?.toLocaleString() || 0 : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="text-sm font-medium">
                      {rankings.length > 0
                        ? Math.round(rankings.reduce((sum, user) => sum + (user.points || 0), 0) / rankings.length).toLocaleString()
                        : 0
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}