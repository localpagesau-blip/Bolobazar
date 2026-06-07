const jwt = require('jsonwebtoken');
const { db } = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET || 'siteflip-dev-secret-key';

/**
 * Middleware to verify JWT token and attach user to request.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = db(`SELECT id, email, name, role, created_at FROM users WHERE id = '${decoded.id}'`);
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = users[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to optionally attach user if token present.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const users = db(`SELECT id, email, name, role FROM users WHERE id = '${decoded.id}'`);
      if (users.length > 0) {
        req.user = users[0];
      }
    } catch (_) {
      // Token invalid, continue without user
    }
  }
  next();
}

module.exports = { authenticate, optionalAuth };