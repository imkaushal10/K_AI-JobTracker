const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL if available (Supabase/Production)
// Otherwise use individual credentials (Local development)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Required for Supabase
        }
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

// Test connection
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// Helper function to test connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database test query successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database test query failed:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };