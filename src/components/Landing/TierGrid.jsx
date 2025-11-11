import { Sparkles, Crown, Flame } from 'lucide-react';

const tiers = [
  {
    name: 'MEGA',
    color: 'from-purple-600 to-purple-400',
    icon: Sparkles,
    followers: '100K+',
    multiplier: '5.0x',
    payout: '$25 per 1K followers',
    fee: '0.5%',
    features: ['Exclusive brand invites', 'Priority support', 'Custom rates', 'Analytics dashboard']
  },
  {
    name: 'ELITE',
    color: 'from-pink-600 to-pink-400',
    icon: Crown,
    followers: '50K–100K',
    multiplier: '2.5x',
    payout: '$12 per 1K followers',
    fee: '2.5%',
    features: ['Brand partnerships', '24/7 support', 'Growth tools', 'Performance tracking'],
    highlighted: true
  },
  {
    name: 'PROFESSIONAL',
    color: 'from-orange-600 to-orange-400',
    icon: Flame,
    followers: '10K–50K',
    multiplier: '1.2x',
    payout: '$5 per 1K followers',
    fee: '5%',
    features: ['Direct brand access', 'Monthly payouts', 'Creator community', 'Training content']
  }
];

export default function TierGrid() {
  return (
    <section className="py-32 bg-gradient-to-br from-slate-900/50 to-blue-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Earn More as You Grow
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our tiered system rewards your growth. Higher followers = higher payouts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <div
                key={index}
                className={`relative group ${tier.highlighted ? 'lg:scale-105' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-2xl blur-xl -z-10"></div>
                )}
                
                <div className={`glass-light rounded-2xl p-8 border ${
                  tier.highlighted
                    ? 'border-pink-500/50 shadow-xl shadow-pink-500/20'
                    : 'border-white/20'
                } backdrop-blur-sm h-full flex flex-col`}>
                  {/* Tier Header */}
                  <div className={`flex items-center gap-3 mb-6`}>
                    <div className={`w-14 h-14 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{tier.name}</h3>
                      {tier.highlighted && (
                        <div className="inline-block mt-1 px-2 py-0.5 bg-pink-500/30 rounded-full text-xs font-bold text-pink-200">
                          MOST POPULAR
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Followers */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="text-sm text-white/60 mb-1">Followers</div>
                    <div className="text-2xl font-black text-white">{tier.followers}</div>
                  </div>

                  {/* Earnings */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="text-sm text-white/60 mb-1">Payout Rate</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                      {tier.payout}
                    </div>
                    <div className="text-sm text-white/80">Platform fee: {tier.fee}</div>
                  </div>

                  {/* Multiplier */}
                  <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="text-sm text-white/60 mb-2">Earnings Multiplier</div>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg">
                      <span className="font-black text-lg text-yellow-300">{tier.multiplier}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white/80 mb-4">Includes:</div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                          <span className="text-green-400 font-bold mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full mt-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                    tier.highlighted
                      ? `bg-gradient-to-r ${tier.color} text-white hover:shadow-lg hover:shadow-pink-500/30`
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                    Join {tier.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Badge */}
        <div className="text-center mt-16">
          <div className="inline-block px-6 py-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
            <p className="text-white font-semibold">🎯 Automatically rank up as your followers grow • No waiting</p>
          </div>
        </div>
      </div>
    </section>
  );
}
