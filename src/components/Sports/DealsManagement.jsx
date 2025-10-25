import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Zap, Shield, DollarSign, Calendar } from 'lucide-react';

const DealsManagement = () => (
  <section className="py-20 bg-gradient-to-br from-blue-900/20 to-slate-900/30">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
          Premium Deal Management Platform
        </h2>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto">
          Manage multiple sponsorship deals with built-in compliance, tracking, and payment management
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        {/* Features */}
        <div className="space-y-6">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Smart Deal Matching",
              desc: "AI-powered system matches you with brands aligned to your values and audience"
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Compliance Built-In",
              desc: "NCAA and state regulations automatically enforced. Zero compliance violations."
            },
            {
              icon: <DollarSign className="w-6 h-6" />,
              title: "Payment Management",
              desc: "Secure payments, invoicing, and tax documentation all in one place"
            },
            {
              icon: <Calendar className="w-6 h-6" />,
              title: "Timeline Tracking",
              desc: "Track deliverables, deadlines, and contract milestones in real-time"
            },
            {
              icon: <CheckCircle className="w-6 h-6" />,
              title: "Deal Analytics",
              desc: "Monitor performance, ROI, and engagement metrics for each deal"
            },
            {
              icon: <AlertCircle className="w-6 h-6" />,
              title: "Risk Alerts",
              desc: "Get notified of potential compliance issues before they become problems"
            }
          ].map((feature, i) => (
            <div key={i} className="flex gap-4 p-6 glass rounded-xl border border-blue-300/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-blue-200 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Deal Cards Example */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-8 border border-emerald-400/50 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Nike</h3>
                <p className="text-blue-300 text-sm font-semibold">Shoe Endorsement Deal</p>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-lg px-4 py-2">
                <span className="text-emerald-300 font-bold text-sm">✓ Active</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Deal Value</span>
                <span className="text-white font-black">$85,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Duration</span>
                <span className="text-white font-semibold">12 months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Compliance Status</span>
                <span className="text-emerald-300 font-bold">✓ Compliant</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Next Payment</span>
                <span className="text-white font-semibold">March 15, 2025</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-300/30">
                <div className="text-2xl font-black text-blue-300 mb-1">4/12</div>
                <div className="text-xs text-blue-200 font-semibold">DELIVERABLES</div>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 text-center border border-yellow-300/30">
                <div className="text-2xl font-black text-yellow-300 mb-1">60%</div>
                <div className="text-xs text-yellow-200 font-semibold">PROGRESS</div>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
              View Deal Details
            </Button>
          </div>

          <div className="glass rounded-2xl p-8 border border-blue-300/30">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Under Armour</h3>
                <p className="text-blue-300 text-sm font-semibold">Social Media Campaign</p>
              </div>
              <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg px-4 py-2">
                <span className="text-blue-300 font-bold text-sm">⏳ Pending</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Deal Value</span>
                <span className="text-white font-black">$45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Duration</span>
                <span className="text-white font-semibold">6 months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Status</span>
                <span className="text-blue-300 font-bold">Under Review</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-blue-400 text-blue-300 hover:bg-blue-500/10 font-bold"
            >
              Review & Sign
            </Button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg px-12 py-4 shadow-glow hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)] transform hover:-translate-y-1 transition-all duration-300 h-16"
        >
          Start Managing Deals
        </Button>
      </div>
    </div>
  </section>
);

export default DealsManagement;
