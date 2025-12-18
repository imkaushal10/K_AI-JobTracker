require('dotenv').config();

console.log('=== ENVIRONMENT VARIABLES ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD exists:', !!process.env.DB_PASSWORD);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

console.log('\n=== POOL CONFIG ===');
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

console.log('Config:', JSON.stringify(config, null, 2));

// Check for undefined values
const undefinedKeys = Object.keys(config).filter(key => config[key] === undefined);
if (undefinedKeys.length > 0) {
  console.log('\n❌ WARNING: These values are undefined:', undefinedKeys);
} else {
  console.log('\n✅ All config values are defined');
}