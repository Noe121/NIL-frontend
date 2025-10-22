import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useApi } from '../hooks/useApi.js';
import SponsorshipTasks from '../components/SponsorshipTasks.jsx';
import SearchComponent from '../components/SearchComponent.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { toast } from 'react-toastify';

const SponsorUserPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { apiService } = useApi();
  const [analytics, setAnalytics] = useState(null);
  const [activeSponshorships, setActiveSponshorships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'sponsor') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch analytics
        const analyticsData = await apiService.getSponsorAnalytics(user.id);
        setAnalytics(analyticsData);

        // Fetch active sponsorships
        const sponsorshipsData = await apiService.listSponsorships({
          sponsorId: user.id,
          status: 'active'
        });
        setActiveSponshorships(sponsorshipsData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load some data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, apiService]);

  const handleAthleteSelect = (athlete) => {
    // Redirect to athlete profile or open task creation modal
    if (athlete.user_id) {
      navigate(`/athletes/${athlete.user_id}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Find Athletes</h2>
        <SearchComponent 
          placeholder="Search for athletes to sponsor..."
          searchEndpoint="/athletes/search"
          onResultSelect={handleAthleteSelect}
          showFilters={true}
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-4">Sponsorship Analytics</h2>
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analytics).map(([key, value]) => (
                <div key={key} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold capitalize">
                    {key.replace('_', ' ')}
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {typeof value === 'number' ? 
                      key.toLowerCase().includes('amount') ? 
                        `$${value.toLocaleString()}` : 
                        value.toLocaleString() 
                      : value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Sponsorships Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Active Sponsorships</h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {activeSponshorships.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No active sponsorships
              </div>
            ) : (
              activeSponshorships.map((sponsorship, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{sponsorship.athlete_name}</h3>
                    <span className="text-green-600 font-medium">
                      ${sponsorship.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {sponsorship.description}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-500">
                      Started: {new Date(sponsorship.start_date).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => navigate(`/sponsorships/${sponsorship.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sponsorship Tasks Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Tasks</h2>
        <SponsorshipTasks userRole="sponsor" userAddress={user.wallet_address} />
      </div>
    </div>
  );
};

export default SponsorUserPage;