import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';
import { useConfig } from '../utils/config.js';
import SponsorshipTasks from '../components/SponsorshipTasks.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { toast } from 'react-toastify';

const AthleteUserPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const config = useConfig();
  const [analytics, setAnalytics] = useState(null);
  const [content, setContent] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'athlete') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch analytics
        const analyticsResponse = await fetch(
          `${config.API_URL}/athletes/${user.id}/analytics`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
        if (!analyticsResponse.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData.analytics);

        // Fetch content
        const contentResponse = await fetch(
          `${config.API_URL}/athletes/${user.id}/content`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
        if (!contentResponse.ok) throw new Error('Failed to fetch content');
        const contentData = await contentResponse.json();
        setContent(contentData.content || []);

        // Fetch social metrics
        const metricsResponse = await fetch(
          `${config.API_URL}/athletes/${user.id}/social-metrics`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
        if (!metricsResponse.ok) throw new Error('Failed to fetch metrics');
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData.metrics);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load some data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, config]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div data-testid="athlete-dashboard" className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Section */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-4">Analytics & Performance</h2>
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analytics).map(([key, value]) => (
                <div key={key} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold capitalize">
                    {key.replace('_', ' ')}
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Social Metrics Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Social Media Impact</h2>
          {metrics && (
            <div className="bg-white rounded-lg shadow p-4">
              {Object.entries(metrics).map(([platform, stats]) => (
                <div key={platform} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold capitalize mb-2">
                    {platform}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between">
                        <span className="text-gray-600 capitalize">
                          {stat.replace('_', ' ')}
                        </span>
                        <span className="font-semibold">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="capitalize px-2 py-1 bg-gray-100 rounded">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsorship Tasks Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Sponsorship Tasks</h2>
        <SponsorshipTasks userRole="athlete" userAddress={user.wallet_address} />
      </div>
    </div>
  );
};

export default AthleteUserPage;