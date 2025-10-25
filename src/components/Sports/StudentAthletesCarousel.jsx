import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, Award, TrendingUp, Briefcase } from 'lucide-react';

const studentAthletes = [
  {
    name: "Alex Johnson",
    sport: "🏀 Basketball",
    school: "Duke University",
    followers: "125.5K",
    activeDeals: 8,
    dealValue: "$285K",
    compliance: "100%"
  },
  {
    name: "Marcus Thompson",
    sport: "🏈 Football",
    school: "Ohio State",
    followers: "453.5K",
    activeDeals: 12,
    dealValue: "$520K",
    compliance: "100%"
  },
  {
    name: "James Chen",
    sport: "🏃 Track",
    school: "Stanford",
    followers: "246.7K",
    activeDeals: 6,
    dealValue: "$180K",
    compliance: "99%"
  },
  {
    name: "Maria Rodriguez",
    sport: "⚽ Soccer",
    school: "University of Texas",
    followers: "324.8K",
    activeDeals: 10,
    dealValue: "$415K",
    compliance: "100%"
  },
  {
    name: "Tyler Davis",
    sport: "🎾 Tennis",
    school: "USC",
    followers: "198.3K",
    activeDeals: 7,
    dealValue: "$295K",
    compliance: "100%"
  },
  {
    name: "Sophia Martinez",
    sport: "🏊 Swimming",
    school: "University of Florida",
    followers: "156.2K",
    activeDeals: 5,
    dealValue: "$125K",
    compliance: "98%"
  }
];

export default function StudentAthletesCarousel({ onAthleteClick }) {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900/30 to-blue-900/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="inline-block px-8 py-4 glass rounded-full text-3xl lg:text-4xl font-black text-white shadow-glow">
            🌟 Elite Student-Athletes
          </h2>
          <p className="text-blue-200 text-lg mt-6 max-w-2xl mx-auto">
            Top performing student-athletes managing multiple premium sponsorship deals with full compliance
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-8 overflow-x-auto pb-12 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory">
            {studentAthletes.map((athlete, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full sm:w-96 glass rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 snap-center border border-white/20 hover:border-blue-400/50"
              >
                {/* Sport badge */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg">
                  {athlete.sport.split(' ')[0]}
                </div>

                {/* Name */}
                <h3 className="text-2xl font-black text-center text-white mb-2">
                  {athlete.name}
                </h3>

                {/* School */}
                <p className="text-center text-sm text-blue-300 font-semibold mb-6">
                  {athlete.school}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50/20 to-indigo-50/20 border border-blue-200/30">
                    <div className="text-2xl font-mono font-black text-blue-300 mb-1">
                      {athlete.followers}
                    </div>
                    <div className="text-xs font-semibold text-blue-200 uppercase tracking-wide">
                      Followers
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50/20 to-teal-50/20 border border-emerald-200/30">
                    <div className="flex items-center justify-center mb-1">
                      <Briefcase className="w-4 h-4 text-emerald-300 mr-1" />
                      <span className="text-2xl font-mono font-black text-emerald-300">
                        {athlete.activeDeals}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                      Active Deals
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50/20 to-amber-50/20 border border-yellow-200/30">
                    <div className="text-2xl font-mono font-black text-yellow-300 mb-1">
                      {athlete.dealValue}
                    </div>
                    <div className="text-xs font-semibold text-yellow-200 uppercase tracking-wide">
                      Deal Value
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-50/20 to-purple-50/20 border border-violet-200/30">
                    <div className="flex items-center justify-center mb-1">
                      <Award className="w-4 h-4 text-violet-300 mr-1" />
                      <span className="text-2xl font-mono font-black text-violet-300">
                        {athlete.compliance}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-violet-200 uppercase tracking-wide">
                      Compliance
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAthleteClick(athlete.name)}
                    className="px-4 h-10 font-semibold border-blue-300/50 text-blue-300 hover:bg-blue-500/20 flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    size="sm"
                    className="px-4 h-10 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-1"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Deals
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
