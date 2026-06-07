import { useState } from 'react';
import { BarChart3, Globe, TrendingUp, DollarSign, Users, Zap, Shield, ArrowRight, Sparkles, Download, RefreshCw } from 'lucide-react';
import { formatCurrency, formatNumber } from '../lib/api';

export default function Valuation() {
  const [url, setUrl] = useState('');
  const [revenue, setRevenue] = useState('');
  const [traffic, setTraffic] = useState('');
  const [niche, setNiche] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValuate = () => {
    setLoading(true);
    // Simulate AI valuation
    setTimeout(() => {
      const monthlyRevenue = parseFloat(revenue) || 5000;
      const monthlyTraffic = parseFloat(traffic) || 50000;
      const multiple = niche === 'SaaS' ? 4.2 : niche === 'E-commerce' ? 2.8 : niche === 'Content' ? 3.5 : 3.0;
      const estimatedValue = monthlyRevenue * 12 * multiple;
      const profitEstimate = monthlyRevenue * 0.55;

      setResult({
        estimatedValue,
        range: { low: estimatedValue * 0.85, high: estimatedValue * 1.15 },
        monthlyRevenue,
        monthlyTraffic,
        profitEstimate,
        multiple,
        confidence: Math.min(85 + Math.random() * 12, 96),
        metrics: {
          revenueMultiple: multiple,
          growthRate: 12 + Math.random() * 18,
          profitMargin: 55 + Math.random() * 15,
          valuationScore: 70 + Math.random() * 25,
        },
        recommendations: [
          'Improve SEO to increase organic traffic by 20%+',
          'Diversify revenue streams to reduce dependency',
          'Build email list for better monetization',
          'Optimize conversion funnel to boost revenue',
        ],
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 mb-4">
          <Sparkles size={14} className="text-brand-500" />
          <span className="text-sm font-medium text-brand-700 dark:text-brand-300">AI-Powered Valuation</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Know what your <span className="gradient-text">website is worth</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Our AI analyzes traffic, revenue, niche, and market data to give you an accurate valuation in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
        {/* Form */}
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Enter your website details</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Website URL</label>
              <div className="relative">
                <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  className="input-field pl-10"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Monthly Revenue ($)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="5000"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Monthly Traffic</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="50000"
                  value={traffic}
                  onChange={(e) => setTraffic(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Niche / Category</label>
                <select className="input-field" value={niche} onChange={(e) => setNiche(e.target.value)}>
                  <option value="">Select niche</option>
                  <option value="SaaS">SaaS</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Content">Content / Blog</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Tool">Tool / Software</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Years in Operation</label>
                <select className="input-field" value={age} onChange={(e) => setAge(e.target.value)}>
                  <option value="">Select age</option>
                  <option value="<1">Less than 1 year</option>
                  <option value="1-2">1–2 years</option>
                  <option value="2-5">2–5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleValuate}
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Value My Website
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        <div>
          {!result && !loading && (
            <div className="card p-8 text-center h-full flex flex-col items-center justify-center">
              <BarChart3 size={64} className="text-slate-200 dark:text-slate-700 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your valuation will appear here</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fill out the form and click "Value My Website" to get an AI-powered estimate.
              </p>
            </div>
          )}

          {loading && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center animate-pulse">
                <Sparkles size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyzing your website...</h3>
              <div className="space-y-2">
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full gradient-bg rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: '40%' }} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">Comparing with market data...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-fade-in">
              {/* Main valuation */}
              <div className="card p-6 text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Estimated Value Range</div>
                <div className="text-sm text-slate-400">
                  {formatCurrency(result.range.low)} – {formatCurrency(result.range.high)}
                </div>
                <div className="text-4xl md:text-5xl font-bold gradient-text my-3">
                  {formatCurrency(result.estimatedValue)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield size={16} className="text-green-500" />
                  <span className="text-sm text-slate-500">Confidence: {Math.round(result.confidence)}%</span>
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-brand-500" />
                    <span className="text-xs text-slate-400">Monthly Revenue</span>
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(result.monthlyRevenue)}</div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-blue-500" />
                    <span className="text-xs text-slate-400">Monthly Traffic</span>
                  </div>
                  <div className="text-lg font-bold">{formatNumber(result.monthlyTraffic)}</div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-xs text-slate-400">Revenue Multiple</span>
                  </div>
                  <div className="text-lg font-bold">{result.multiple}x</div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={16} className="text-purple-500" />
                    <span className="text-xs text-slate-400">Profit Estimate</span>
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(result.profitEstimate)}</div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap size={16} className="text-brand-500" /> Recommendations
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-brand-500 mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Get Full Report <Download size={16} />
                </button>
                <button onClick={() => setResult(null)} className="btn-secondary flex items-center justify-center gap-2">
                  <RefreshCw size={16} /> Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: Zap, title: 'AI-Powered', desc: 'Machine learning models trained on thousands of real transactions' },
          { icon: Globe, title: 'Market Data', desc: 'Real-time market comparables and industry benchmarks' },
          { icon: Shield, title: 'Investor Grade', desc: 'Detailed report ready for due diligence and negotiations' },
        ].map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.title} className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center mx-auto mb-3">
                <Icon size={24} className="text-brand-500" />
              </div>
              <h3 className="font-semibold mb-1">{feat.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}