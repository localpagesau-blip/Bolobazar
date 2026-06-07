import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bell, ShoppingBag, DollarSign, TrendingUp, Eye, Clock, Search, Globe, ExternalLink, X } from 'lucide-react';
import { formatCurrency, timeAgo } from '../lib/api';

const watchedListings = [
  { id: '1', title: 'SaaS Analytics Dashboard', price: 120000, revenue: 8500, status: 'active', added: '2024-12-02' },
  { id: '2', title: 'Niche Content Site — Outdoor Gear', price: 45000, revenue: 3200, status: 'active', added: '2024-11-29' },
];

const savedSearches = [
  { query: 'SaaS under $100k', filters: 'Category: SaaS, Max Price: $100,000', results: 8 },
  { query: 'Content sites with traffic', filters: 'Category: Content, Min Visitors: 50,000', results: 12 },
];

const purchaseHistory = [
  { id: '101', title: 'Fitness Blog', price: 12000, date: '2024-09-15', status: 'completed' },
  { id: '102', title: 'Local Service Directory', price: 8500, date: '2024-06-20', status: 'completed' },
];

export default function BuyerDashboard() {
  const [tab, setTab] = useState('watched');

  const stats = [
    { label: 'Watched Listings', value: watchedListings.length, icon: Heart, color: 'text-red-500' },
    { label: 'Saved Searches', value: savedSearches.length, icon: Search, color: 'text-brand-500' },
    { label: 'Purchases', value: purchaseHistory.length, icon: ShoppingBag, color: 'text-green-500' },
    { label: 'Total Invested', value: formatCurrency(purchaseHistory.reduce((a, p) => a + p.price, 0)), icon: DollarSign, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Track opportunities and manage your portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex gap-0 -mb-px">
          {[
            { id: 'watched', label: 'Watched Listings' },
            { id: 'searches', label: 'Saved Searches' },
            { id: 'purchases', label: 'Purchase History' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === t.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Watched Listings */}
      {tab === 'watched' && (
        <div className="space-y-4">
          {watchedListings.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No watched listings</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">Start browsing and save listings you're interested in</p>
              <Link to="/listings" className="btn-primary">Browse Listings</Link>
            </div>
          ) : (
            watchedListings.map((listing) => (
              <div key={listing.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <Globe size={20} className="text-brand-500" />
                      </div>
                      <div>
                        <Link to={`/listings/${listing.id}`} className="font-semibold hover:text-brand-500 transition-colors">
                          {listing.title}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Added {timeAgo(listing.added)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            listing.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="font-bold">{formatCurrency(listing.price)}</div>
                    <div className="text-xs text-slate-400">{formatCurrency(listing.revenue)}/mo</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Saved Searches */}
      {tab === 'searches' && (
        <div className="space-y-4">
          {savedSearches.length === 0 ? (
            <div className="text-center py-16">
              <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No saved searches</h3>
              <p className="text-slate-500 dark:text-slate-400">Save your search criteria to get notified of new matches</p>
            </div>
          ) : (
            savedSearches.map((search, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{search.query}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{search.filters}</p>
                    <span className="text-xs text-brand-500">{search.results} matching listings</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 transition-all">
                      <Bell size={16} />
                    </button>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Purchase History */}
      {tab === 'purchases' && (
        <div className="space-y-4">
          {purchaseHistory.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
              <p className="text-slate-500 dark:text-slate-400">Your acquisition history will appear here</p>
            </div>
          ) : (
            purchaseHistory.map((purchase) => (
              <div key={purchase.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{purchase.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={14} /> {purchase.date}</span>
                      <span className="px-1.5 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        {purchase.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(purchase.price)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}