import { useState } from 'react';
import { Sparkles, Dumbbell, Gamepad2, UtensilsCrossed, Plane, Code, Shirt } from 'lucide-react';

const niches = [
  { id: 'beauty', label: 'Beauty', icon: Sparkles, color: 'from-pink-500 to-pink-600' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'from-red-500 to-red-600' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'from-purple-500 to-purple-600' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, color: 'from-orange-500 to-orange-600' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'from-blue-500 to-blue-600' },
  { id: 'tech', label: 'Tech', icon: Code, color: 'from-cyan-500 to-cyan-600' },
  { id: 'fashion', label: 'Fashion', icon: Shirt, color: 'from-yellow-500 to-yellow-600' }
];

export default function NicheFilters({ onFilterChange = () => {} }) {
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (nicheId) => {
    const updated = activeFilters.includes(nicheId)
      ? activeFilters.filter(id => id !== nicheId)
      : [...activeFilters, nicheId];
    
    setActiveFilters(updated);
    onFilterChange(updated);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900/30 to-slate-900/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Find Creators in Your Niche
          </h2>
          <p className="text-lg text-slate-300">
            Filter by content category • Connect with your ideal creators
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {niches.map((niche) => {
            const Icon = niche.icon;
            const isActive = activeFilters.includes(niche.id);

            return (
              <button
                key={niche.id}
                onClick={() => toggleFilter(niche.id)}
                className={`group relative overflow-hidden rounded-full transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${niche.color} text-white shadow-lg shadow-${niche.id}-500/50 scale-110`
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {/* Shine effect on active */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                )}

                <div className="relative flex items-center gap-2 px-5 py-3 font-semibold">
                  <Icon className="w-5 h-5" />
                  <span>{niche.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        {activeFilters.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setActiveFilters([]);
                onFilterChange([]);
              }}
              className="text-blue-300 hover:text-white underline text-sm transition-colors"
            >
              Clear all filters
            </button>
            <p className="text-white/60 text-sm mt-2">
              Showing creators in: <span className="font-semibold text-white">
                {activeFilters
                  .map(id => niches.find(n => n.id === id)?.label)
                  .join(', ')}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
