import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Footer from '@/components/Landing/Footer';

export default function FanLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-900/30 to-slate-950">
      {/* HERO */}
      <section className="pt-32 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Support Your Favorites
            </span>
          </h1>
          <p className="text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect directly with athletes & creators. Exclusive content. Early access. VIP perks.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-white/80 font-semibold">Direct Access</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl mb-2">🎁</div>
              <p className="text-white/80 font-semibold">Exclusive Perks</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-white/80 font-semibold">Early Content</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-4 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Follow Your Heroes
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Browse Creators
            </button>
          </div>

          <p className="mt-8 text-white/60">Join 100K+ fans supporting their favorites</p>
        </motion.div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Fan Membership Benefits</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: "📸", title: "Exclusive Content", desc: "Behind-the-scenes photos & videos" },
              { icon: "💬", title: "Direct Messages", desc: "Chat with creators you follow" },
              { icon: "🎟️", title: "Early Tickets", desc: "First access to events & merchandise" },
              { icon: "🏆", title: "Fan Events", desc: "Monthly meet-ups & celebrations" }
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
