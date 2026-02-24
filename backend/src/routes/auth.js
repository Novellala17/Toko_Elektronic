/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

const express = require('express'); // Import Express framework
const router = express.Router(); // Buat router untuk menampung route-route auth
const bcrypt = require('bcrypt'); // Import bcrypt untuk hash password
const jwt = require('jsonwebtoken'); // Import JWT untuk token autentikasi
const pool = require('../db/pool'); // Import koneksi database PostgreSQL
const { authenticateToken } = require('../middleware/authorization'); // Middleware untuk cek JWT

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '60m'; // Default 15 menit untuk access token
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'; // Default 7 hari untuk refresh token

// =================== REGISTER ==========================
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [User Management]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role = 'customer', membership = 'Silver' } = req.body;

    // 🔍 CEK EMAIL SUDAH TERDAFTAR
    const checkEmail = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );

    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar ❌' });
    }

    // 🔍 CEK USERNAME SUDAH TERDAFTAR
    const checkUsername = await pool.query(
      'SELECT username FROM users WHERE username = $1',
      [username]
    );

    if (checkUsername.rows.length > 0) {
      return res.status(400).json({ message: 'Username sudah dipakai ❌' });
    }

    // 🔐 HASH PASSWORD
    const hashed = await bcrypt.hash(password, 10);

    // 💾 INSERT USER BARU
    const q = `
      INSERT INTO users (name, username, email, password, role, membership)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id_users, name, username, email, role, membership, created_at
    `;

    const { rows } = await pool.query(q, [
      name, username, email, hashed, role, membership
    ]);

    res.status(201).json({
      message: 'Register berhasil ✅',
      user: rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// =================== LOGIN (FIX CASE-INSENSITIVE) ==========================
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user and return access + refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔥 FIX: username & email dibuat case-insensitive
    const q = `
      SELECT * FROM users
      WHERE LOWER(username) = LOWER($1) 
      OR LOWER(email) = LOWER($1)
    `;

    const { rows } = await pool.query(q, [username]);

    if (rows.length === 0)
      return res.status(400).json({ message: 'User not found' });

    const user = rows[0];

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Payload JWT
    const payload = { id_users: user.id_users, username: user.username, role: user.role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: REFRESH_EXPIRES });

    const expiresAt = new Date(Date.now() + parseDurationToMs(REFRESH_EXPIRES));

    // Simpan refresh token
    await pool.query(
      'INSERT INTO tokens (id_users, token, expires_at) VALUES ($1,$2,$3)',
      [user.id_users, refreshToken, expiresAt]
    );

    res.json({
      message: 'Login berhasil ✅',
      user: {
        id_users: user.id_users,
        name: user.name,
        username: user.username,
        role: user.role,
        membership: user.membership
      },
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});


// =================== PROFILE ==========================
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get user profile using JWT token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id_users; // Ambil id dari token JWT
    const result = await pool.query(
      'SELECT id_users, name, username, email, role, membership FROM users WHERE id_users = $1',
      [userId]
    ); 
    // Query profile user
    
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' }); // Jika user tidak ditemukan
    
    res.json({
      status: 'success',
      profile: result.rows[0],
    }); // Kirim data profil
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message }); // Jika error server
  }
});

// =================== REFRESH TOKEN ==========================
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body; 
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' }); 
    // Cek apakah ada refresh token
    
    const { rows } = await pool.query(
      'SELECT * FROM tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    ); 
    // Cari token valid di database
    
    if (rows.length === 0) return res.status(403).json({ message: 'Invalid refresh token' }); 
    // Jika token invalid
    
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET); 
    // Verifikasi token
    
    const newAccess = jwt.sign(
      { id_users: payload.id_users, username: payload.username, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES }
    ); 
    // Generate access token baru
    
    res.json({ accessToken: newAccess }); // Kirim access token baru
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid token' }); // Jika token gagal diverifikasi
  }
});

// =================== LOGOUT ==========================
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user and delete refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body; 
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' }); 
    // Cek refresh token
    
    await pool.query('DELETE FROM tokens WHERE token = $1', [refreshToken]); 
    // Hapus token dari database
    
    res.json({ message: '👋 Logout successful! See you again soon ✨' }); // Response sukses
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Logout failed' }); // Jika gagal
  }
});

// =================== DEACTIVATE USER ==========================
/**
 * @swagger
 * /auth/deactivate-user:
 *   put:
 *     tags: [User Management]
 *     summary: Deactivate a non-admin user
 *     description: Nonaktifkan user (kecuali admin tidak boleh dinonaktifkan)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_users:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       400:
 *         description: Admin cannot be deactivated
 *       404:
 *         description: User not found
 */
router.put('/deactivate-user', async (req, res) => {
  try {
    const { id_users } = req.body;

    const { rows } = await pool.query(
      'SELECT id_users, role FROM users WHERE id_users = $1',
      [id_users]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    if (user.role === 'admin') {
      return res.status(400).json({ message: '❌ Admin cannot be deactivated' });
    }

    await pool.query(
      'UPDATE users SET active = false WHERE id_users = $1',
      [id_users]
    );

    res.json({ message: '✅ User deactivated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});


// =================== UTIL ==========================
function parseDurationToMs(str) {
  const n = parseInt(str.slice(0, -1)); // Ambil angka dari string durasi
  const unit = str.slice(-1); // Ambil unit (m/h/d)
  if (unit === 'm') return n * 60 * 1000; // menit -> ms
  if (unit === 'h') return n * 60 * 60 * 1000; // jam -> ms
  if (unit === 'd') return n * 24 * 60 * 60 * 1000; // hari -> ms
  return 0; // jika format salah
} //Dipakai untuk menghitung kapan refresh token expired.

module.exports = router; // Export router untuk digunakan di app.js
