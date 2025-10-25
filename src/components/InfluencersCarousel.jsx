import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TierBadge from './TierBadge';

const influencers = [
  { id: 1, name: "Alex Johnson", niche: "🏋️ Fitness", followers: "25.5K", tier: "elite", bio: "Professional fitness coach" },
  { id: 2, name: "Marcus Thompson", niche: "🎮 Gaming", followers: "53.5K", tier: "mega", bio: "Gaming and esports" },
  { id: 3, name: "James Chen", niche: "📸 Photography", followers: "46.7K", tier: "mega", bio: "Travel and lifestyle" },
  { id: 4, name: "Maria Rodriguez", niche: "🧘 Wellness", followers: "24.8K", tier: "elite", bio: "Yoga and meditation" },
  { id: 5, name: "Lisa Park", niche: "💄 Beauty", followers: "12.3K", tier: "professional", bio: "Makeup and skincare" },
  { id: 6, name: "David Kim", niche: "🍳 Cooking", followers: "8.9K", tier: "professional", bio: "Culinary content creator" },
];

export default function InfluencersCarousel() {
  const [startIndex, setStartIndex] = React.useState(0);
  const itemsPerView = 3;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % influencers.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + influencers.length) % influencers.length);
  };

  const visibleInfluencers = [];
  for (let i = 0; i < itemsPerView; i++) {
    visibleInfluencers.push(influencers[(startIndex + i) % influencers.length]);
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🌟 Featured Influencers</h2>
            <p className="text-gray-600">Discover top content creators on our platform</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleInfluencers.map((influencer) => (
            <div
              key={influencer.id}
              className="group bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
            >
              {/* Background gradient */}
              <div className={`h-24 bg-gradient-to-r ${
                influencer.tier === 'mega' ? 'from-red-500 to-pink-500' :
                influencer.tier === 'elite' ? 'from-purple-500 to-pink-500' :
                'from-blue-500 to-cyan-500'
              }`} />

              {/* Content */}
              <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="flex justify-center -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl">
                    {influencer.name.charAt(0)}
                  </div>
                </div>

                {/* Name and tier */}
                <div className="text-center mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{influencer.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{influencer.niche}</p>
                  <TierBadge tier={influencer.tier} followerCount={parseInt(influencer.followers)} showFollowers={true} />
                </div>

                <p className="text-sm text-gray-600 text-center mb-4">{influencer.bio}</p>

                {/* Stats */}
                <div className="flex justify-around text-center py-3 border-t border-gray-100 mb-4">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{influencer.followers}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div className="border-l border-gray-200" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">4.8★</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>

                {/* Action button */}
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 font-bold">
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
