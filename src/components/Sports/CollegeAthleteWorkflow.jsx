import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Calculator,
  CreditCard,
  ArrowRightCircle,
  GitBranch,
  DollarSign,
  FileCheck,
  Sparkles,
} from 'lucide-react';

const workflowSteps = [
  {
    title: 'Step 01 · Compliance Validation',
    endpoint: 'POST /compliance/validate-deal',
    summary: 'Autonomous NCAA + state rule engine confirms every offer before you accept it.',
    bullets: [
      'California Tier 1 rules cleared',
      'Deal Type: social_media_post',
      'Age 19 → no parental consent needed',
    ],
    icon: ShieldCheck,
  },
  {
    title: 'Step 02 · Payment Tier Assignment',
    endpoint: 'GET /tiers/by-followers/:count',
    summary: '15K followers immediately unlock the Professional tier with a 1.2x multiplier.',
    bullets: ['Follower Range: 5K – 24,999', 'Multiplier: 1.2x payout boost', 'Next tier unlocks at 25K'],
    icon: Sparkles,
  },
  {
    title: 'Step 03 · Payout Calculation',
    endpoint: 'POST /calculate-payout',
    summary: 'We apply multipliers, fees, and tax withholding so you know the exact net payout pre-signature.',
    bullets: ['Deal: $750 Nike IG stories', 'Service Fee: 5%', 'Net Payout: $765 (after taxes)'],
    icon: Calculator,
  },
  {
    title: 'Step 04 · Secure Funding & Card Capture',
    endpoint: 'POST /stripe/payment-intent',
    summary: 'Escrow-style payment intent is created before you deliver anything. Brands use Stripe Elements to fund.',
    bullets: ['Client secret shared instantly', 'Supports SCA + 3DS cards', 'Webhook updates status'],
    icon: CreditCard,
  },
  {
    title: 'Step 05 · Stripe Connect Onboarding',
    endpoint: 'POST /stripe/account/connect',
    summary: 'College athletes complete payout onboarding in <5 min — KYC, bank account, tax forms.',
    bullets: ['Hosted onboarding link', '1099 automation ready', 'One-time setup per athlete'],
    icon: FileCheck,
  },
  {
    title: 'Step 06 · Instant Transfers',
    endpoint: 'POST /stripe/transfer',
    summary: 'Funds are released to your connected account once deliverables clear the compliance checklist.',
    bullets: ['24h payout guarantee', 'Metadata keeps NIL records synced', 'Full audit trail for schools'],
    icon: DollarSign,
  },
];

const payoutBreakdown = [
  { label: 'Deal Amount', value: '$750.00' },
  { label: 'Tier Multiplier', value: '× 1.2 (Professional)' },
  { label: 'Calculated Payout', value: '$900.00' },
  { label: 'Service Fee (5%)', value: '- $45.00' },
  { label: 'Tax Withholding (10%)', value: '- $90.00' },
  { label: 'Net Payout', value: '$765.00' },
];

const quickStats = [
  { label: 'Follower Band', value: '15K – Stanford WBB', highlight: true },
  { label: 'Compliance', value: '99.8% cleared first pass' },
  { label: 'Escrow Window', value: '< 24h to release' },
];

const CollegeAthleteWorkflow = () => (
  <section className="py-24 bg-slate-950 text-white">
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-10 mb-16">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-sm font-semibold text-blue-200">
            <GitBranch className="w-4 h-4" />
            College Sports NIL Workflow
          </div>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight">
            Built for NCAA & NAIA Student-Athletes
          </h2>
          <p className="text-blue-100 text-lg">
            Every step below mirrors the verified workflow from{' '}
            <span className="font-semibold">STUDENT_ATHLETE_WORKFLOW_TEST_RESULTS.md</span> so compliance officers,
            coaches, and athletes can trust the /sports funnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="h-14 text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600">
              Start NCAA-Safe Workflow
              <ArrowRightCircle className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="h-14 text-lg font-semibold border-blue-400/40 text-blue-200 hover:bg-blue-500/10"
            >
              Download Workflow PDF
            </Button>
          </div>
        </div>
        <div className="flex-1 glass rounded-2xl border border-blue-400/30 p-8 space-y-4">
          <div className="flex items-center gap-3 text-emerald-300 text-sm font-semibold uppercase tracking-[0.2em]">
            <ShieldCheck className="w-5 h-5" />
            SARAH JOHNSON (Stanford, Basketball)
          </div>
          <h3 className="text-3xl font-black">Live Deal Snapshot</h3>
          <p className="text-blue-100/90">
            Nike Instagram Stories package routed through compliance, escrow, payouts, and webhook confirmations —
            the same flow every college athlete follows on NILBx.
          </p>
          <div className="bg-slate-900/60 rounded-xl border border-white/5 p-6 space-y-4">
            {payoutBreakdown.map((row, idx) => (
              <div key={row.label} className="flex items-center justify-between text-sm text-blue-100">
                <span className="font-semibold">{row.label}</span>
                <span className={`font-black ${idx === payoutBreakdown.length - 1 ? 'text-emerald-300 text-lg' : 'text-white'}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 p-4 text-sm font-semibold text-blue-100 bg-slate-900/40"
              >
                <div className="text-xs uppercase tracking-wider text-blue-300/80">{stat.label}</div>
                <div className={`text-xl font-black ${stat.highlight ? 'text-white' : 'text-blue-100'}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {workflowSteps.map((step) => (
          <div
            key={step.title}
            className="glass rounded-2xl border border-white/10 p-8 hover:border-blue-400/40 transition-all duration-300 space-y-4"
          >
            <div className="flex items-center gap-3 text-blue-200 text-xs uppercase tracking-[0.2em]">
              <step.icon className="w-4 h-4" />
              {step.endpoint}
            </div>
            <h3 className="text-2xl font-black">{step.title}</h3>
            <p className="text-blue-100 text-sm">{step.summary}</p>
            <ul className="space-y-2 text-sm text-blue-100/90">
              {step.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <ArrowRightCircle className="w-4 h-4 mt-0.5 text-blue-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CollegeAthleteWorkflow;
