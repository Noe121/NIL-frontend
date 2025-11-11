import { Button } from '@/components/ui/button';

const StatsCTA = () => (
  <section className="py-20 bg-gradient-to-br from-slate-900/30 to-blue-900/20">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="lg:col-span-1">
          <h2 className="text-4xl lg:text-5xl font-black text-center lg:text-left text-white mb-8 leading-tight">
            <span className="block text-3xl lg:text-4xl text-blue-300 font-normal">Join</span>
            <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              50K+ Influencers
            </span>
            <span className="block text-3xl lg:text-4xl text-blue-300 font-normal">Making an Impact</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {[
            { num: "50K+", label: "Influencers", icon: "⭐" },
            { num: "$250M+", label: "Total Earnings", icon: "💰" },
            { num: "5K+", label: "Active Brands", icon: "�" }
          ].map((stat, i) => (
            <div key={i} className="group text-center p-6 rounded-xl glass-light border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4">{stat.icon}</div>
              <div className="text-2xl font-black text-white group-hover:text-blue-300">{stat.num}</div>
              <div className="text-sm font-semibold text-slate-300 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual CTA */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row gap-6 glass-light rounded-2xl p-8 border border-white/20 shadow-xl">
          <Button
            size="xl"
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500 hover:from-blue-700 hover:to-indigo-700 border border-blue-500/30"
          >
            <span className="flex items-center justify-center">
              💡 Become an Influencer
            </span>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-2 border-blue-300/50 bg-white/10 backdrop-blur-sm text-blue-300 font-bold hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-500 hover:shadow-xl"
          >
            <span className="flex items-center justify-center">
              🤝 For Brands & Partners
            </span>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default StatsCTA;