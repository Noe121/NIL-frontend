import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useApi } from '../hooks/useApi.js';
import SponsorshipTasks from '../components/SponsorshipTasks.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AnalyticsChart from '../components/AnalyticsChart.jsx';
import { toast } from 'react-toastify';

const AthleteUserPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { apiService } = useApi();
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
        const analyticsData = await apiService.getAthleteAnalytics(user.id);
        setAnalytics(analyticsData);

        // Fetch content
        const contentData = await apiService.listContent(user.id, 'athlete');
        setContent(contentData || []);

        // Fetch social metrics
        const metricsData = await apiService.getSocialMetrics(user.id, 'athlete');
        setMetrics(metricsData);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load some data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, apiService]);

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
            <AnalyticsChart
              data={Object.entries(analytics).map(([key, value]) => ({
                label: key.replace('_', ' '),
                value: typeof value === 'number' ? value : 0
              }))}
              title="Performance Metrics"
            />
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