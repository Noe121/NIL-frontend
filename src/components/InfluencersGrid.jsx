import React from 'react';
import { Button } from '@/components/ui/button';
import TierBadge from './TierBadge';

const influencers = [
  { id: 1, name: "Alex Johnson", niche: "Fitness", tier: "elite", followers: 25510, bio: "Professional fitness coach", rating: 4.9, color: "from-blue-500 to-indigo-600", icon: "🏋️" },
  { id: 2, name: "Maria Rodriguez", niche: "Wellness", tier: "elite", followers: 24827, bio: "Yoga and meditation expert", rating: 4.9, color: "from-emerald-500 to-teal-600", icon: "🧘" },
  { id: 3, name: "James Chen", niche: "Photography", tier: "mega", followers: 46750, bio: "Travel and lifestyle photography", rating: 4.9, color: "from-orange-500 to-red-500", icon: "📸" },
  { id: 4, name: "Marcus Thompson", niche: "Gaming", tier: "mega", followers: 53500, bio: "Gaming and esports creator", rating: 4.9, color: "from-purple-500 to-pink-500", icon: "🎮" },
  { id: 5, name: "Lisa Park", niche: "Beauty", tier: "professional", followers: 12300, bio: "Makeup and skincare tutorials", rating: 4.8, color: "from-pink-500 to-rose-500", icon: "💄" },
  { id: 6, name: "David Kim", niche: "Cooking", tier: "professional", followers: 8900, bio: "Culinary content creator", rating: 4.7, color: "from-yellow-500 to-orange-500", icon: "🍳" },
  { id: 7, name: "Sarah Williams", niche: "Fashion", tier: "professional", followers: 15600, bio: "Fashion and lifestyle trends", rating: 4.8, color: "from-pink-400 to-rose-500", icon: "👗" },
  { id: 8, name: "John Davis", niche: "Tech", tier: "standard", followers: 3200, bio: "Technology reviews and tips", rating: 4.6, color: "from-blue-600 to-cyan-500", icon: "💻" },
  { id: 9, name: "Emma Wilson", niche: "Travel", tier: "professional", followers: 18750, bio: "Adventure and travel content", rating: 4.9, color: "from-green-500 to-emerald-600", icon: "✈️" },
];

export default function InfluencersGrid({ onInfluencerClick }) {
  const [filterTier, setFilterTier] = React.useState('all');
  const [filterNiche, setFilterNiche] = React.useState('all');

  const tiers = ['all', 'starter', 'standard', 'professional', 'elite', 'mega'];
  const niches = ['all', 'fitness', 'gaming', 'photography', 'beauty', 'cooking', 'fashion', 'tech', 'travel'];

  const filtered = influencers.filter((inf) => {
    const tierMatch = filterTier === 'all' || inf.tier === filterTier;
    const nicheMatch = filterNiche === 'all' || inf.niche.toLowerCase() === filterNiche.toLowerCase();
    return tierMatch && nicheMatch;
  });

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">🌟 Discover Influencers</h2>
          <p className="text-xl text-gray-600">Connect with top creators in your favorite niches</p>
        </div>

        {/* Filters */}
        <div className="mb-10 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tier Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Tier</label>
              <div className="flex flex-wrap gap-2">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      filterTier === tier
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Niche Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Niche</label>
              <div className="flex flex-wrap gap-2">
                {niches.slice(0, 5).map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setFilterNiche(niche)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      filterNiche === niche
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {niche.charAt(0).toUpperCase() + niche.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results info */}
        <div className="mb-6 text-sm text-gray-600">
          Showing {filtered.length} of {influencers.length} influencers
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((influencer) => (
              <div
                key={influencer.id}
                className="group bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                onClick={() => onInfluencerClick?.(influencer.id)}
              >
                {/* Header Background */}
                <div className={`h-32 bg-gradient-to-br ${influencer.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                    <div className="absolute inset-0 bg-pattern" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <TierBadge tier={influencer.tier} followerCount={0} showFollowers={false} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Avatar */}
                  <div className="relative -mt-16 mb-4 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl bg-gradient-to-br from-gray-200 to-gray-300">
                      {influencer.icon}
                    </div>
                  </div>

                  {/* Name and info */}
                  <h3 className="text-center text-xl font-bold text-gray-900 mb-1">{influencer.name}</h3>
                  <p className="text-center text-sm text-blue-600 font-semibold mb-2">{influencer.niche}</p>
                  <p className="text-center text-sm text-gray-600 mb-4 h-10 line-clamp-2">{influencer.bio}</p>

                  {/* Stats */}
                  <div className="flex justify-around text-center py-4 border-y border-gray-200 mb-4">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {(influencer.followers / 1000).toFixed(1)}K
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Followers</p>
                    </div>
                    <div className="border-l border-gray-300" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-500">{influencer.rating}★</p>
                      <p className="text-xs text-gray-600 mt-1">Rating</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No influencers found matching your filters</p>
            <button
              onClick={() => {
                setFilterTier('all');
                setFilterNiche('all');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
