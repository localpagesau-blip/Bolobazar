/**
 * SiteFlip Database Initialization Script
 * 
 * Run: node src/init-db.js
 * 
 * Creates all required tables and seeds demo data via team-db CLI.
 */

const { execSync } = require('child_process');

function db(sql) {
  try {
    const escaped = sql.replace(/"/g, '\\"');
    const output = execSync(`team-db "${escaped}"`, {
      encoding: 'utf-8',
      timeout: 15000,
    });
    const trimmed = output.trim();
    if (trimmed) {
      try { return JSON.parse(trimmed); } catch (_) { return []; }
    }
    return [];
  } catch (err) {
    console.error('DB Error:', err.message.substring(0, 200));
    process.exit(1);
  }
}

console.log('=== SiteFlip Database Initialization ===\n');

// ──────────────────────────────────────────────────
// 1. Create tables
// ──────────────────────────────────────────────────
console.log('Creating tables...');

db(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'both',
  bio TEXT DEFAULT '',
  avatar_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`);
console.log('  ✓ users');

db(`CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT,
  monthly_revenue REAL,
  monthly_traffic INTEGER,
  year_established INTEGER,
  reason_for_selling TEXT,
  tech_stack TEXT,
  status TEXT DEFAULT 'active',
  is_featured INTEGER DEFAULT 0,
  featured_expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (seller_id) REFERENCES users(id)
)`);
console.log('  ✓ listings');

db(`CREATE TABLE IF NOT EXISTS listing_screenshots (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id)
)`);
console.log('  ✓ listing_screenshots');

db(`CREATE TABLE IF NOT EXISTS valuation_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  url TEXT,
  estimated_value REAL,
  monthly_revenue REAL,
  monthly_traffic INTEGER,
  breakdown TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);
console.log('  ✓ valuation_history');

