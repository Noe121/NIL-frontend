import { Button } from '@/components/ui/button';

const SportsStatsCTA = () => (
  <section className="py-20 bg-gradient-to-br from-slate-900/30 to-blue-900/20">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="lg:col-span-1">
          <h2 className="text-4xl lg:text-5xl font-black text-center lg:text-left text-white mb-8 leading-tight">
            <span className="block text-3xl lg:text-4xl text-blue-300 font-normal">Join</span>
            <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              2,500+ Student-Athletes
            </span>
            <span className="block text-3xl lg:text-4xl text-blue-300 font-normal">Securing Premium Deals</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {[
            { num: "2.5K+", label: "Student-Athletes", icon: "🌟" },
            { num: "$500M+", label: "Total Deal Value", icon: "💰" },
            { num: "1K+", label: "Premium Brands", icon: "🏢" }
          ].map((stat, i) => (
            <div key={i} className="group text-center p-6 rounded-xl glass-light border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4">{stat.icon}</div>
              <div className="text-2xl font-black text-white group-hover:text-blue-300">{stat.num}</div>
              <div className="text-sm font-semibold text-blue-200 mt-2">{stat.label}</div>
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
              🎯 Become a Student-Athlete
            </span>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-2 border-blue-300/50 bg-white/10 backdrop-blur-sm text-blue-300 font-bold hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-500 hover:shadow-xl"
          >
            <span className="flex items-center justify-center">
              🤝 I'm a Brand
            </span>
          </Button>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-16 grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="glass rounded-xl p-6 border border-blue-300/20">
          <h3 className="font-bold text-white text-lg mb-2">Why NILbx for Student-Athletes?</h3>
          <ul className="text-sm text-blue-200 space-y-2">
            <li>✓ Compliance-first platform</li>
            <li>✓ Premium brand access</li>
            <li>✓ Deal management tools</li>
            <li>✓ 24/7 support team</li>
          </ul>
        </div>
        <div className="glass rounded-xl p-6 border border-blue-300/20">
          <h3 className="font-bold text-white text-lg mb-2">Average Student-Athlete Earnings</h3>
          <ul className="text-sm text-blue-200 space-y-2">
            <li>🏀 Basketball: $200K-$500K</li>
            <li>🏈 Football: $250K-$600K</li>
            <li>⚽ Soccer: $150K-$400K</li>
            <li>🎾 Other Sports: $100K-$300K</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default SportsStatsCTA;
