/**
 * Database helper - wraps team-db CLI for all SQLite operations.
 * team-db syncs via Turso automatically (pull → execute → push).
 */
const { execSync } = require('child_process');

function db(sql) {
  try {
    // Escape double quotes inside the SQL for shell safety
    const escaped = sql.replace(/"/g, '\\"');
    const output = execSync(`team-db "${escaped}"`, {
      encoding: 'utf-8',
      timeout: 15000,
    });
    const trimmed = output.trim();
    if (!trimmed) return [];
    return JSON.parse(trimmed);
  } catch (err) {
    console.error('DB Error:', err.message);
    console.error('SQL:', sql);
    throw new Error('Database query failed');
  }
}

module.exports = { db };