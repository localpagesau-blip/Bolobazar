require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const { execSync } = require('child_process');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const valuationRoutes = require('./routes/valuation');
const paymentRoutes = require('./routes/payments');
const inquiryRoutes = require('./routes/inquiries');
const transactionRoutes = require('./routes/transactions');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');

// ── Auto-initialize database on startup ──
function autoInitDb() {
  try {
    const out = execSync(`team-db "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"`, {
      encoding: 'utf-8', timeout: 10000,
    });
    const tables = JSON.parse(out.trim() || '[]');
    if (tables.length === 0) {
      console.log('[DB] Tables not found, running init...');
      execSync('node src/init-db.js', { stdio: 'inherit', cwd: __dirname + '/..' });
      console.log('[DB] Initialization complete.');
    } else {
      console.log('[DB] Tables exist, skipping init.');
    }
  } catch (err) {
    console.error('[DB] Init check failed:', err.message);
    console.log('[DB] Attempting init anyway...');
    try {
      execSync('node src/init-db.js', { stdio: 'inherit', cwd: __dirname + '/..' });
    } catch (_) { console.error('[DB] Init also failed.'); }
  }
}
autoInitDb();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/valuation', valuationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, HOST, () => {
  console.log(`SiteFlip API running on http://${HOST}:${PORT}`);
});

module.exports = app;
