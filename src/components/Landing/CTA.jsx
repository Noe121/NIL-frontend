import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => (
  <section className="relative py-32 overflow-hidden">
    <div className="absolute inset-0 gradient-energy"></div>
    <div className="absolute inset-0 bg-black/40"></div>

    <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
            <span className="block text-4xl lg:text-5xl text-yellow-300/90 drop-shadow-lg">
              Ready to Start Your
            </span>
            <span className="block bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-2xl">
              NIL Journey? 🚀
            </span>
          </h2>
          <p className="text-xl text-blue-100/90 font-semibold mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Join <span className="text-yellow-300 font-black">10K+ athletes</span> already building
            their personal brands and connecting with sponsors.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <Button
              size="xl"
              className="group w-full sm:w-auto bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-gray-900 font-black shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 border-2 border-amber-400/30"
            >
              <span className="flex items-center justify-center">
                🏃 Join as Athlete
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-3 transition-transform duration-500 group-hover:scale-110" />
              </span>
            </Button>
            <Button
              variant="glass"
              size="xl"
              className="w-full sm:w-auto border-2 border-white/40 bg-white/15 backdrop-blur-lg text-white font-bold hover:bg-white/25 hover:border-white/60 transition-all duration-500 hover:shadow-2xl"
            >
              <span className="flex items-center justify-center">
                🔍 Explore Opportunities
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-3 transition-transform duration-500 group-hover:scale-110" />
              </span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 lg:mt-0">
          {[
            { icon: "👥", number: "10K+", label: "Active Athletes", color: "from-blue-500/20 to-indigo-500/20" },
            { icon: "💰", number: "$5M+", label: "Total Deals", color: "from-emerald-500/20 to-teal-500/20" },
            { icon: "🏆", number: "500+", label: "University Partners", color: "from-yellow-500/20 to-amber-500/20" }
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-center hover:scale-105 transition-all duration-500"
            >
              <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-black text-white mb-4 group-hover:text-yellow-300 transition-colors">
                {stat.number}
              </div>
              <div className="text-white/90 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CTA;