import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Footer from '@/components/Landing/Footer';

export default function AgencyLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-900/30 to-slate-950">
      {/* HERO */}
      <section className="pt-32 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            <span className="block bg-gradient-to-r from-rose-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Manage Multiple Creators
            </span>
          </h1>
          <p className="text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            White-label platform for agencies. Manage rosters. Negotiate deals. Track ROI.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl font-black mb-2 text-rose-400">∞</div>
              <p className="text-white/80">Unlimited Creators</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl font-black mb-2 text-fuchsia-400">📊</div>
              <p className="text-white/80">Agency Dashboard</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl font-black mb-2 text-pink-400">💰</div>
              <p className="text-white/80">Bulk Payouts</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white px-12 py-4 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
            >
              <Users className="w-5 h-5 inline mr-2" />
              Get Agency Access
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Request Demo
            </button>
          </div>

          <p className="mt-8 text-white/60">Email: agencies@nilbx.com • White-label available</p>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Agency Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: "👥", title: "Creator Management", desc: "Manage unlimited creator rosters with one dashboard" },
              { icon: "💼", title: "Deal Negotiation", desc: "Batch negotiate with brands • Get bulk discounts" },
              { icon: "📈", title: "Performance Tracking", desc: "Real-time analytics on all creator campaigns" },
              { icon: "💳", title: "Unified Payouts", desc: "Single invoice • Pay creators • Manage cash flow" },
              { icon: "🔐", title: "White-Label", desc: "Custom branding • Your domain • Your terms" },
              { icon: "🤝", title: "API Access", desc: "Integrate with your systems • Full API support" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
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
