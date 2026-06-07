import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Eye, DollarSign, TrendingUp, Users, BarChart3, MessageSquare, Globe, MoreHorizontal, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '../lib/api';

const sampleListings = [
  { id: '1', title: 'SaaS Analytics Dashboard', price: 120000, revenue: 8500, visitors: 45000, status: 'active', views: 234, inquiries: 12, date: '2024-12-01' },
  { id: '2', title: 'Niche Content Site — Outdoor Gear', price: 45000, revenue: 3200, visitors: 89000, status: 'active', views: 189, inquiries: 8, date: '2024-11-28' },
  { id: '3', title: 'Dev Tool — API Monitor', price: 85000, revenue: 6200, visitors: 12000, status: 'pending', views: 56, inquiries: 3, date: '2024-11-20' },
];

const sampleInquiries = [
  { id: '1', buyer: 'john@email.com', listing: 'SaaS Analytics Dashboard', message: 'Interested in learning more about the tech stack and customer acquisition channels.', date: '2 hours ago', read: false },
  { id: '2', buyer: 'sarah@email.com', listing: 'SaaS Analytics Dashboard', message: 'Would you consider a payment plan? I can do 50% upfront.', date: '1 day ago', read: true },
  { id: '3', buyer: 'mike@email.com', listing: 'Niche Content Site', message: 'Looking for more details on traffic sources and SEO strategy.', date: '3 days ago', read: true },
];

export default function SellerDashboard() {
  const [tab, setTab] = useState('listings');
  const [showForm, setShowForm] = useState(false);

  const stats = [
    { label: 'Active Listings', value: sampleListings.filter(l => l.status === 'active').length, icon: Globe, color: 'text-brand-500' },
    { label: 'Total Views', value: formatNumber(sampleListings.reduce((a, l) => a + l.views, 0)), icon: Eye, color: 'text-blue-500' },
    { label: 'Inquiries', value: sampleInquiries.length, icon: MessageSquare, color: 'text-purple-500' },
    { label: 'Total Value', value: formatCurrency(sampleListings.reduce((a, l) => a + l.price, 0)), icon: DollarSign, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your listings and track performance</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Listing
        </button>
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
            { id: 'listings', label: 'My Listings' },
            { id: 'inquiries', label: `Inquiries (${sampleInquiries.filter(i => !i.read).length})` },
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

      {/* Tab content */}
      {tab === 'listings' && !showForm && (
        <div className="space-y-4">
          {sampleListings.map((listing) => (
            <div key={listing.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold truncate">{listing.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      listing.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      listing.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><DollarSign size={14} />{formatCurrency(listing.price)}</span>
                    <span className="flex items-center gap-1"><TrendingUp size={14} />{formatCurrency(listing.revenue)}/mo</span>
                    <span className="flex items-center gap-1"><Users size={14} />{formatNumber(listing.visitors)} visits/mo</span>
                    <span className="flex items-center gap-1"><Eye size={14} />{listing.views} views</span>
                    <span className="flex items-center gap-1"><MessageSquare size={14} />{listing.inquiries} inquiries</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link to={`/listings/${listing.id}`} className="p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 transition-all">
                    <Eye size={18} />
                  </Link>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 transition-all">
                    <Edit3 size={18} />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'inquiries' && (
        <div className="space-y-3">
          {sampleInquiries.map((inq) => (
            <div key={inq.id} className={`card p-5 ${!inq.read ? 'border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-950/20' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                    {inq.buyer[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-medium">{inq.buyer}</span>
                    {!inq.read && <span className="ml-2 w-2 h-2 rounded-full bg-brand-500 inline-block" />}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{inq.date}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Regarding: <Link to="/listings/1" className="text-brand-500 hover:underline">{inq.listing}</Link>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{inq.message}</p>
              <div className="flex gap-2">
                <button className="text-xs btn-primary py-1.5 px-3">Reply</button>
                <button className="text-xs btn-secondary py-1.5 px-3">Mark Read</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Listing Form */}
      {showForm && (
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Create New Listing</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Listing Title</label>
              <input type="text" className="input-field" placeholder="e.g., SaaS Analytics Dashboard" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea className="input-field h-32 resize-none" placeholder="Describe your website in detail..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select className="input-field">
                <option>SaaS</option>
                <option>E-commerce</option>
                <option>Content</option>
                <option>Blog</option>
                <option>Newsletter</option>
                <option>Marketplace</option>
                <option>Tool</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Niche</label>
              <input type="text" className="input-field" placeholder="e.g., Analytics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Asking Price ($)</label>
              <input type="number" className="input-field" placeholder="50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Monthly Revenue ($)</label>
              <input type="number" className="input-field" placeholder="5000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Monthly Profit ($)</label>
              <input type="number" className="input-field" placeholder="2500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Monthly Visitors</label>
              <input type="number" className="input-field" placeholder="50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Website URL</label>
              <input type="url" className="input-field" placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Year Founded</label>
              <input type="number" className="input-field" placeholder="2022" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Technology Stack</label>
              <input type="text" className="input-field" placeholder="React, Node.js, PostgreSQL (comma separated)" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Create Listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}