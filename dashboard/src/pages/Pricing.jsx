import { Link } from 'react-router-dom';
import { Check, X, Sparkles, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'List 1 website',
      'Basic listing details',
      'Standard visibility',
      'Community support',
    ],
    missing: [
      'AI valuation reports',
      'Featured placement',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/listing',
    description: 'For serious sellers',
    features: [
      'List unlimited websites',
      'AI valuation included',
      'Featured listing for 7 days',
      'Detailed analytics',
      'Priority support',
      'Bulk listing tools',
    ],
    missing: [],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Business',
    price: '$99',
    period: '/listing',
    description: 'For power sellers & agencies',
    features: [
      'Everything in Pro',
      'Featured listing for 30 days',
      'Homepage spotlight',
      'Newsletter feature',
      'Dedicated account manager',
      'API access',
      'Custom branding',
      'Bulk discounts',
    ],
    missing: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

const successFee = {
  name: 'Success Fee',
  price: '5-10%',
  period: 'per sale',
  description: 'Only pay when you sell',
  features: [
    'No upfront cost',
    'Professional escrow service',
    'Transaction management',
    'Migration support',
    'Dispute resolution',
    'Verified payment',
  ],
};

const faqs = [
  { q: 'How does the success fee work?', a: 'You only pay when your listing sells. The fee is 5-10% of the final sale price, capped at $5,000. This covers escrow, transaction management, and support.' },
  { q: 'Can I upgrade my listing later?', a: 'Yes! You can upgrade from Free to Pro or Business at any time. The upgrade takes effect immediately and the featured period starts from the upgrade date.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for larger transactions.' },
  { q: 'Is there a refund policy?', a: 'If your listing doesn\'t sell within 90 days on a paid plan, we\'ll refund your listing fee. Terms and conditions apply.' },
];

export default function Pricing() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Simple, transparent <span className="gradient-text">pricing</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Start free and upgrade as you grow. No hidden fees, no surprises.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card p-6 md:p-8 relative ${
              plan.popular
                ? 'border-brand-500 dark:border-brand-500 ring-1 ring-brand-500 shadow-lg shadow-brand-500/10'
                : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-white text-xs font-semibold shadow-sm">
                Most Popular
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
            </div>
            <Link
              to="/register"
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg text-sm font-medium transition-all mb-6 ${
                plan.popular
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {plan.cta} <ArrowRight size={16} />
            </Link>
            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{f}</span>
                </li>
              ))}
              {plan.missing.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <X size={16} className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0" />
                  <span className="text-slate-400 dark:text-slate-500">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Success Fee */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="card p-6 md:p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Shield size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{successFee.name}: <span className="gradient-text">{successFee.price}</span></h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{successFee.description}</p>
          <div className="grid sm:grid-cols-3 gap-4 text-left max-w-lg mx-auto mb-6">
            {successFee.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check size={14} className="text-green-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">{f}</span>
              </div>
            ))}
          </div>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Start Listing Free <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="card p-5">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}