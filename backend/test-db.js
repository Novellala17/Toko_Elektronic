const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 CEK ENVIRONMENT VARIABLES:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ ADA' : '❌ TIDAK ADA');
console.log('DB_PORT:', process.env.DB_PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ ADA' : '❌ TIDAK ADA');
console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('\n🔍 TEST KONEKSI DATABASE:');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'elektronik',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

pool.query('SELECT NOW() as waktu', (err, res) => {
  if (err) {
    console.error('❌ ERROR KONEKSI DATABASE:');
    console.error('Pesan:', err.message);
    console.error('Code:', err.code);
  } else {
    console.log('✅ KONEKSI DATABASE SUKSES!');
    console.log('Waktu server:', res.rows[0].waktu);
  }
  pool.end();
});