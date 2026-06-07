import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, TrendingUp, DollarSign, Users, ExternalLink, Clock, BarChart3, Shield, MessageSquare, Heart, Share2, CheckCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '../lib/api';

// Sample data - same as listings page
const listingData = {
  id: '1',
  title: 'SaaS Analytics Dashboard',
  description: 'A profitable SaaS analytics platform with 2,300+ paying customers. Built with React and Node.js. Growing 15% MoM.',
  longDescription: `This SaaS analytics dashboard has been operating profitably for over 3 years. It serves small to medium businesses with real-time analytics, custom reporting, and team collaboration features.

The platform processes over 10 million data points daily and has maintained 99.9% uptime over the past 12 months. The codebase is clean, well-documented, and follows modern development practices.

Key achievements:
• 2,300+ paying customers across 3 tiers
• 15% month-over-month revenue growth
• 4.7/5 average rating on review platforms
• Low churn rate of 3.2% monthly`,
  price: 120000,
  monthlyRevenue: 8500,
  monthlyProfit: 4200,
  visitors: 45000,
  category: 'SaaS',
  niche: 'Analytics',
  listedDate: '2024-12-01',
  sellerName: 'Alex R.',
  sellerJoined: '2023-03',
  sellerListings: 4,
  score: 92,
  techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Stripe'],
  growthRate: 15,
  churnRate: 3.2,
  customers: 2300,
  trafficSources: [
    { source: 'Organic Search', pct: 45 },
    { source: 'Direct', pct: 25 },
    { source: 'Referral', pct: 18 },
    { source: 'Paid Ads', pct: 12 },
  ],
  screenshots: [null, null, null],
};

export default function ListingDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const listing = listingData; // In real app, fetch by id

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Listing not found</h2>
        <Link to="/listings" className="text-brand-500 hover:underline">Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Back button */}
      <Link to="/listings" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to listings
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Hero */}
          <div className="rounded-xl aspect-video bg-gradient-to-br from-brand-100 via-brand-50 to-purple-100 dark:from-brand-900/30 dark:via-brand-800/20 dark:to-purple-900/30 flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700">
            <Globe size={64} className="text-brand-300 dark:text-brand-600" />
          </div>

          {/* Title & actions */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
                <div className="px-2.5 py-0.5 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  Score {listing.score}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  {listing.category}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {listing.niche}
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 transition-all">
                <Heart size={18} />
              </button>
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-500 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 text-center">
              <DollarSign size={20} className="text-brand-500 mx-auto mb-1" />
              <div className="text-xl font-bold">{formatCurrency(listing.price)}</div>
              <div className="text-xs text-slate-400">Asking Price</div>
            </div>
            <div className="card p-4 text-center">
              <TrendingUp size={20} className="text-green-500 mx-auto mb-1" />
              <div className="text-xl font-bold">{formatCurrency(listing.monthlyRevenue)}</div>
              <div className="text-xs text-slate-400">Monthly Revenue</div>
            </div>
            <div className="card p-4 text-center">
              <DollarSign size={20} className="text-purple-500 mx-auto mb-1" />
              <div className="text-xl font-bold">{formatCurrency(listing.monthlyProfit)}</div>
              <div className="text-xs text-slate-400">Monthly Profit</div>
            </div>
            <div className="card p-4 text-center">
              <Users size={20} className="text-blue-500 mx-auto mb-1" />
              <div className="text-xl font-bold">{formatNumber(listing.visitors)}</div>
              <div className="text-xs text-slate-400">Monthly Visitors</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex gap-0 -mb-px">
              {['overview', 'metrics', 'tech'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-all capitalize ${
                    activeTab === tab
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">About this listing</h2>
                <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {listing.longDescription}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-3">Traffic Sources</h2>
                <div className="space-y-3">
                  {listing.trafficSources.map((source) => (
                    <div key={source.source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">{source.source}</span>
                        <span className="font-medium">{source.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-bg rounded-full transition-all"
                          style={{ width: `${source.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Growth Rate</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">+{listing.growthRate}%</div>
                    <div className="text-xs text-slate-400">Month over Month</div>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                    <BarChart3 size={20} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Churn Rate</div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{listing.churnRate}%</div>
                    <div className="text-xs text-slate-400">Monthly</div>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Total Customers</div>
                    <div className="text-2xl font-bold">{formatNumber(listing.customers)}</div>
                    <div className="text-xs text-slate-400">Paying users</div>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <DollarSign size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Profit Margin</div>
                    <div className="text-2xl font-bold">{Math.round((listing.monthlyProfit / listing.monthlyRevenue) * 100)}%</div>
                    <div className="text-xs text-slate-400">Net margin</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Technology Stack</h2>
              <div className="flex flex-wrap gap-2">
                {listing.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* CTA Card */}
          <div className="card p-6 sticky top-24">
            <div className="text-3xl font-bold gradient-text mb-2">{formatCurrency(listing.price)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              ~{formatCurrency(Math.round(listing.price / listing.monthlyProfit))}x monthly profit multiple
            </div>
            <button className="btn-primary w-full mb-3 flex items-center justify-center gap-2">
              Express Interest <MessageSquare size={16} />
            </button>
            <button className="btn-secondary w-full flex items-center justify-center gap-2">
              Buy Now <DollarSign size={16} />
            </button>
            <hr className="my-4 border-slate-200 dark:border-slate-700" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Shield size={16} className="text-green-500" />
                <span>Verified metrics</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle size={16} className="text-green-500" />
                <span>Escrow-ready transaction</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock size={16} className="text-green-500" />
                <span>Quick closing available</span>
              </div>
            </div>
          </div>

          {/* Seller info */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Seller</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-medium">
                {listing.sellerName[0]}
              </div>
              <div>
                <div className="font-medium">{listing.sellerName}</div>
                <div className="text-xs text-slate-400">Member since {listing.sellerJoined}</div>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              {listing.sellerListings} listings published
            </div>
            <button className="btn-ghost w-full text-sm mt-2 text-brand-500">
              Contact Seller
            </button>
          </div>

          {/* Report */}
          <div className="card p-5 text-center">
            <BarChart3 size={24} className="text-brand-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm mb-1">Want deeper insights?</h3>
            <p className="text-xs text-slate-400 mb-3">Get a full due diligence report with traffic analysis, competitor comparison, and growth projections.</p>
            <Link to="/valuation" className="text-sm text-brand-500 hover:text-brand-600 font-medium">
              Generate Report →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}