const express = require('express');
const { db } = require('../utils/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/inquiries
 * Create an inquiry about a listing (buyer contacts seller).
 */
router.post('/', authenticate, (req, res) => {
  try {
    const { listingId, message } = req.body;

    if (!listingId || !message) {
      return res.status(400).json({ error: 'Listing ID and message are required' });
    }

    // Check listing exists
    const listings = db(`SELECT * FROM listings WHERE id = '${listingId.replace(/'/g, "''")}'`);
    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listings[0].seller_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot inquire about your own listing' });
    }

    const id = require('uuid').v4();
    const now = new Date().toISOString();

    db(`
      INSERT INTO inquiries (id, listing_id, buyer_id, seller_id, message, status, created_at, updated_at)
      VALUES (
        '${id}',
        '${listingId.replace(/'/g, "''")}',
        '${req.user.id}',
        '${listings[0].seller_id}',
        '${message.replace(/'/g, "''")}',
        'pending',
        '${now}',
        '${now}'
      )
    `);

    res.status(201).json({ message: 'Inquiry sent successfully', inquiryId: id });
  } catch (err) {
    console.error('Create inquiry error:', err);
    res.status(500).json({ error: 'Failed to send inquiry' });
  }
});

/**
 * GET /api/inquiries
 * Get inquiries for the current user.
 * - Sellers see inquiries they received
 * - Buyers see inquiries they sent
 */
router.get('/', authenticate, (req, res) => {
  try {
    const role = req.query.role || 'all';

    let conditions;
    if (role === 'received') {
      conditions = `seller_id = '${req.user.id}'`;
    } else if (role === 'sent') {
      conditions = `buyer_id = '${req.user.id}'`;
    } else {
      conditions = `seller_id = '${req.user.id}' OR buyer_id = '${req.user.id}'`;
    }

    const inquiries = db(`
      SELECT i.*, 
        l.title as listing_title, l.price as listing_price,
        buyer.name as buyer_name, buyer.email as buyer_email,
        seller.name as seller_name, seller.email as seller_email
      FROM inquiries i
      LEFT JOIN listings l ON i.listing_id = l.id
      LEFT JOIN users buyer ON i.buyer_id = buyer.id
      LEFT JOIN users seller ON i.seller_id = seller.id
      WHERE ${conditions}
      ORDER BY i.created_at DESC
    `);

    res.json({ inquiries });
  } catch (err) {
    console.error('Get inquiries error:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

/**
 * PATCH /api/inquiries/:id/status
 * Update inquiry status (seller can mark as read/replied/closed).
 */
router.patch('/:id/status', authenticate, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'read', 'replied', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid: ${validStatuses.join(', ')}` });
    }

    const inquiries = db(`SELECT * FROM inquiries WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    if (inquiries.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (inquiries[0].seller_id !== req.user.id && inquiries[0].buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this inquiry' });
    }

    const now = new Date().toISOString();
    db(`UPDATE inquiries SET status = '${status.replace(/'/g, "''")}', updated_at = '${now}' WHERE id = '${req.params.id.replace(/'/g, "''")}'`);

    res.json({ message: `Inquiry marked as ${status}` });
  } catch (err) {
    console.error('Update inquiry error:', err);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

/**
 * POST /api/inquiries/:id/reply
 * Reply to an inquiry.
 */
router.post('/:id/reply', authenticate, (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const inquiries = db(`SELECT * FROM inquiries WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    if (inquiries.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (inquiries[0].seller_id !== req.user.id && inquiries[0].buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to reply to this inquiry' });
    }

    const id = require('uuid').v4();
    const now = new Date().toISOString();

    db(`
      INSERT INTO inquiry_messages (id, inquiry_id, sender_id, message, created_at)
      VALUES ('${id}', '${req.params.id.replace(/'/g, "''")}', '${req.user.id}', '${message.replace(/'/g, "''")}', '${now}')
    `);

    // Update inquiry status
    db(`UPDATE inquiries SET status = 'replied', updated_at = '${now}' WHERE id = '${req.params.id.replace(/'/g, "''")}'`);

    res.status(201).json({ message: 'Reply sent successfully', replyId: id });
  } catch (err) {
    console.error('Reply to inquiry error:', err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

/**
 * GET /api/inquiries/:id/messages
 * Get all messages for an inquiry thread.
 */
router.get('/:id/messages', authenticate, (req, res) => {
  try {
    const inquiries = db(`SELECT * FROM inquiries WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    if (inquiries.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (inquiries[0].seller_id !== req.user.id && inquiries[0].buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = db(`
      SELECT m.*, u.name as sender_name
      FROM inquiry_messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.inquiry_id = '${req.params.id.replace(/'/g, "''")}'
      ORDER BY m.created_at ASC
    `);

    res.json({ messages });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;