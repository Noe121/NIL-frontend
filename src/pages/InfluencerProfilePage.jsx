import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import TierBadge from '../components/TierBadge.jsx';
import { toast } from 'react-toastify';
import { MessageCircle, Share2, ExternalLink } from 'lucide-react';

export default function InfluencerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { apiService } = useApi();
  const [influencer, setInfluencer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchInfluencer = async () => {
      setIsLoading(true);
      try {
        // If no ID provided, use demo data for preview
        if (!id) {
          const demoInfluencers = {
            demo: {
              id: 'demo',
              name: 'Alex Johnson',
              influencer_type: 'influencer',
              niche_category: 'fitness',
              follower_count: 25500,
              tier: 'elite',
              bio: 'Professional fitness influencer and wellness coach. Specializing in strength training and nutrition.',
              verified: true,
              social_media: {
                instagram: '@alexjohnson_fitness',
                tiktok: '@alexfitness',
                youtube: 'Alex Fitness Channel'
              },
              profile_image: 'https://via.placeholder.com/200',
              achievements: 'Top 1% fitness influencers | 50+ brand partnerships | Certified trainer',
              is_active: true,
              created_at: '2023-01-15',
              engagement_stats: {
                avg_engagement_rate: '8.5%',
                avg_post_reach: '12,000',
                total_impressions: '2.1M'
              }
            },
            'student-1': {
              id: 'student-1',
              name: 'Maria Rodriguez',
              influencer_type: 'student_athlete',
              niche_category: 'sports',
              follower_count: 8500,
              tier: 'professional',
              bio: 'College soccer player and student-athlete. Passionate about sports and education.',
              sport: 'Soccer',
              university: 'State University',
              verified: false,
              social_media: {
                instagram: '@maria_soccer23',
                twitter: '@MariaAthletics'
              },
              profile_image: 'https://via.placeholder.com/200',
              achievements: 'NCAA All-American | Dean\'s List | Conference MVP',
              is_active: true,
              created_at: '2023-06-20'
            }
          };

          const demoInfluencer = demoInfluencers[id] || demoInfluencers.demo;
          setInfluencer(demoInfluencer);
        } else {
          const data = await apiService.getInfluencer(id);
          setInfluencer(data);
        }
      } catch (err) {
        console.error('Error fetching influencer:', err);
        setError('Failed to load influencer profile');
        toast.error('Could not load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencer();
  }, [id, apiService]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !influencer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/influencers')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Influencers
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && user.id === influencer.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-start gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {influencer.profile_image ? (
                <img
                  src={influencer.profile_image}
                  alt={influencer.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{influencer.name}</h1>
                {influencer.verified && <span className="text-2xl">✓</span>}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <TierBadge tier={influencer.tier} followerCount={influencer.follower_count} />
                <span className="text-lg opacity-90">
                  {influencer.niche_category && `${influencer.niche_category.charAt(0).toUpperCase() + influencer.niche_category.slice(1)}`}
                </span>
              </div>

              {influencer.influencer_type === 'student_athlete' && (
                <div className="mb-4 p-2 bg-blue-500 bg-opacity-20 rounded-lg inline-block">
                  <p className="text-sm">
                    📚 {influencer.university} • ⚽ {influencer.sport}
                  </p>
                </div>
              )}

              <p className="text-lg opacity-90 max-w-2xl">{influencer.bio}</p>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {!isOwnProfile && (
                  <>
                    <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2">
                      <MessageCircle size={20} />
                      Message
                    </button>
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition font-semibold flex items-center gap-2">
                      <Share2 size={20} />
                      Collaborate
                    </button>
                  </>
                )}
                {isOwnProfile && (
                  <button
                    onClick={() => navigate('/influencer-dashboard')}
                    className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['overview', 'stats', 'content', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-semibold transition-colors capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{influencer.bio}</p>
                </div>

                {influencer.social_media && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(influencer.social_media).map(([platform, handle]) => (
                        <a
                          key={platform}
                          href={`https://${platform}.com/${handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center gap-3"
                        >
                          <span className="text-2xl">
                            {platform === 'instagram' && '📷'}
                            {platform === 'twitter' && '𝕏'}
                            {platform === 'tiktok' && '🎵'}
                            {platform === 'youtube' && '📺'}
                          </span>
                          <div>
                            <p className="font-semibold capitalize">{platform}</p>
                            <p className="text-sm text-gray-600">{handle}</p>
                          </div>
                          <ExternalLink size={16} className="text-gray-400 ml-auto" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Followers</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {(influencer.follower_count / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Engagement Rate</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {influencer.engagement_stats?.avg_engagement_rate || 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Tier</p>
                    <p className="text-2xl font-bold text-green-600 capitalize">{influencer.tier}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Achievements</h2>
                <p className="text-gray-700 text-lg">{influencer.achievements || 'No achievements yet'}</p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-bold text-lg">
                    {(influencer.follower_count / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Tier</span>
                  <span className="font-bold capitalize text-blue-600">{influencer.tier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-bold">
                    {new Date(influencer.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-bold ${influencer.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                    {influencer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tier Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-4">💰 Tier Info</h3>
              <div className="space-y-2 text-sm text-blue-900">
                <p>
                  <strong>Current Earnings:</strong> $
                  {influencer.tier === 'starter' && '575'}
                  {influencer.tier === 'standard' && '750'}
                  {influencer.tier === 'professional' && '1,200'}
                  {influencer.tier === 'elite' && '2,500'}
                  {influencer.tier === 'mega' && '5,000'}
                  {' base'}
                </p>
                <p className="opacity-75">
                  Payouts are multiplied by your tier level for deals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
