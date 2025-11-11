import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FinalCTA() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleForBrands = () => {
    // This could navigate to a brands page or open a modal
    navigate('/brands');
  };

  const benefits = [
    'Instant account setup',
    'First payout in 7 days',
    'No hidden fees',
    '24/7 creator support',
    'Real-time analytics',
    'Withdraw anytime'
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="relative group">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

          <div className="relative rounded-3xl border border-white/30 backdrop-blur-xl bg-slate-900/50 p-12 lg:p-16 text-center">
            {/* Badge */}
            <div className="inline-block mb-6 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
              <p className="text-sm font-bold text-green-300">✨ Join 50,000+ Creators</p>
            </div>

            {/* Main Headline */}
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Get Paid to Post
            </h2>

            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-slate-300 mb-8 leading-relaxed">
              Join creators earning <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text font-black">$100K+</span> annually on NILBx
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-12 pb-12 border-b border-white/20">
              <div>
                <div className="text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                  95%
                </div>
                <p className="text-sm text-white/70">You Keep</p>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                  $4.2M+
                </div>
                <p className="text-sm text-white/70">Monthly Payouts</p>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                  7 Days
                </div>
                <p className="text-sm text-white/70">First Payment</p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 justify-start md:justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/90 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="group/btn px-8 lg:px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/50 hover:scale-105 flex items-center justify-center gap-2"
              >
                💰 Start Earning Now
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleForBrands}
                className="px-8 lg:px-12 py-4 border border-white/40 text-white font-bold rounded-xl text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/60"
              >
                For Brands & Partners
              </button>
            </div>

            {/* Security Note */}
            <p className="mt-8 text-sm text-white/60">
              🔒 100% secure • No credit card required • Instant setup
            </p>
          </div>
        </div>

        {/* Bottom Trust Section */}
        <div className="mt-16 text-center">
          <p className="text-white/70 text-sm mb-6 uppercase tracking-wider font-semibold">
            Trusted by
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-white font-bold">5.0</span>
              <span className="text-white/70 text-sm">Creator Rating</span>
            </div>
            <div className="hidden sm:block w-1 h-6 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="text-white font-bold">150+ Countries</span>
            </div>
            <div className="hidden sm:block w-1 h-6 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="text-white font-bold">100% Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
