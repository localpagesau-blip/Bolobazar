const express = require('express');
const { db } = require('../utils/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/admin/stats
 * Get platform statistics (admin only).
 */
router.get('/stats', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const totalUsers = db('SELECT COUNT(*) as count FROM users')[0]?.count || 0;
    const totalListings = db("SELECT COUNT(*) as count FROM listings WHERE status = 'active'")[0]?.count || 0;
    const totalTransactions = db("SELECT COUNT(*) as count FROM transactions WHERE status = 'completed'")[0]?.count || 0;
    const totalInquiries = db('SELECT COUNT(*) as count FROM inquiries')[0]?.count || 0;
    const totalRevenue = db("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'")[0]?.total || 0;

    const recentListings = db(`
      SELECT l.*, u.name as seller_name FROM listings l
      LEFT JOIN users u ON l.seller_id = u.id
      ORDER BY l.created_at DESC LIMIT 10
    `);

    const recentUsers = db('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT 10');

    res.json({
      stats: {
        totalUsers,
        totalListings,
        totalTransactions,
        totalInquiries,
        totalRevenue,
      },
      recentListings,
      recentUsers,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * GET /api/admin/users
 * List all users (admin only).
 */
router.get('/users', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const users = db('SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * PATCH /api/admin/users/:id/role
 * Update user role (admin only).
 */
router.patch('/users/:id/role', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { role } = req.body;
    if (!['buyer', 'seller', 'both', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const now = new Date().toISOString();
    db(`UPDATE users SET role = '${role}', updated_at = '${now}' WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    res.json({ message: 'User role updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

/**
 * GET /api/admin/listings
 * List all listings (admin only).
 */
router.get('/listings', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const listings = db(`
      SELECT l.*, u.name as seller_name, u.email as seller_email
      FROM listings l
      LEFT JOIN users u ON l.seller_id = u.id
      ORDER BY l.created_at DESC
    `);
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

/**
 * GET /api/admin/transactions
 * List all transactions (admin only).
 */
router.get('/transactions', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const transactions = db(`
      SELECT t.*, l.title as listing_title,
        buyer.name as buyer_name, seller.name as seller_name
      FROM transactions t
      LEFT JOIN listings l ON t.listing_id = l.id
      LEFT JOIN users buyer ON t.buyer_id = buyer.id
      LEFT JOIN users seller ON t.seller_id = seller.id
      ORDER BY t.created_at DESC
    `);
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * GET /api/admin/payments
 * List all payments (admin only).
 */
router.get('/payments', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const payments = db(`
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;