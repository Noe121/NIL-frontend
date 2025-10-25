import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const successStories = [
  {
    name: 'Lisa Park',
    niche: 'Beauty Creator',
    followers: '1.2M followers',
    earnings: '$180K in 2025',
    quote: 'NILBx pays 3x more than brand deals',
    avatar: '👩‍🎨'
  },
  {
    name: 'David Kim',
    niche: 'Food Blogger',
    followers: '890K followers',
    earnings: '$95K in 2025',
    quote: 'One post = $5K. No negotiations.',
    avatar: '👨‍🍳'
  },
  {
    name: 'Emma Rodriguez',
    niche: 'Travel Vlogger',
    followers: '2.1M followers',
    earnings: '$240K in 2025',
    quote: 'Best platform for serious creators',
    avatar: '✈️'
  },
  {
    name: 'James Wilson',
    niche: 'Gaming Creator',
    followers: '756K followers',
    earnings: '$120K in 2025',
    quote: 'Instant payments. No more waiting.',
    avatar: '🎮'
  }
];

export default function ProofCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % successStories.length);
  const prev = () => setCurrent((current - 1 + successStories.length) % successStories.length);

  return (
    <section className="py-32 bg-gradient-to-b from-slate-900/30 to-purple-900/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Real Creators, Real Earnings
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            See how creators like you are making six figures on NILBx.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-light rounded-3xl p-12 lg:p-16 border border-white/20 backdrop-blur-sm text-center">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-lg">
                  {successStories[current].avatar}
                </div>

                {/* Quote */}
                <p className="text-2xl font-bold text-white mb-8">
                  "{successStories[current].quote}"
                </p>

                {/* Creator Info */}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white mb-2">
                    {successStories[current].name}
                  </h3>
                  <p className="text-purple-300 font-semibold mb-4">
                    {successStories[current].niche}
                  </p>
                  <div className="flex justify-center gap-8 text-sm">
                    <div>
                      <div className="text-pink-300 font-black text-lg">
                        {successStories[current].followers}
                      </div>
                      <div className="text-white/60">Followers</div>
                    </div>
                    <div>
                      <div className="text-green-300 font-black text-lg">
                        {successStories[current].earnings}
                      </div>
                      <div className="text-white/60">Earnings</div>
                    </div>
                  </div>
                </div>

                {/* 5 Stars */}
                <div className="flex justify-center mb-8 text-2xl">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'bg-pink-500 w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
