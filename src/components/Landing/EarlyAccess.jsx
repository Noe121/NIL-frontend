import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Rocket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EarlyAccess() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-r from-slate-900/20 to-blue-900/20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="glass-light rounded-2xl p-8 lg:p-12 border border-white/20 shadow-2xl backdrop-blur-sm">
          {/* Toggle Header */}
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6 shadow-lg">
                <Rocket className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-black text-white mb-2">
                  🎉 Get Early Access
                </h3>
                <p className="text-blue-300 font-semibold">
                  Limited spots • Special launch pricing
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white h-12 w-12 p-0 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>

          {/* Collapsible Form */}
          <div className={`animate-slide-down mt-6 ${isOpen ? 'open' : ''}`}>
            <form className="grid lg:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <Input
                placeholder="Full Name *"
                className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder-blue-300"
              />
              <Input
                type="email"
                placeholder="Email Address *"
                className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder-blue-300"
              />
              <Select>
                <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="I am a..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  <SelectItem value="athlete" className="text-white">🏃 Student-Athlete</SelectItem>
                  <SelectItem value="sponsor" className="text-white">🏢 Sponsor/Brand</SelectItem>
                  <SelectItem value="fan" className="text-white">👥 Fan/Collector</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                size="lg"
                className="lg:col-span-2 h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 col-span-2"
              >
                🚀 Get Early Access Now
              </Button>
            </form>
            <p className="text-center text-sm text-blue-300/80 mt-6">
              No spam • Unsubscribe anytime • We respect your privacy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}