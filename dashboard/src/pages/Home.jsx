import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Globe, Shield, Zap, TrendingUp, Search, Users, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Valuation',
    description: 'Get instant, accurate valuations powered by machine learning analyzing traffic, revenue, and market data.',
  },
  {
    icon: Search,
    title: 'Curated Listings',
    description: 'Every site is vetted for quality and verified metrics. No scams, no junk — just real opportunities.',
  },
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Built-in escrow and transaction management. Buy and sell with complete peace of mind.',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Access detailed traffic, revenue, and growth metrics. Make informed decisions with real data.',
  },
  {
    icon: Users,
    title: 'Qualified Buyers & Sellers',
    description: 'Our community of serious entrepreneurs ensures fast, fair deals for everyone.',
  },
  {
    icon: TrendingUp,
    title: 'Portfolio Management',
    description: 'Track your acquisitions, monitor performance, and grow your digital asset portfolio.',
  },
];

const testimonials = [
  {
    quote: 'SiteFlip made selling my side project incredibly easy. The AI valuation was spot-on and I found a buyer in less than a week.',
    author: 'Alex Chen',
    role: 'Sold SaaS platform for $45K',
    avatar: 'AC',
  },
  {
    quote: 'As a buyer, the detailed analytics and vetted listings gave me confidence to make my first acquisition. Already looking for my next one.',
    author: 'Sarah Mitchell',
    role: 'Acquired 3 sites in 6 months',
    avatar: 'SM',
  },
  {
    quote: 'The escrow service and transaction support made a $120K deal feel seamless. This is how website marketplaces should work.',
    author: 'Marcus Johnson',
    role: 'Sold content site portfolio',
    avatar: 'MJ',
  },
];

const stats = [
  { value: '$12M+', label: 'Total transaction volume' },
  { value: '2,500+', label: 'Websites listed' },
  { value: '98%', label: 'Successful completion rate' },
  { value: '4.9/5', label: 'User satisfaction' },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-950/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-brand-200/30 to-transparent dark:from-brand-800/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-200/30 to-transparent dark:from-purple-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 mb-6 animate-fade-in">
              <Sparkles size={14} className="text-brand-500" />
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                AI-Powered Website Marketplace
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
              Buy & Sell Websites
              <span className="block gradient-text mt-2">With Confidence</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 animate-slide-up">
              The modern marketplace for digital assets. AI-powered valuations, verified listings, 
              and secure transactions — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/listings" className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2">
                Browse Listings <ArrowRight size={18} />
              </Link>
              <Link to="/valuation" className="btn-secondary text-base px-8 py-3 inline-flex items-center gap-2">
                Value Your Site <BarChart3 size={18} />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Everything you need to <span className="gradient-text">flip sites</span></h2>
            <p className="section-subtitle">
              From valuation to transaction, we've built the complete toolkit for website investors.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-6 group hover:border-brand-200 dark:hover:border-brand-700">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-brand-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Simple <span className="gradient-text">3-step</span> process</h2>
            <p className="section-subtitle">
              Whether you're buying or selling, we've streamlined the entire journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'List or Browse',
                desc: 'Sellers list with AI-assisted valuation. Buyers browse curated, vetted opportunities.',
                icon: Globe,
              },
              {
                step: '02',
                title: 'Connect & Verify',
                desc: 'Access detailed analytics, ask questions, and verify all metrics before committing.',
                icon: Search,
              },
              {
                step: '03',
                title: 'Close Securely',
                desc: 'Complete your transaction with built-in escrow, legal docs, and migration support.',
                icon: Shield,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center p-6">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                    <Icon size={28} />
                  </div>
                  <div className="text-sm font-semibold text-brand-500 mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Trusted by <span className="gradient-text">entrepreneurs</span></h2>
            <p className="section-subtitle">
              Join thousands of successful buyers and sellers on SiteFlip.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.author} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-medium">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{t.author}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl gradient-bg p-8 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to flip your first site?
              </h2>
              <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
                Join SiteFlip today and start buying and selling websites with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-3 rounded-lg hover:bg-brand-50 transition-all shadow-lg"
                >
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white/10 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}