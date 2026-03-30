const { Pool } = require('pg');
require('dotenv').config();

// CEK DULU: Apakah pakai Supabase atau lokal?
const isProduction = process.env.NODE_ENV === 'production';

let pool;

if (isProduction) {
  // Production: Pakai Supabase dengan SSL
  pool = new Pool({
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Development: Pakai PostgreSQL lokal tanpa SSL
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'nama_database_anda',
    password: process.env.DB_PASSWORD || 'password_anda',
    port: process.env.DB_PORT || 5432,
    ssl: false // NONAKTIFKAN SSL untuk lokal
  });
}

// Test koneksi
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err.message);
  } else {
    console.log('✅ Berhasil konek ke database!');
    release();
  }
});

module.exports = pool;