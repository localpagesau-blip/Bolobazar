import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, List, Globe, TrendingUp, DollarSign, Users, ExternalLink } from 'lucide-react';
import { formatCurrency, formatNumber, timeAgo } from '../lib/api';

const categories = [
  'All',
  'SaaS',
  'E-commerce',
  'Content',
  'Blog',
  'Newsletter',
  'Marketplace',
  'Tool',
  'Community',
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'revenue', label: 'Revenue' },
];

const sampleListings = [
  {
    id: '1',
    title: 'SaaS Analytics Dashboard',
    description: 'A profitable SaaS analytics platform with 2,300+ paying customers. Built with React and Node.js. Growing 15% MoM.',
    price: 120000,
    monthlyRevenue: 8500,
    monthlyProfit: 4200,
    visitors: 45000,
    category: 'SaaS',
    niche: 'Analytics',
    listedDate: '2024-12-01',
    thumbnail: null,
    sellerName: 'Alex R.',
    score: 92,
  },
  {
    id: '2',
    title: 'Niche Content Site — Outdoor Gear',
    description: 'Authority content site in the outdoor gear space. 150+ articles ranking on first page of Google. Strong Amazon affiliate revenue.',
    price: 45000,
    monthlyRevenue: 3200,
    monthlyProfit: 2600,
    visitors: 89000,
    category: 'Content',
    niche: 'Outdoors',
    listedDate: '2024-11-28',
    thumbnail: null,
    sellerName: 'Maria K.',
    score: 88,
  },
  {
    id: '3',
    title: 'Dropshipping Store — Home Decor',
    description: 'Well-established dropshipping store with 15K+ social media followers. Automated fulfillment. Strong repeat customer rate.',
    price: 28000,
    monthlyRevenue: 5800,
    monthlyProfit: 1800,
    visitors: 32000,
    category: 'E-commerce',
    niche: 'Home Decor',
    listedDate: '2024-11-25',
    thumbnail: null,
    sellerName: 'James T.',
    score: 76,
  },
  {
    id: '4',
    title: 'Developer Tool — API Monitoring',
    description: 'API monitoring and alerting tool with 800+ developers using the free tier and 120 paid subscribers.',
    price: 85000,
    monthlyRevenue: 6200,
    monthlyProfit: 3400,
    visitors: 12000,
    category: 'Tool',
    niche: 'Developer Tools',
    listedDate: '2024-11-20',
    thumbnail: null,
    sellerName: 'Priya S.',
    score: 94,
  },
  {
    id: '5',
    title: 'Health & Wellness Newsletter',
    description: 'Growing newsletter with 24K subscribers. Weekly digests with 45% open rate. Sponsorship revenue from health brands.',
    price: 15000,
    monthlyRevenue: 1800,
    monthlyProfit: 1500,
    visitors: 5000,
    category: 'Newsletter',
    niche: 'Health & Wellness',
    listedDate: '2024-11-15',
    thumbnail: null,
    sellerName: 'David L.',
    score: 81,
  },
  {
    id: '6',
    title: 'Niche Job Board — Remote Design',
    description: 'Remote design job board with 5K monthly active job seekers. Premium listings from 200+ companies.',
    price: 65000,
    monthlyRevenue: 4800,
    monthlyProfit: 3600,
    visitors: 65000,
    category: 'Marketplace',
    niche: 'Jobs',
    listedDate: '2024-11-10',
    thumbnail: null,
    sellerName: 'Emma W.',
    score: 90,
  },
];

export default function Listings() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = sampleListings
    .filter((l) => {
      if (category !== 'All' && l.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.niche.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'price_low': return a.price - b.price;
        case 'price_high': return b.price - a.price;
        case 'revenue': return b.monthlyRevenue - a.monthlyRevenue;
        default: return new Date(b.listedDate) - new Date(a.listedDate);
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Listings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {filtered.length} vetted websites available for acquisition
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, niche, or description..."
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-auto min-w-[140px]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 ${viewMode === 'grid' ? 'bg-brand-50 dark:bg-brand-950 text-brand-500' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'bg-brand-50 dark:bg-brand-950 text-brand-500' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listing Grid */}
      <div className={viewMode === 'grid' 
        ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {filtered.map((listing) => (
          <Link
            key={listing.id}
            to={`/listings/${listing.id}`}
            className={`card group ${viewMode === 'list' ? 'flex gap-6 p-5' : 'p-5'}`}
          >
            {/* Thumbnail placeholder */}
            <div className={`${viewMode === 'list' ? 'w-48 shrink-0' : 'w-full'} aspect-video rounded-lg bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 mb-4 flex items-center justify-center overflow-hidden`}>
              <Globe size={40} className="text-brand-300 dark:text-brand-700" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                  {listing.title}
                </h3>
                <div className="shrink-0">
                  <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    listing.score >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    listing.score >= 75 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    Score {listing.score}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {listing.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {listing.niche}
                </span>
              </div>

              {viewMode === 'list' && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{listing.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <DollarSign size={14} />
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(listing.price)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  <span>{formatCurrency(listing.monthlyRevenue)}/mo</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{formatNumber(listing.visitors)}/mo</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">{timeAgo(listing.listedDate)}</span>
                <span className="text-xs text-slate-400">by {listing.sellerName}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No listings found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}