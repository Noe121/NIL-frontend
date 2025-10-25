import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InfluencerHero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 text-white overflow-hidden px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-80 h-80 bg-purple-500/20 rounded-full animate-bounce [animation-delay:1s]"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-orange-500/10 rounded-full animate-ping [animation-delay:2s]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center px-6 py-3 glass rounded-full text-sm font-bold shadow-glow mb-8 animate-pulse backdrop-blur-sm border border-white/20">
          <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 animate-ping"></span>
          Trusted by 50K+ Creators 🚀
        </div>

        {/* Main headline */}
        <div className="inline-flex flex-col items-center mb-12">
          <h1 className="text-6xl lg:text-8xl font-black leading-none mb-6">
            <span className="block bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl">
              Monetize Your Voice
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <p className="text-2xl lg:text-3xl font-bold text-white/95 max-w-3xl mx-auto mb-8 px-6 leading-relaxed">
          Get paid by <span className="font-black text-pink-300">500+ brands</span> • Keep <span className="font-black text-pink-300">95%</span> • No sports required
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 px-4">
          <div className="glass rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-black text-pink-300">50K+</div>
            <div className="text-sm text-white/80">Active Creators</div>
          </div>
          <div className="glass rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-black text-purple-300">$250M+</div>
            <div className="text-sm text-white/80">Paid Out</div>
          </div>
          <div className="glass rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-black text-orange-300">5.0★</div>
            <div className="text-sm text-white/80">Creator Rating</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-3xl mx-auto">
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            className="group bg-gradient-to-r from-pink-600 to-orange-600 text-white font-black text-lg px-12 py-4 shadow-glow hover:shadow-[0_20px_40px_-10px_rgba(236,72,153,0.4)] transform hover:-translate-y-1 transition-all duration-300 h-16 w-full sm:w-auto"
          >
            <span className="flex items-center justify-center">
              💰 Get Paid to Post
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white/30 glass text-white font-bold text-lg px-12 py-4 h-16 w-full sm:w-auto backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo (90s)
          </Button>
        </div>

        {/* Bonus text */}
        <div className="mt-16 text-white/80 text-sm font-semibold">
          ✨ No application fees • Instant payouts • 24/7 support
        </div>
      </div>
    </section>
  );
}
