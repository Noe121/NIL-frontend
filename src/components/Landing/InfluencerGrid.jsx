import { Star, Users, MessageCircle } from 'lucide-react';

const influencers = [
  {
    id: 1,
    name: 'Alex Chen',
    niche: 'gaming',
    avatar: '👾',
    followers: '2.5M',
    rating: 4.9,
    tier: 'MEGA',
    color: 'from-purple-600/20 to-purple-700/20'
  },
  {
    id: 2,
    name: 'Emma Watson',
    niche: 'beauty',
    avatar: '💄',
    followers: '1.8M',
    rating: 4.8,
    tier: 'MEGA',
    color: 'from-pink-600/20 to-pink-700/20'
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    niche: 'fitness',
    avatar: '💪',
    followers: '850K',
    rating: 4.7,
    tier: 'ELITE',
    color: 'from-red-600/20 to-red-700/20'
  },
  {
    id: 4,
    name: 'Sophie Laurent',
    niche: 'travel',
    avatar: '✈️',
    followers: '1.2M',
    rating: 4.9,
    tier: 'MEGA',
    color: 'from-blue-600/20 to-blue-700/20'
  },
  {
    id: 5,
    name: 'Ryan Tech',
    niche: 'tech',
    avatar: '💻',
    followers: '650K',
    rating: 4.6,
    tier: 'ELITE',
    color: 'from-cyan-600/20 to-cyan-700/20'
  },
  {
    id: 6,
    name: 'Jessica Style',
    niche: 'fashion',
    avatar: '👗',
    followers: '920K',
    rating: 4.8,
    tier: 'ELITE',
    color: 'from-yellow-600/20 to-yellow-700/20'
  },
  {
    id: 7,
    name: 'Chef Marco',
    niche: 'food',
    avatar: '🍜',
    followers: '580K',
    rating: 4.7,
    tier: 'PROFESSIONAL',
    color: 'from-orange-600/20 to-orange-700/20'
  },
  {
    id: 8,
    name: 'Luna Gamer',
    niche: 'gaming',
    avatar: '🎮',
    followers: '1.1M',
    rating: 4.9,
    tier: 'MEGA',
    color: 'from-purple-600/20 to-purple-700/20'
  },
  {
    id: 9,
    name: 'Aria Beauty',
    niche: 'beauty',
    avatar: '✨',
    followers: '750K',
    rating: 4.8,
    tier: 'ELITE',
    color: 'from-pink-600/20 to-pink-700/20'
  }
];

const tierColors = {
  MEGA: 'from-purple-600 to-purple-400',
  ELITE: 'from-pink-600 to-pink-400',
  PROFESSIONAL: 'from-orange-600 to-orange-400'
};

export default function InfluencerGrid({ filters = [] }) {
  // Filter influencers based on active niche filters
  const filteredInfluencers = filters.length === 0
    ? influencers
    : influencers.filter(inf => filters.includes(inf.niche));

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/30 to-slate-900/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Top Creators Ready to Collaborate
          </h2>
          <p className="text-lg text-blue-200">
            {filteredInfluencers.length} creator{filteredInfluencers.length !== 1 ? 's' : ''} available
            {filters.length > 0 && ` in selected niches`}
          </p>
        </div>

        {filteredInfluencers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/60 text-lg">No creators found in selected niches. Try different filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <div
                key={influencer.id}
                className={`group relative rounded-2xl overflow-hidden border border-white/20 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:shadow-lg`}
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                {/* Background gradient based on niche */}
                <div className={`absolute inset-0 bg-gradient-to-br ${influencer.color} -z-10`}></div>

                <div className="p-6 flex flex-col h-full">
                  {/* Tier Badge */}
                  <div className={`self-start mb-4`}>
                    <div className={`bg-gradient-to-r ${tierColors[influencer.tier]} px-3 py-1 rounded-full text-xs font-black text-white shadow-lg`}>
                      {influencer.tier}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="mb-4">
                    <div className="text-6xl mb-3">{influencer.avatar}</div>
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-bold text-white mb-1">{influencer.name}</h3>
                  <p className="text-sm text-white/70 capitalize mb-4">{influencer.niche} Creator</p>

                  {/* Stats */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-white/20">
                    <div className="flex items-center gap-2 text-white/90">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-semibold">{influencer.followers} followers</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            fill={i < Math.floor(influencer.rating) ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{influencer.rating} rating</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group-hover:scale-105 flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Collaborate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Browse More CTA */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300">
            Browse All {influencers.length} Creators
          </button>
        </div>
      </div>
    </section>
  );
}
