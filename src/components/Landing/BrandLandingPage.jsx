import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Landing/Footer';

export default function BrandLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900/30 to-slate-950">
      {/* HERO */}
      <section className="pt-32 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Find Creators
            </span>
          </h1>
          <p className="text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with 50K+ verified creators. Run campaigns that scale. See ROI instantly.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl font-black mb-2 text-blue-400">50K+</div>
              <p className="text-white/80">Verified Creators</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl font-black mb-2 text-indigo-400">$250M+</div>
              <p className="text-white/80">Creator Payouts</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl font-black mb-2 text-purple-400">500+</div>
              <p className="text-white/80">Active Brands</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
            >
              🚀 Post Your First Campaign
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Learn More
            </button>
          </div>

          <p className="mt-8 text-white/60">Email: brands@nilbx.com • 24/7 Support</p>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">How It Works for Brands</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Campaign", desc: "Set budget, requirements, and audience" },
              { step: "2", title: "Find Creators", desc: "AI matches you with perfect fit" },
              { step: "3", title: "Track ROI", desc: "Real-time analytics & performance" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"
              >
                <div className="text-6xl font-black mb-4 text-blue-400">{item.step}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-lg text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
