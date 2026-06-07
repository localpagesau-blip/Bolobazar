const express = require('express');
const { db } = require('../utils/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/valuation
 * AI-powered website valuation based on inputs.
 * Returns a mock valuation with detailed breakdown.
 * In production, this would call an LLM or valuation model.
 */
router.post('/', authenticate, (req, res) => {
  try {
    const { url, monthlyRevenue, monthlyTraffic, yearEstablished, niche, employees, expenses } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Website URL is required' });
    }

    const revenue = parseFloat(monthlyRevenue) || 0;
    const traffic = parseInt(monthlyTraffic) || 0;
    const years = yearEstablished ? (new Date().getFullYear() - parseInt(yearEstablished)) : 0;

    // Simple valuation algorithm (mock AI)
    // Multiples-based: 24-48x monthly revenue for growing sites
    let multiple = 24; // base multiple
    if (revenue > 0) {
      // Higher revenue = higher multiple (up to 48x)
      multiple += Math.min(12, Math.floor(revenue / 1000));
    }
    if (traffic > 50000) multiple += 3;
    if (traffic > 10000) multiple += 2;
    if (traffic > 1000) multiple += 1;
    if (years > 3) multiple += 3;
    if (years > 1) multiple += 1;

    const baseValuation = revenue * multiple;
    const trafficValue = traffic * 0.5; // $0.50 per monthly visitor
    const ageBonus = years * 200;
    const estimatedValue = Math.round((baseValuation + trafficValue + ageBonus) * 100) / 100;

    // Generate confidence score
    const confidence = revenue > 0 ? Math.min(95, 40 + Math.floor(revenue / 500) + (traffic > 1000 ? 10 : 0)) : 35;

    // Generate comparable sites
    const comparables = [
      { url: 'example-store.com', revenue: Math.round(revenue * 0.7), traffic: Math.round(traffic * 0.8), soldPrice: Math.round(estimatedValue * 0.8) },
      { url: 'similar-blog.net', revenue: Math.round(revenue * 1.2), traffic: Math.round(traffic * 1.1), soldPrice: Math.round(estimatedValue * 1.15) },
      { url: 'market-leader.io', revenue: Math.round(revenue * 1.5), traffic: Math.round(traffic * 1.8), soldPrice: Math.round(estimatedValue * 1.4) },
    ];

    res.json({
      valuation: {
        url,
        estimatedValue,
        monthlyRevenue: revenue,
        monthlyTraffic: traffic,
        yearsEstablished: Math.max(0, years),
        multiple: multiple,
        confidence: `${confidence}%`,
        breakdown: {
          revenueMultiple: Math.round(baseValuation),
          trafficValue: Math.round(trafficValue),
          ageBonus: Math.round(ageBonus),
          totalEstimated: estimatedValue,
        },
        comparables,
        disclaimer: 'This is an AI-powered estimate for informational purposes only. Not financial advice.',
      },
    });
  } catch (err) {
    console.error('Valuation error:', err);
    res.status(500).json({ error: 'Valuation failed' });
  }
});

/**
 * GET /api/valuation/history
 * Get user's valuation history.
 */
router.get('/history', authenticate, (req, res) => {
  try {
    const history = db(`SELECT * FROM valuation_history WHERE user_id = '${req.user.id}' ORDER BY created_at DESC LIMIT 20`);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * POST /api/valuation/save
 * Save a valuation to history.
 */
router.post('/save', authenticate, (req, res) => {
  try {
    const { url, estimatedValue, monthlyRevenue, monthlyTraffic, breakdown } = req.body;
    const id = require('uuid').v4();
    const now = new Date().toISOString();
    db(`
      INSERT INTO valuation_history (id, user_id, url, estimated_value, monthly_revenue, monthly_traffic, breakdown, created_at)
      VALUES ('${id}', '${req.user.id}', '${(url || '').replace(/'/g, "''")}', ${estimatedValue || 0}, ${monthlyRevenue || 0}, ${monthlyTraffic || 0}, '${(JSON.stringify(breakdown || {})).replace(/'/g, "''")}', '${now}')
    `);
    res.status(201).json({ message: 'Valuation saved', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save valuation' });
  }
});

module.exports = router;