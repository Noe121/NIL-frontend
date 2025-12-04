import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useApi } from '../hooks/useApi.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import TierBadge from '../components/TierBadge.jsx';
import FollowerTracker from '../components/FollowerTracker.jsx';
import AnalyticsChart from '../components/AnalyticsChart.jsx';
import { toast } from 'react-toastify';
import { Edit2, LogOut, Save } from 'lucide-react';

const InfluencerUserPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { apiService } = useApi();
  const [influencer, setInfluencer] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!user || (user.role !== 'influencer' && user.role !== 'student_athlete')) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch influencer profile
        const profileData = await apiService.getInfluencer(user.id);
        setInfluencer(profileData);

        // Initialize formData with profile data, adding default values for optional fields
        setFormData({
          ...profileData,
          niche_category: profileData.niche_category || '',
          university: profileData.university || '',
          sport: profileData.sport || '',
          bio: profileData.bio || '',
          social_media: profileData.social_media || {}
        });

        // Normalize analytics to an array so AnalyticsChart can always map safely
        const analyticsData = Array.isArray(profileData.analytics) ? profileData.analytics : [];
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, apiService]);

  const handleUpdateFollowers = async (newCount) => {
    try {
      const result = await apiService.updateInfluencerFollowers(user.id, newCount);
      setInfluencer((prev) => ({
        ...prev,
        follower_count: newCount,
        tier: result.new_tier
      }));
      toast.success(
        result.tier_changed
          ? `Tier updated to ${result.new_tier}! 🎉`
          : 'Followers updated!'
      );
    } catch (error) {
      console.error('Error updating followers:', error);
      toast.error('Failed to update followers');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await apiService.updateInfluencer(user.id, formData);
      setInfluencer(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      social_media: {
        ...(prev.social_media || {}),
        [platform]: value
      }
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Your Influencer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your profile and track your growth</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {isEditing ? (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 size={20} />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niche Category
                    </label>
                    <input
                      type="text"
                      name="niche_category"
                      value={formData.niche_category || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., fitness, gaming, lifestyle"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 capitalize">
                      {influencer.type || 'influencer'}
                    </div>
                  </div>
                </div>

                {/* Student Athlete Fields */}
                {influencer.type === 'student_athlete' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        Sport
                      </label>
                      <input
                        type="text"
                        name="sport"
                        value={formData.sport || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg disabled:bg-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        University
                      </label>
                      <input
                        type="text"
                        name="university"
                        value={formData.university || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg disabled:bg-blue-100"
                      />
                    </div>
                  </div>
                )}

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                  <div className="space-y-3">
                    {['instagram', 'twitter', 'tiktok', 'youtube'].map((platform) => (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {platform}
                        </label>
                        <input
                          type="text"
                          placeholder={`@username`}
                          value={formData.social_media?.[platform] || ''}
                          onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="opacity-90">Tier</span>
                  <TierBadge tier={influencer.tier} followerCount={0} showFollowers={false} />
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-blue-400">
                  <span className="opacity-90">Followers</span>
                  <span className="text-2xl font-bold">{(influencer.follower_count / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-blue-400">
                  <span className="opacity-90">Status</span>
                  <span className="font-bold text-green-300">Active</span>
                </div>
              </div>
            </div>

            {/* Follower Tracker */}
            <FollowerTracker
              currentFollowers={influencer.follower_count}
              currentTier={influencer.tier}
              onUpdateFollowers={handleUpdateFollowers}
            />
          </div>
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
            <AnalyticsChart data={analytics} />
          </div>
        )}

        {/* Earnings Info */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Your Earning Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-2">
                <strong>Current Tier:</strong> <span className="capitalize text-lg text-green-600 font-bold">{influencer.tier}</span>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Base Payout:</strong> $
                {influencer.tier === 'starter' && '575'}
                {influencer.tier === 'standard' && '750'}
                {influencer.tier === 'professional' && '1,200'}
                {influencer.tier === 'elite' && '2,500'}
                {influencer.tier === 'mega' && '5,000'}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Your base payout is multiplied by your tier level for each sponsorship deal you complete.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h3 className="font-bold text-gray-900 mb-3">How it works:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Get 500+ followers → Starter tier</li>
                <li>• Grow to 1K+ → Standard tier (higher payouts)</li>
                <li>• Reach 5K+ → Professional tier</li>
                <li>• Hit 25K+ → Elite tier</li>
                <li>• Achieve 100K+ → Mega tier (5x payouts!)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerUserPage;
