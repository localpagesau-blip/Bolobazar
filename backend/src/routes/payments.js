const express = require('express');
const { db } = require('../utils/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/payments/create-payment-intent
 * Create a Stripe payment intent for featured listing or success fee.
 * NOTE: This is a stub — integrate with Stripe SDK when keys are configured.
 */
router.post('/create-payment-intent', authenticate, async (req, res) => {
  try {
    const { type, listingId } = req.body;

    // Pricing tiers
    const prices = {
      featured_weekly: 2900,   // $29.00
      featured_monthly: 9900,  // $99.00
      success_fee: null,       // Calculated from listing price
    };

    if (!type || !prices[type]) {
      return res.status(400).json({ error: 'Invalid payment type. Valid types: featured_weekly, featured_monthly, success_fee' });
    }

    let amount = prices[type];

    // For success fee, calculate 7% of listing price (capped)
    if (type === 'success_fee' && listingId) {
      const listings = db(`SELECT price FROM listings WHERE id = '${listingId.replace(/'/g, "''")}'`);
      if (listings.length === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      const price = listings[0].price;
      amount = Math.round(price * 0.07 * 100); // 7% in cents
      // Cap at $5000 USD
      amount = Math.min(amount, 500000);
    }

    // If Stripe is configured, create actual payment intent
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
          metadata: {
            type,
            userId: req.user.id,
            listingId: listingId || '',
          },
        });
        return res.json({
          clientSecret: paymentIntent.client_secret,
          amount,
          paymentIntentId: paymentIntent.id,
        });
      } catch (stripeErr) {
        console.error('Stripe error:', stripeErr);
        // Fall through to mock response
      }
    }

    // Mock response for development
    const id = require('uuid').v4();
    res.json({
      clientSecret: `pi_mock_${id}_secret_mock`,
      amount,
      paymentIntentId: `pi_mock_${id}`,
      mock: true,
      message: 'Mock payment intent. Set STRIPE_SECRET_KEY for real payments.',
    });
  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

/**
 * POST /api/payments/confirm
 * Mock payment confirmation endpoint.
 */
router.post('/confirm', authenticate, (req, res) => {
  try {
    const { paymentIntentId, type, listingId } = req.body;

    if (type === 'featured_weekly' || type === 'featured_monthly') {
      const now = new Date().toISOString();
      const expiresAt = type === 'featured_weekly'
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      db(`
        UPDATE listings SET is_featured = 1, featured_expires_at = '${expiresAt}', updated_at = '${now}'
        WHERE id = '${(listingId || '').replace(/'/g, "''")}' AND seller_id = '${req.user.id}'
      `);
    }

    // Record payment
    const id = require('uuid').v4();
    const now = new Date().toISOString();
    db(`
      INSERT INTO payments (id, user_id, listing_id, amount, type, status, created_at)
      VALUES ('${id}', '${req.user.id}', '${(listingId || '').replace(/'/g, "''")}', ${req.body.amount || 0}, '${(type || '').replace(/'/g, "''")}', 'completed', '${now}')
    `);

    res.json({ message: 'Payment confirmed successfully', paymentId: id });
  } catch (err) {
    console.error('Payment confirm error:', err);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

/**
 * GET /api/payments/history
 * Get user's payment history.
 */
router.get('/history', authenticate, (req, res) => {
  try {
    const payments = db(`SELECT * FROM payments WHERE user_id = '${req.user.id}' ORDER BY created_at DESC`);
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

/**
 * GET /api/payments/pricing
 * Get pricing tiers.
 */
router.get('/pricing', (req, res) => {
  res.json({
    tiers: [
      { id: 'free', name: 'Free', price: 0, listings: 1, featured: false, description: 'List 1 site with basic details' },
      { id: 'featured_weekly', name: 'Featured Weekly', price: 2900, listings: 1, featured: true, duration: '7 days', description: 'Featured on homepage for 7 days' },
      { id: 'featured_monthly', name: 'Featured Monthly', price: 9900, listings: 1, featured: true, duration: '30 days', description: 'Featured on homepage for 30 days' },
    ],
    successFee: { rate: 7, cap: 5000, description: '7% success fee on completed sales, capped at $5,000' },
  });
});

module.exports = router;