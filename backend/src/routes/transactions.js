const express = require('express');
const { db } = require('../utils/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/transactions/initiate
 * Initiate a transaction/escrow for a listing.
 * This is a stub — integrates with escrow service in production.
 */
router.post('/initiate', authenticate, (req, res) => {
  try {
    const { listingId, buyerId } = req.body;

    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' });
    }

    const listings = db(`SELECT * FROM listings WHERE id = '${listingId.replace(/'/g, "''")}'`);
    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = listings[0];

    // Verify the requester is the seller or admin
    if (listing.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only the seller can initiate a transaction' });
    }

    const id = require('uuid').v4();
    const now = new Date().toISOString();
    const status = 'pending';

    db(`
      INSERT INTO transactions (id, listing_id, seller_id, buyer_id, amount, status, created_at, updated_at)
      VALUES (
        '${id}',
        '${listingId.replace(/'/g, "''")}',
        '${listing.seller_id}',
        '${(buyerId || '').replace(/'/g, "''")}',
        ${listing.price},
        '${status}',
        '${now}',
        '${now}'
      )
    `);

    res.status(201).json({
      message: 'Transaction initiated',
      transaction: {
        id,
        listingId: listing.id,
        listingTitle: listing.title,
        amount: listing.price,
        status,
        escrowNote: 'Funds will be held in escrow until transfer is confirmed by both parties.',
      },
    });
  } catch (err) {
    console.error('Initiate transaction error:', err);
    res.status(500).json({ error: 'Failed to initiate transaction' });
  }
});

/**
 * GET /api/transactions
 * Get transactions for the current user.
 */
router.get('/', authenticate, (req, res) => {
  try {
    const transactions = db(`
      SELECT t.*, l.title as listing_title, l.price as listing_price,
        buyer.name as buyer_name, seller.name as seller_name
      FROM transactions t
      LEFT JOIN listings l ON t.listing_id = l.id
      LEFT JOIN users buyer ON t.buyer_id = buyer.id
      LEFT JOIN users seller ON t.seller_id = seller.id
      WHERE t.seller_id = '${req.user.id}' OR t.buyer_id = '${req.user.id}'
      ORDER BY t.created_at DESC
    `);
    res.json({ transactions });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * PATCH /api/transactions/:id/status
 * Update transaction status (escrow flow steps).
 */
router.patch('/:id/status', authenticate, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'funded', 'in_transfer', 'completed', 'cancelled', 'disputed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid: ${validStatuses.join(', ')}` });
    }

    const transactions = db(`SELECT * FROM transactions WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const txn = transactions[0];
    if (txn.seller_id !== req.user.id && txn.buyer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const now = new Date().toISOString();
    db(`UPDATE transactions SET status = '${status.replace(/'/g, "''")}', updated_at = '${now}' WHERE id = '${req.params.id.replace(/'/g, "''")}'`);

    // If completed, update listing status
    if (status === 'completed') {
      db(`UPDATE listings SET status = 'sold', updated_at = '${now}' WHERE id = '${txn.listing_id}'`);
    }

    res.json({ message: `Transaction status updated to ${status}` });
  } catch (err) {
    console.error('Update transaction error:', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

/**
 * GET /api/transactions/disputes
 * Get disputes (admin only).
 */
router.get('/disputes', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const disputes = db("SELECT * FROM transactions WHERE status = 'disputed' ORDER BY updated_at DESC");
    res.json({ disputes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
});

module.exports = router;