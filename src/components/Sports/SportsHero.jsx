import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SportsHero() {
  const [businessSectionExpanded, setBusinessSectionExpanded] = useState(false);
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero text-white overflow-hidden px-4">
      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-80 h-80 bg-indigo-500/20 rounded-full animate-bounce [animation-delay:1s]"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-violet-500/10 rounded-full animate-ping [animation-delay:2s]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center px-6 py-3 glass rounded-full text-sm font-bold shadow-glow mb-8 animate-pulse">
          <Award className="w-4 h-4 mr-3 text-yellow-400" />
          NCAA • NAIA • All College Athletes 🏆
        </div>

        {/* Main headline */}
        <div className="inline-flex flex-col items-center mb-12">
          <div className="w-32 h-32 glass rounded-full flex items-center justify-center shadow-glow mb-8 backdrop-blur-sm">
            <span className="text-5xl font-black text-blue-400">⚡</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black leading-none mb-6">
            <span className="block text-gradient drop-shadow-2xl">Student Athletes</span>
          </h1>
          <p className="text-3xl lg:text-4xl font-bold text-white/90">
            Turn Your Talent Into <span className="text-gradient text-4xl lg:text-5xl">Real Deals</span>
          </p>
        </div>

        {/* Subheadline */}
        <p className="text-xl lg:text-2xl font-semibold text-blue-100/90 max-w-4xl mx-auto mb-12 px-6 leading-relaxed">
          Land lucrative sponsorship deals • Access <span className="font-black text-blue-300">1000+</span> premium brands •
          Earn <span className="font-black text-blue-300">$500K+</span> during your college years
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-3xl mx-auto">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg px-12 py-4 shadow-glow hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)] transform hover:-translate-y-1 transition-all duration-300 h-16 w-full sm:w-auto"
            onClick={() => navigate('/premium-deals')}
          >
            <span className="flex items-center justify-center">
              🎯 Unlock Premium Deals
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white/30 glass text-white font-bold text-lg px-12 py-4 h-16 w-full sm:w-auto backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            onClick={() => navigate('/learn-more')}
          >
            <Play className="w-5 h-5 mr-2" />
            Learn More (2 min)
          </Button>
        </div>

        {/* Info badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-black text-blue-300">24/7</div>
            <div className="text-sm text-slate-300">Deal Support</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-black text-emerald-300">100%</div>
            <div className="text-sm text-emerald-200">Compliance Safe</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-black text-yellow-300">0% → 9%</div>
            <div className="text-sm text-yellow-200">Platform Fee</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-black text-violet-300">98%</div>
            <div className="text-sm text-violet-200">Success Rate</div>
          </div>
        </div>

        {/* NILBx athlete Pricing – Final Fine Print */}
        <div className="text-center text-sm text-blue-300/80 mt-8 max-w-3xl mx-auto font-semibold">
          <div className="mb-4">
            <strong className="text-white text-base">NILBx athlete Pricing – Final Fine Print (Revenue-Focused, Athlete-Approved)</strong>
          </div>
          <div className="space-y-2 text-left">
            <div>
              <strong className="text-white">Year 1: 0% platform fee</strong><br />
              <span className="text-blue-200">You keep 100% of every deal — we make $0 so you can land your first partnerships fast.</span>
            </div>
            <div>
              <strong className="text-white">Starting Year 2: 9% platform fee</strong><br />
              <span className="text-blue-200">That's 40–70% less than competing NIL platforms (15–30%).</span>
            </div>
            <div>
              <button
                onClick={() => setBusinessSectionExpanded(!businessSectionExpanded)}
                className="flex items-center justify-center w-full text-white hover:text-blue-200 transition-colors duration-200 group"
              >
                <strong className="text-white text-base group-hover:text-blue-200 transition-colors duration-200">
                  How we stay in business & keep growing:
                </strong>
                {businessSectionExpanded ? (
                  <ChevronUp className="w-4 h-4 ml-2 text-blue-200" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2 text-blue-200" />
                )}
              </button>
              {businessSectionExpanded && (
                <ul className="text-blue-200 ml-4 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  <li>• Brands pay us a small service add-on (built into their quote) for premium tools:</li>
                  <li className="ml-4">– Instant NCAA disclosure filing</li>
                  <li className="ml-4">– Real-time compliance reports</li>
                  <li className="ml-4">– Tax-ready 1099s</li>
                  <li className="ml-4">– Dedicated deal manager</li>
                  <li>• These optional add-ons fund our infrastructure, marketing, and 24/7 support — at no cost to you.</li>
                </ul>
              )}
            </div>
            <div>
              <strong className="text-white">Your payout is always guaranteed</strong><br />
              <span className="text-blue-200">Brands pay into secure escrow. You get paid within 24 hours of deal approval — never delayed, never deducted.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
