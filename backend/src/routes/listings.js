const express = require('express');
const { db } = require('../utils/db');
const { authenticate, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * GET /api/listings
 * List all listings with optional filters, search, and pagination.
 * Query params: search, category, minPrice, maxPrice, status, sort, page, limit, featured
 */
router.get('/', optionalAuth, (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      status,
      sort = 'newest',
      page = 1,
      limit = 20,
      featured,
      sellerId,
    } = req.query;

    let conditions = ["l.status = 'active'"];
    let params = [];

    if (search) {
      const s = search.replace(/'/g, "''");
      conditions.push(`(l.title LIKE '%${s}%' OR l.description LIKE '%${s}%')`);
    }

    if (category) {
      conditions.push(`l.category = '${category.replace(/'/g, "''")}'`);
    }

    if (minPrice) {
      conditions.push(`l.price >= ${parseFloat(minPrice)}`);
    }

    if (maxPrice) {
      conditions.push(`l.price <= ${parseFloat(maxPrice)}`);
    }

    if (status && status !== 'all') {
      conditions.push(`l.status = '${status.replace(/'/g, "''")}'`);
    }

    if (featured === 'true') {
      conditions.push("l.is_featured = 1");
    }

    if (sellerId) {
      conditions.push(`l.seller_id = '${sellerId.replace(/'/g, "''")}'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderClause = 'ORDER BY l.created_at DESC';
    if (sort === 'price_asc') orderClause = 'ORDER BY l.price ASC';
    else if (sort === 'price_desc') orderClause = 'ORDER BY l.price DESC';
    else if (sort === 'oldest') orderClause = 'ORDER BY l.created_at ASC';
    else if (sort === 'featured') orderClause = 'ORDER BY l.is_featured DESC, l.created_at DESC';

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Count total
    const countResult = db(`SELECT COUNT(*) as total FROM listings l ${whereClause}`);
    const total = countResult[0]?.total || 0;

    // Fetch listings
    const listings = db(`
      SELECT l.*, u.name as seller_name, u.email as seller_email
      FROM listings l
      LEFT JOIN users u ON l.seller_id = u.id
      ${whereClause}
      ${orderClause}
      LIMIT ${limitNum} OFFSET ${offset}
    `);

    res.json({
      listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('List listings error:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

/**
 * GET /api/listings/:id
 * Get a single listing by ID.
 */
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const listings = db(`
      SELECT l.*, u.name as seller_name, u.email as seller_email
      FROM listings l
      LEFT JOIN users u ON l.seller_id = u.id
      WHERE l.id = '${req.params.id.replace(/'/g, "''")}'
    `);
    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    const listing = listings[0];

    // Get screenshots
    const screenshots = db(`SELECT id, file_path FROM listing_screenshots WHERE listing_id = '${req.params.id.replace(/'/g, "''")}'`);
    listing.screenshots = screenshots;

    res.json({ listing });
  } catch (err) {
    console.error('Get listing error:', err);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

/**
 * POST /api/listings
 * Create a new listing (authenticated).
 */
router.post('/', authenticate, upload.array('screenshots', 10), (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      monthlyRevenue,
      monthlyTraffic,
      yearEstablished,
      reasonForSelling,
      techStack,
    } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ error: 'Title, description, and price are required' });
    }

    const id = require('uuid').v4();
    const now = new Date().toISOString();

    db(`
      INSERT INTO listings (id, seller_id, title, description, price, category, monthly_revenue, monthly_traffic, year_established, reason_for_selling, tech_stack, status, is_featured, created_at, updated_at)
      VALUES (
        '${id}',
        '${req.user.id}',
        '${title.replace(/'/g, "''")}',
        '${description.replace(/'/g, "''")}',
        ${parseFloat(price)},
        ${category ? `'${category.replace(/'/g, "''")}'` : 'NULL'},
        ${monthlyRevenue ? parseFloat(monthlyRevenue) : 'NULL'},
        ${monthlyTraffic ? parseInt(monthlyTraffic) : 'NULL'},
        ${yearEstablished ? parseInt(yearEstablished) : 'NULL'},
        ${reasonForSelling ? `'${reasonForSelling.replace(/'/g, "''")}'` : 'NULL'},
        ${techStack ? `'${techStack.replace(/'/g, "''")}'` : 'NULL'},
        'active',
        0,
        '${now}',
        '${now}'
      )
    `);

    // Save screenshots
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const sid = require('uuid').v4();
        db(`
          INSERT INTO listing_screenshots (id, listing_id, file_path, created_at)
          VALUES ('${sid}', '${id}', '/uploads/${file.filename}', '${now}')
        `);
      }
    }

    // Count listings for this seller to check free tier enforcement
    const countResult = db(`SELECT COUNT(*) as cnt FROM listings WHERE seller_id = '${req.user.id}'`);
    const listingCount = countResult[0]?.cnt || 0;

    const listing = db(`SELECT * FROM listings WHERE id = '${id}'`)[0];

    res.status(201).json({
      message: 'Listing created successfully',
      listing,
      freeListingRemaining: listingCount >= 1 ? 0 : 1,
    });
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

/**
 * PUT /api/listings/:id
 * Update a listing (owner only).
 */
router.put('/:id', authenticate, upload.array('screenshots', 10), (req, res) => {
  try {
    const existing = db(`SELECT * FROM listings WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (existing[0].seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const fields = ['title', 'description', 'price', 'category', 'monthly_revenue', 'monthly_traffic', 'year_established', 'reason_for_selling', 'tech_stack', 'status'];
    const updates = [];
    const now = new Date().toISOString();

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        const val = req.body[field];
        if (['price', 'monthly_revenue'].includes(field)) {
          updates.push(`${field} = ${parseFloat(val)}`);
        } else if (['monthly_traffic', 'year_established'].includes(field)) {
          updates.push(`${field} = ${parseInt(val)}`);
        } else {
          updates.push(`${field} = '${String(val).replace(/'/g, "''")}'`);
        }
      }
    }

    if (updates.length > 0) {
      updates.push(`updated_at = '${now}'`);
      db(`
        UPDATE listings SET ${updates.join(', ')}
        WHERE id = '${req.params.id.replace(/'/g, "''")}'
      `);
    }

    // Handle new screenshots
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const sid = require('uuid').v4();
        db(`
          INSERT INTO listing_screenshots (id, listing_id, file_path, created_at)
          VALUES ('${sid}', '${req.params.id.replace(/'/g, "''")}', '/uploads/${file.filename}', '${now}')
        `);
      }
    }

    const listing = db(`SELECT * FROM listings WHERE id = '${req.params.id.replace(/'/g, "''")}'`)[0];
    res.json({ message: 'Listing updated successfully', listing });
  } catch (err) {
    console.error('Update listing error:', err);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

/**
 * DELETE /api/listings/:id
 * Delete a listing (owner or admin).
 */
router.delete('/:id', authenticate, (req, res) => {
  try {
    const existing = db(`SELECT * FROM listings WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (existing[0].seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    db(`DELETE FROM listing_screenshots WHERE listing_id = '${req.params.id.replace(/'/g, "''")}'`);
    db(`DELETE FROM inquiries WHERE listing_id = '${req.params.id.replace(/'/g, "''")}'`);
    db(`DELETE FROM listings WHERE id = '${req.params.id.replace(/'/g, "''")}'`);

    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Delete listing error:', err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

/**
 * PATCH /api/listings/:id/feature
 * Toggle featured status (admin only).
 */
router.patch('/:id/feature', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const existing = db(`SELECT * FROM listings WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    const newFeatured = existing[0].is_featured ? 0 : 1;
    const now = new Date().toISOString();
    db(`UPDATE listings SET is_featured = ${newFeatured}, updated_at = '${now}' WHERE id = '${req.params.id.replace(/'/g, "''")}'`);
    res.json({ message: `Listing ${newFeatured ? 'featured' : 'unfeatured'}`, is_featured: newFeatured });
  } catch (err) {
    console.error('Feature listing error:', err);
    res.status(500).json({ error: 'Failed to update featured status' });
  }
});

/**
 * GET /api/listings/categories
 * Get distinct listing categories.
 */
router.get('/meta/categories', (req, res) => {
  try {
    const result = db("SELECT DISTINCT category FROM listings WHERE category IS NOT NULL AND status = 'active' ORDER BY category");
    const categories = result.map(r => r.category).filter(Boolean);
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;