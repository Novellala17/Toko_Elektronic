const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',       // username database
  password: 'postgres',   // password database
  database: 'elektronik'        // nama database
});

module.exports = pool; // bisa dipakai di seluruh project
