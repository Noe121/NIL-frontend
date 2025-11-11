import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDemoData } from '../../contexts/DataManagementContext';
import DemoFeedbackWidget from '../DemoFeedbackWidget';

const demoTestimonials = [
  {
    quote: "I made $45K my first month just posting content I already create. NILBx made it so simple.",
    author: "David Martinez",
    role: "Gaming Content Creator • 850K followers",
    avatar: "👾",
    rating: 5,
    earnings: "$285K annual",
    isDemo: true
  },
  {
    quote: "The best part? No lengthy negotiations or hidden fees. I get paid what they promised, every time.",
    author: "Priya Patel",
    role: "Travel Influencer • 1.2M followers",
    avatar: "✈️",
    rating: 5,
    earnings: "$340K annual",
    isDemo: true
  },
  {
    quote: "Compared to other platforms, NILBx keeps 95% with me. That's a game changer for content creators.",
    author: "Jessica Chen",
    role: "Beauty & Lifestyle • 950K followers",
    avatar: "💄",
    rating: 5,
    earnings: "$210K annual",
    isDemo: true
  },
  {
    quote: "The brand partnerships are vetted and actually relevant to my content. No sketchy deals.",
    author: "Marcus Johnson",
    role: "Fitness Creator • 1.5M followers",
    avatar: "💪",
    rating: 5,
    earnings: "$420K annual",
    isDemo: true
  }
];

const realTestimonials = [
  // Real testimonials would be loaded from API
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CreatorTestimonials() {
  const { data, isDemo, isTransitioning, progress } = useDemoData('userProfiles', demoTestimonials, realTestimonials);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900/50 to-blue-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Creators Love Us
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real creators, real earnings, real stories.
          </p>
          {isTransitioning && (
            <div className="mt-4">
              <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full">
                <p className="text-purple-300 text-sm">
                  🔄 Loading real creator profiles... {progress}%
                </p>
              </div>
            </div>
          )}
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {data.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 rounded-2xl blur-xl transition-all duration-300 -z-10"></div>

              <div className="glass-light rounded-2xl p-8 border border-white/20 backdrop-blur-sm h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg text-white/90 mb-6 flex-1">
                  "{testimonial.quote}"
                </p>

                {/* Divider */}
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"></div>

                {/* Author */}
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg">{testimonial.author}</h4>
                    <p className="text-sm text-white/70 mb-2">{testimonial.role}</p>
                    <div className="inline-block px-3 py-1 bg-green-500/20 rounded-full">
                      <p className="text-xs font-bold text-green-300">{testimonial.earnings}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <p className="text-center text-white/70 text-sm mb-8 font-semibold uppercase tracking-wider">
            Trusted By Creators On
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-4xl">📱 TikTok</div>
            <div className="text-4xl">📸 Instagram</div>
            <div className="text-4xl">▶️ YouTube</div>
            <div className="text-4xl">𝕏 Twitter</div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl p-12 border border-white/20">
          <div className="text-center">
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2">
              $4.2M+
            </div>
            <p className="text-white/70">Paid Out Monthly</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
              15,000+
            </div>
            <p className="text-white/70">Active Creators</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-2">
              95%
            </div>
            <p className="text-white/70">Payout to Creators</p>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-16 text-center space-y-4">
          {isDemo ? (
            <div className="inline-block px-6 py-3 bg-purple-500/10 rounded-full border border-purple-400/30">
              <p className="text-purple-300 text-sm font-medium">
                🎭 Sample creator profiles • Real earnings data coming soon
              </p>
            </div>
          ) : (
            <div className="inline-block px-6 py-3 bg-green-500/10 rounded-full border border-green-400/30">
              <p className="text-green-300 text-sm font-medium">
                ✅ Real creator profiles and earnings
              </p>
            </div>
          )}

          {/* Feedback Widget */}
          <DemoFeedbackWidget
            dataType="userProfiles"
            className="mt-4"
          />
        </div>
      </div>
    </section>
  );
}