db(`CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  listing_id TEXT,
  amount REAL NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);
console.log('  ✓ payments');

db(`CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  buyer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
)`);
console.log('  ✓ inquiries');

db(`CREATE TABLE IF NOT EXISTS inquiry_messages (
  id TEXT PRIMARY KEY,
  inquiry_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (inquiry_id) REFERENCES inquiries(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
)`);
console.log('  ✓ inquiry_messages');

db(`CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  buyer_id TEXT,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
)`);
console.log('  ✓ transactions');

console.log('All tables created successfully.\n');

// ──────────────────────────────────────────────────
// 2. Seed admin user
// ──────────────────────────────────────────────────
console.log('Seeding data...');

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const now = new Date().toISOString();

// Check if admin user exists
const existing = db("SELECT id FROM users WHERE email = 'admin@siteflip.com'");
if (existing.length === 0) {
  const adminId = uuidv4();
  const hashedPw = bcrypt.hashSync('admin123', 10);
  db(`INSERT INTO users (id, email, password, name, role, bio, created_at, updated_at)
      VALUES ('${adminId}', 'admin@siteflip.com', '${hashedPw}', 'Admin', 'admin', 'Platform administrator', '${now}', '${now}')`);
  console.log('  ✓ Admin user created (admin@siteflip.com / admin123)');
} else {
  console.log('  - Admin user already exists');
}

// Check if demo seller exists
const sellerCheck = db("SELECT id FROM users WHERE email = 'demo-seller@siteflip.com'");
let sellerId;
if (sellerCheck.length === 0) {
  sellerId = uuidv4();
  const hashedPw = bcrypt.hashSync('demo123', 10);
  db(`INSERT INTO users (id, email, password, name, role, bio, created_at, updated_at)
      VALUES ('${sellerId}', 'demo-seller@siteflip.com', '${hashedPw}', 'Demo Seller', 'seller', 'Experienced website flipper', '${now}', '${now}')`);
  console.log('  ✓ Demo seller created (demo-seller@siteflip.com / demo123)');
} else {
  sellerId = sellerCheck[0].id;
  console.log('  - Demo seller already exists');
}

// Check if demo buyer exists
const buyerCheck = db("SELECT id FROM users WHERE email = 'demo-buyer@siteflip.com'");
let buyerId;
if (buyerCheck.length === 0) {
  buyerId = uuidv4();
  const hashedPw = bcrypt.hashSync('demo123', 10);
  db(`INSERT INTO users (id, email, password, name, role, bio, created_at, updated_at)
      VALUES ('${buyerId}', 'demo-buyer@siteflip.com', '${hashedPw}', 'Demo Buyer', 'buyer', 'Looking for my next acquisition', '${now}', '${now}')`);
  console.log('  ✓ Demo buyer created (demo-buyer@siteflip.com / demo123)');
} else {
  buyerId = buyerCheck[0].id;
  console.log('  - Demo buyer already exists');
}

// ──────────────────────────────────────────────────
// 3. Seed sample listings
// ──────────────────────────────────────────────────
const listingCount = db("SELECT COUNT(*) as count FROM listings");
if (listingCount[0]?.count === 0) {
  const listings = [
    {
      title: 'SaaS Analytics Dashboard',
      description: 'A profitable SaaS analytics platform with 500+ paying customers. Built with React and Node.js. Monthly recurring revenue of $8,500 with 20% MoM growth.',
      price: 145000,
      category: 'SaaS',
      monthlyRevenue: 8500,
      monthlyTraffic: 45000,
      yearEstablished: 2021,
      techStack: 'React, Node.js, PostgreSQL, AWS',
      isFeatured: 1,
    },
    {
      title: 'Content Blog - Tech Reviews',
      description: 'Established tech review blog with 200+ articles ranking on Google. Monthly traffic of 120k visitors. Revenue from affiliate marketing and display ads.',
      price: 35000,
      category: 'Blog',
      monthlyRevenue: 2800,
      monthlyTraffic: 120000,
      yearEstablished: 2019,
      techStack: 'WordPress, PHP',
      isFeatured: 0,
    },
    {
      title: 'E-commerce Store - Pet Supplies',
      description: 'Dropshipping pet supplies store with 3 years of operational history. 50+ SKUs, automated fulfillment via Shopify. Strong social media following.',
      price: 65000,
      category: 'E-commerce',
      monthlyRevenue: 6200,
      monthlyTraffic: 35000,
      yearEstablished: 2020,
      techStack: 'Shopify, Klaviyo, Google Ads',
      isFeatured: 1,
    },
    {
      title: 'Newsletter - AI Weekly',
      description: 'Growing newsletter covering AI developments. 15,000 subscribers with 45% open rate. Monetized through sponsorships and premium tier.',
      price: 12000,
      category: 'Newsletter',
      monthlyRevenue: 1500,
      monthlyTraffic: 0,
      yearEstablished: 2023,
      techStack: 'ConvertKit, Notion',
      isFeatured: 0,
    },
    {
      title: 'Chrome Extension - Productivity',
      description: 'Productivity Chrome extension with 25k+ users. Freemium model with Pro tier at $5/month. Low maintenance, high margin.',
      price: 28000,
      category: 'Browser Extension',
      monthlyRevenue: 1800,
      monthlyTraffic: 5000,
      yearEstablished: 2022,
      techStack: 'JavaScript, Chrome APIs, Firebase',
      isFeatured: 0,
    },
  ];

  for (const listing of listings) {
    const lid = uuidv4();
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 60));
    const cAt = pastDate.toISOString();
    db(`
      INSERT INTO listings (id, seller_id, title, description, price, category, monthly_revenue, monthly_traffic, year_established, tech_stack, status, is_featured, created_at, updated_at)
      VALUES ('${lid}', '${sellerId}', '${listing.title.replace(/'/g, "''")}', '${listing.description.replace(/'/g, "''")}', ${listing.price}, '${listing.category}', ${listing.monthlyRevenue}, ${listing.monthlyTraffic}, ${listing.yearEstablished}, '${listing.techStack.replace(/'/g, "''")}', 'active', ${listing.isFeatured}, '${cAt}', '${cAt}')
    `);
  }
  console.log(`  ✓ ${listings.length} sample listings created`);
} else {
  console.log(`  - ${listingCount[0].count} listings already exist, skipping seed`);
}

console.log('\n=== Database initialization complete! ===\n');

// Verify
const counts = db(`
  SELECT 'users' as tbl, COUNT(*) as cnt FROM users
  UNION ALL SELECT 'listings', COUNT(*) FROM listings
  UNION ALL SELECT 'inquiries', COUNT(*) FROM inquiries
  UNION ALL SELECT 'payments', COUNT(*) FROM payments
  UNION ALL SELECT 'transactions', COUNT(*) FROM transactions
  UNION ALL SELECT 'valuation_history', COUNT(*) FROM valuation_history
`);
console.log('Verification:');
for (const row of counts) {
  console.log(`  ${row.tbl}: ${row.cnt} rows`);
}