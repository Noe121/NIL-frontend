import { Button } from '@/components/ui/button';

const athletes = [
  { name: "Alex Johnson", sport: "Basketball", rating: 4.9, followers: 25510, sponsors: 1, color: "from-blue-500 to-indigo-600", sportIcon: "🏀" },
  { name: "Maria Rodriguez", sport: "Soccer", rating: 4.9, followers: 24827, sponsors: 2, color: "from-emerald-500 to-teal-600", sportIcon: "⚽" },
  { name: "James Chen", sport: "Track & Field", rating: 4.9, followers: 46750, sponsors: 5, color: "from-orange-500 to-red-500", sportIcon: "🏃‍♂️" },
  { name: "Sarah Williams", sport: "Volleyball", rating: 4.9, followers: 11396, sponsors: 1, color: "from-purple-500 to-pink-600", sportIcon: "🏐" },
  { name: "Marcus Thompson", sport: "Football", rating: 4.9, followers: 53539, sponsors: 10, color: "from-red-500 to-rose-600", sportIcon: "🏈" },
  { name: "Emma Davis", sport: "Swimming", rating: 4.9, followers: 44430, sponsors: 5, color: "from-cyan-500 to-blue-600", sportIcon: "🏊‍♀️" },
];

const AthletesGrid = () => (
  <section className="relative py-32 bg-gradient-to-br from-slate-900/30 to-blue-900/20">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_0%,hsl(var(--blue-500)/0.1),transparent)]"></div>
    <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full border border-blue-500/30 text-4xl lg:text-5xl font-bold text-white mb-6">
          🏆 Meet Top Performing Athletes
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Discover student-athletes who are successfully building their personal brands
          and connecting with <span className="font-semibold text-blue-400">top sponsors</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {athletes.map((athlete, index) => (
          <div
            key={athlete.name}
            className="group relative glass-light rounded-2xl p-8 border border-white/20 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
          >
            {/* Sport Badge */}
            <div className={`absolute -top-4 -right-4 w-20 h-20 ${athlete.color} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
              {athlete.sportIcon}
            </div>

            {/* Stats Ring */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full border-4 border-blue-500/30"></div>

            <div className="relative z-10">
              {/* Rating */}
              <div className="flex items-center justify-center mb-6 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full px-4 py-2 border border-blue-500/30">
                <span className="text-blue-300 font-bold text-lg">⭐ {athlete.rating}</span>
              </div>

              <h3 className="text-2xl font-bold text-center text-white group-hover:text-blue-300 transition-colors mb-4">
                {athlete.name}
              </h3>
              <p className="text-center text-sm font-semibold text-slate-300 capitalize mb-8 bg-blue-500/10 rounded-lg px-4 py-2">
                {athlete.sport} Athlete
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="group-hover:scale-105 transition-transform duration-300 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-400/30">
                  <div className="text-2xl font-mono font-bold text-blue-300 mb-2">
                    {athlete.followers.toLocaleString()}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Followers</div>
                </div>
                <div className="group-hover:scale-105 transition-transform duration-300 p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30">
                  <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${athlete.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {athlete.sponsors}
                  </div>
                  <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Sponsors</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-6 font-semibold border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:text-white"
                >
                  👁️ View Profile
                </Button>
                <Button
                  size="sm"
                  className={`px-6 font-semibold bg-gradient-to-r ${athlete.color} text-white hover:shadow-lg hover:shadow-blue-500/30`}
                >
                  💰 Sponsor
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AthletesGrid;