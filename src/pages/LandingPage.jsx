import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Testimonials from '@/components/Landing/Testimonials';
import Footer from '@/components/Landing/Footer';

const PathButton = ({ icon, title, subtitle, href, color }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(href)}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-6 rounded-2xl backdrop-blur-sm border border-white/20 hover:border-white/50 transition-all duration-300 group overflow-hidden`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/70 mb-4">{subtitle}</p>
        <div className="flex items-center justify-center gap-2 text-white/80 group-hover:text-white transition-colors">
          <span className="text-xs font-semibold">EXPLORE</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.button>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/30 to-slate-950">
      {/* HERO: CHOOSE YOUR PATH */}
      <section className="pt-24 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6">
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                NILBx
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-4 leading-relaxed font-semibold">
              Monetize your influence.
            </p>
            <p className="text-xl text-white/75 max-w-3xl mx-auto">
              Connect with 500+ brands. Earn $100K+ annually. Choose your path below.
            </p>
          </motion.div>

          {/* 5 PATH BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto mb-12"
          >
            <PathButton
              icon="🏆"
              title="Student Athlete"
              subtitle="NIL deals • NCAA compliant"
              href="/sports"
              color="from-orange-500 to-red-500"
            />
            <PathButton
              icon="📱"
              title="Content Creator"
              subtitle="TikTok • Instagram • YouTube"
              href="/creator"
              color="from-purple-500 to-pink-500"
            />
            <PathButton
              icon="💼"
              title="Brand/Sponsor"
              subtitle="Find & collaborate with creators"
              href="/brand"
              color="from-blue-500 to-indigo-500"
            />
            <PathButton
              icon="❤️"
              title="Super Fan"
              subtitle="Support your favorites"
              href="/fan"
              color="from-emerald-500 to-teal-500"
            />
            <PathButton
              icon="👥"
              title="Agency/Team"
              subtitle="Manage multiple creators"
              href="/agency"
              color="from-rose-500 to-fuchsia-500"
            />
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105">
              ▶ Watch Demo (90s)
            </button>
            <div className="text-white/70 text-sm font-medium">
              Trusted by <span className="text-white font-bold">50K+ creators</span> • <span className="text-green-400 font-bold">$250M+ paid</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* PROOF SECTION - Stats */}
      <section className="py-16 px-6 border-t border-white/10 border-b border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "50K+", text: "Creators", icon: "👥" },
            { number: "$250M+", text: "Paid Out", icon: "💰" },
            { number: "500+", text: "Brands", icon: "🏢" },
            { number: "5.0★", text: "Rating", icon: "⭐" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-lg font-semibold text-white/80">{stat.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Connect Social", desc: "Link Instagram/TikTok/YouTube in 30 seconds" },
              { step: "2", title: "Get Matched", desc: "500+ brands see your profile instantly" },
              { step: "3", title: "Get Paid", desc: "Keep 95% • Instant payouts • No negotiations" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-lg text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            Creator Success Stories
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Lisa Park", 
                niche: "Beauty", 
                followers: "1.2M", 
                earned: "$180K", 
                quote: "NILBx pays 3x more than brand deals",
                emoji: "💄"
              },
              { 
                name: "David Kim", 
                niche: "Food", 
                followers: "890K", 
                earned: "$95K", 
                quote: "One post = $5K. No negotiations",
                emoji: "🍜"
              },
              { 
                name: "Sarah Williams", 
                niche: "Fashion", 
                followers: "245K", 
                earned: "$62K", 
                quote: "I set my rates. Brands pay instantly",
                emoji: "👗"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-4 text-2xl">
                    {testimonial.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                    <p className="text-white/70 text-sm">{testimonial.niche} • {testimonial.followers}</p>
                  </div>
                </div>
                <p className="text-white/90 italic mb-4 text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold text-xl">{testimonial.earned}</span>
                  <span className="text-white/60 text-sm">in 2025</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Get Paid?
          </h2>
          <p className="text-2xl text-white/80 mb-12">
            Join 50K+ creators earning $100K+ annually on NILBx
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-black px-12 py-4 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
              🚀 Start Earning Now
            </button>
            <button className="border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all duration-300">
              For Brands & Partners
            </button>
          </div>
          <p className="mt-8 text-white/60 text-sm">No credit card required • Instant setup • 24/7 support</p>
        </motion.div>
      </section>

      {/* Old Sections (Optional - can be removed if too long) */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
