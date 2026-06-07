import { Link } from 'react-router-dom';
import { Globe, Search, Shield, DollarSign, BarChart3, Users, CheckCircle, ArrowRight, Sparkles, MessageSquare, FileText, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse Vetted Listings',
    description: 'Explore our curated marketplace of verified websites. Each listing includes detailed analytics, traffic data, revenue metrics, and growth history.',
    details: [
      'Advanced search and filtering',
      'Detailed performance metrics',
      'Verified traffic and revenue data',
      'Seller reputation scores',
    ],
  },
  {
    icon: MessageSquare,
    title: 'Connect & Conduct Due Diligence',
    description: 'Communicate with sellers directly through our platform. Request additional data, ask questions, and perform thorough due diligence.',
    details: [
      'Secure in-platform messaging',
      'Request additional documentation',
      'Schedule calls with sellers',
      'Third-party verification tools',
    ],
  },
  {
    icon: Shield,
    title: 'Close Securely',
    description: 'Complete your transaction with confidence. Our built-in escrow service protects both parties throughout the transfer process.',
    details: [
      'Professional escrow service',
      'Legal document templates',
      'Asset transfer assistance',
      'Dispute resolution support',
    ],
  },
];

const perks = [
  {
    icon: BarChart3,
    title: 'AI Valuation',
    desc: 'Get instant, accurate valuations powered by machine learning analyzing thousands of comparable sales.',
  },
  {
    icon: Shield,
    title: 'Fraud Protection',
    desc: 'Every listing is manually reviewed. Verified metrics and seller identity protection keep the marketplace safe.',
  },
  {
    icon: FileText,
    title: 'Legal Templates',
    desc: 'Access professional purchase agreements, NDAs, and transfer documents tailored to website acquisitions.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    desc: 'Support for multiple payment methods, including wire transfers, escrow, and seller financing options.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Join a network of experienced website investors. Share insights, ask questions, and learn from peers.',
  },
  {
    icon: Globe,
    title: 'Migration Support',
    desc: 'Get help with domain transfers, hosting migration, code handover, and SEO preservation during ownership changes.',
  },
];

export default function About() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 mb-6">
            <Sparkles size={14} className="text-brand-500" />
            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">How SiteFlip Works</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            The modern way to <span className="gradient-text">buy & sell websites</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-10">
            SiteFlip is a trusted marketplace connecting serious buyers with verified sellers. 
            We combine AI-powered valuations, detailed analytics, and secure transactions to make 
            website flipping accessible to everyone.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">How it <span className="gradient-text">works</span></h2>
            <p className="section-subtitle">
              Three simple steps from discovery to ownership.
            </p>
          </div>
          <div className="space-y-12 max-w-4xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="md:w-16 shrink-0">
                    <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center">
                        <Icon size={20} className="text-brand-500" />
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">{step.description}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {step.details.map((d) => (
                        <div key={d} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle size={14} className="text-green-500 shrink-0" />
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Why choose <span className="gradient-text">SiteFlip</span></h2>
            <p className="section-subtitle">
              We've built the most trusted platform for buying and selling digital assets.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title} className="card p-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-brand-500" />
                  </div>
                  <h3 className="font-semibold mb-2">{perk.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-16 text-center max-w-3xl mx-auto border-2 border-brand-200 dark:border-brand-800">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
              Join thousands of entrepreneurs who trust SiteFlip for their website acquisitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link to="/listings" className="btn-secondary inline-flex items-center gap-2 px-8 py-3">
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}