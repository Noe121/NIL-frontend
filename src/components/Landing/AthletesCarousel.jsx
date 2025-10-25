import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, DollarSign } from 'lucide-react';

const athletes = [
  { name: "Alex Johnson", sport: "🏀 Basketball", followers: "125.5K", earnings: "$85K" },
  { name: "Marcus Thompson", sport: "🏈 Football", followers: "453.5K", earnings: "$320K" },
  { name: "James Chen", sport: "🏃 Track", followers: "246.7K", earnings: "$180K" },
  { name: "Maria Rodriguez", sport: "⚽ Soccer", followers: "324.8K", earnings: "$215K" },
];

export default function AthletesCarousel() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900/30 to-blue-900/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="inline-block px-8 py-4 glass rounded-full text-3xl lg:text-4xl font-black text-white shadow-glow">
            ⚡ Top Sports Influencers
          </h2>
        </div>

        <div className="relative">
          <div className="flex gap-8 overflow-x-auto pb-12 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory">
            {athletes.map((athlete, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full sm:w-96 glass rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 snap-center"
              >
                {/* Sport badge */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg">
                  {athlete.sport.split(' ')[0]}
                </div>

                                {/* Name */}
                <h3 className="text-2xl font-black text-center text-white mb-6">
                  {athlete.name}
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50/20 to-indigo-50/20 border border-blue-200/30">
                    <div className="text-3xl font-mono font-black text-blue-300 mb-2">
                      {athlete.followers}
                    </div>
                    <div className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
                      Followers
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50/20 to-teal-50/20 border border-emerald-200/30">
                    <div className="text-2xl font-mono font-black text-emerald-300 mb-2">
                      {athlete.earnings}
                    </div>
                    <div className="text-sm font-semibold text-emerald-200 uppercase tracking-wide">
                      Annual Earnings
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" size="sm" className="px-6 h-12 font-semibold border-blue-300/50 text-blue-300 hover:bg-blue-500/20">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button size="sm" className="px-6 h-12 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Collaborate
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile scroll hint */}
          <div className="flex justify-center items-center mt-12 sm:hidden">
            <span className="text-sm font-medium text-blue-300 mr-6">👆 Swipe to see more</span>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}