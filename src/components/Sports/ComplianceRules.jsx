import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ComplianceRules = () => {
  const rules = [
    {
      category: "NCAA",
      rules: [
        { rule: "No pay-for-play", allowed: false, desc: "Cannot be compensated based on athletic performance" },
        { rule: "Name, Image, Likeness (NIL) use", allowed: true, desc: "Can monetize your personal NIL rights" },
        { rule: "Team/School endorsement", allowed: false, desc: "Cannot endorse competing brands" },
        { rule: "Compensation transparency", allowed: true, desc: "All deals must be reported to your school" },
        { rule: "Agency representation", allowed: true, desc: "Can hire NIL agent with NCAA approval" },
        { rule: "Social media monetization", allowed: true, desc: "Can earn from YouTube, TikTok, etc." }
      ]
    },
    {
      category: "State Laws",
      rules: [
        { rule: "State residency requirements", allowed: true, desc: "Some states have specific NIL rules" },
        { rule: "Tax reporting", allowed: true, desc: "Must report all NIL income on taxes" },
        { rule: "Contract requirements", allowed: true, desc: "Deals must be in writing" },
        { rule: "Disclosure requirements", allowed: true, desc: "Must disclose sponsored content" },
        { rule: "Minor protections", allowed: true, desc: "Additional rules if under 18" },
        { rule: "Agent licensing", allowed: true, desc: "Agents must be registered in your state" }
      ]
    },
    {
      category: "Platform",
      rules: [
        { rule: "NILbx verification", allowed: true, desc: "Complete identity and school verification" },
        { rule: "Deal review process", allowed: true, desc: "All deals reviewed for compliance" },
        { rule: "Prohibited brands", allowed: false, desc: "Certain industries restricted (alcohol, gambling, etc.)" },
        { rule: "Content guidelines", allowed: true, desc: "Content must meet FTC disclosure standards" },
        { rule: "Payment processing", allowed: true, desc: "Secure payment with tax documentation" },
        { rule: "Annual compliance audit", allowed: true, desc: "Your deals audited yearly for compliance" }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900/30 to-blue-900/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Compliance Rules & Requirements
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Student-athletes have additional compliance rules compared to general influencers. We handle everything.
          </p>
        </div>

        <Tabs defaultValue="NCAA" className="mb-16">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-glass border border-white/20">
            <TabsTrigger value="NCAA" className="font-bold">NCAA Rules</TabsTrigger>
            <TabsTrigger value="State Laws" className="font-bold">State Laws</TabsTrigger>
            <TabsTrigger value="Platform" className="font-bold">Platform Rules</TabsTrigger>
          </TabsList>

          {rules.map((section) => (
            <TabsContent key={section.category} value={section.category}>
              <div className="grid gap-4 mt-8">
                {section.rules.map((item, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 p-6 rounded-xl border transition-all duration-300 ${
                      item.allowed
                        ? 'glass border-emerald-300/50 hover:border-emerald-400/70'
                        : 'glass border-red-300/50 hover:border-red-400/70'
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0">
                      {item.allowed ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1">{item.rule}</h3>
                      <p className="text-white text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Comparison section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-2xl border border-white/10 p-12 mb-12">
          <h3 className="text-2xl font-black text-white mb-8 text-center">
            Student-Athletes vs. General Influencers
          </h3>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                Student-Athletes (More Restrictions)
              </h4>
              <ul className="space-y-3">
                {[
                  "NCAA compliance requirements",
                  "School approval needed for many deals",
                  "Cannot accept pay-for-play",
                  "Team sport restrictions (competitors)",
                  "Annual compliance audits",
                  "State-specific regulations",
                  "Limited deal types",
                  "Mandatory contract review"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-white">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                General Influencers (Fewer Restrictions)
              </h4>
              <ul className="space-y-3">
                {[
                  "No NCAA restrictions",
                  "Free to choose any brand",
                  "Can negotiate any deal terms",
                  "No school approval needed",
                  "More flexible compensation",
                  "Fewer regulatory requirements",
                  "More deal opportunities",
                  "Faster contract process"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Compliance guarantee */}
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl border-2 border-blue-400/50 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-4">
            NILbx Compliance Guarantee
          </h3>

          <p className="text-blue-100 text-lg mb-8 max-w-3xl mx-auto">
            Every deal on NILbx is reviewed and approved for compliance with NCAA rules, state laws, and platform policies. 
            We have a 99.8% compliance rate with zero violations for our student-athletes.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-black text-emerald-300 mb-2">99.8%</div>
              <div className="text-white font-semibold">Compliance Rate</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-300 mb-2">0</div>
              <div className="text-white font-semibold">Violations</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-300 mb-2">24/7</div>
              <div className="text-white font-semibold">Support Team</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceRules;
