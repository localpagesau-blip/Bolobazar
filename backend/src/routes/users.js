const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../utils/db');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * GET /api/users/profile
 * Get current user profile with stats.
 */
router.get('/profile', authenticate, (req, res) => {
  try {
    const user = db(`SELECT id, email, name, role, bio, avatar_url, created_at, updated_at FROM users WHERE id = '${req.user.id}'`)[0];

    // Count their listings
    const listingCount = db(`SELECT COUNT(*) as count FROM listings WHERE seller_id = '${req.user.id}'`)[0]?.count || 0;
    // Count active inquiries
    const inquiryCount = db(`SELECT COUNT(*) as count FROM inquiries WHERE seller_id = '${req.user.id}' AND status != 'closed'`)[0]?.count || 0;
    // Count completed transactions
    const transactionCount = db(`SELECT COUNT(*) as count FROM transactions WHERE (seller_id = '${req.user.id}' OR buyer_id = '${req.user.id}') AND status = 'completed'`)[0]?.count || 0;

    res.json({
      user: {
        ...user,
        stats: {
          listings: listingCount,
          activeInquiries: inquiryCount,
          completedTransactions: transactionCount,
        },
      },
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/users/profile
 * Update user profile.
 */
router.put('/profile', authenticate, upload.single('avatar'), (req, res) => {
  try {
    const { name, bio } = req.body;
    const updates = [];
    const now = new Date().toISOString();

    if (name) updates.push(`name = '${name.replace(/'/g, "''")}'`);
    if (bio !== undefined) updates.push(`bio = '${bio.replace(/'/g, "''")}'`);
    if (req.file) updates.push(`avatar_url = '/uploads/${req.file.filename}'`);

    if (updates.length > 0) {
      updates.push(`updated_at = '${now}'`);
      db(`UPDATE users SET ${updates.join(', ')} WHERE id = '${req.user.id}'`);
    }

    const user = db(`SELECT id, email, name, role, bio, avatar_url, created_at FROM users WHERE id = '${req.user.id}'`)[0];
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * PUT /api/users/password
 * Update password.
 */
router.put('/password', authenticate, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const users = db(`SELECT * FROM users WHERE id = '${req.user.id}'`);
    if (!bcrypt.compareSync(currentPassword, users[0].password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    const now = new Date().toISOString();
    db(`UPDATE users SET password = '${hashed}', updated_at = '${now}' WHERE id = '${req.user.id}'`);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

/**
 * GET /api/users/:id
 * Get a user's public profile.
 */
router.get('/:id', (req, res) => {
  try {
    const users = db(`SELECT id, email, name, role, bio, avatar_url, created_at FROM users WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: users[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;