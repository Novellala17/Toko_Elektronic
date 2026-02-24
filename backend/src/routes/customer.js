/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Endpoint untuk customer (login, lihat produk, kategori, dan riwayat transaksi)
 */

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRole } = require('../middleware/authorization');

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// ==================== LOGIN CUSTOMER ====================
// ==================== LOGIN CUSTOMER ====================
/**
 * @swagger
 * /customer/login:
 *   post:
 *     tags: [Customer]
 *     summary: Login customer dan mendapatkan token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const q = `
      SELECT * FROM users
      WHERE LOWER(username) = LOWER($1)
      AND role = 'customer'
    `;

    const { rows } = await pool.query(q, [username]);

    if (rows.length === 0)
      return res.status(400).json({ message: 'Customer tidak ditemukan' });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Password salah' });

    // Payload
    const payload = {
      id_users: user.id_users,
      username: user.username,
      role: user.role
    };

    // Generate Access Token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: ACCESS_EXPIRES
    });

    // Generate Refresh Token
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: REFRESH_EXPIRES
    });

    // Simpan refresh token ke database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO tokens (id_users, token, expires_at) VALUES ($1, $2, $3)',
      [user.id_users, refreshToken, expiresAt]
    );

    res.json({
      message: 'Login berhasil ✅',
      user: {
        id_users: user.id_users,
        name: user.name,
        username: user.username,
        membership: user.membership
      },
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login gagal', detail: err.message });
  }
});

// ==================== LIHAT SEMUA PRODUK ====================
/**
 * @swagger
 * /customer/products:
 *   get:
 *     tags: [Customer]
 *     summary: Customer melihat semua produk
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua produk
 */
router.get('/products', authenticateToken, authorizeRole(['customer']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_product, p.name, p.price, p.stock, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id_category
      ORDER BY p.id_product ASC
    `);
    res.json({
      message: '🎉 Selamat datang di Toko Elektronik Kami! Berikut produk-produk menarik yang siap Anda jelajahi ✨',
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==================== LIHAT SEMUA KATEGORI ====================
/**
 * @swagger
 * /customer/categories:
 *   get:
 *     tags: [Customer]
 *     summary: Customer melihat semua kategori produk
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 */
router.get('/categories', authenticateToken, authorizeRole(['customer']), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id_category ASC');
    res.json({
      message: '🎊 Daftar kategori berhasil diambil 🎊',
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ==================== LIHAT RIWAYAT TRANSAKSI ====================
/**
 * @swagger
 * /customer/transactions:
 *   get:
 *     tags: [Customer]
 *     summary: Customer melihat riwayat transaksinya sendiri
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar riwayat transaksi customer beserta total pengeluaran
 */
router.get('/transactions',
  authenticateToken,
  authorizeRole(['customer', 'cashier']),
  async (req, res) => {
    try {
      const userId = req.user.id_users;

      const result = await pool.query(`
        SELECT 
          t.transaction_id,
          t.total_amount,
          t.discount_applied,
          t.payment_status,
          t.transaction_date,
          json_agg(
            json_build_object(
              'id_product', ti.id_product,
              'quantity', ti.quantity,
              'price_each', ti.price_each,
              'subtotal', ti.subtotal
            )
          ) AS items
        FROM transactions t
        LEFT JOIN transaction_items ti 
          ON t.transaction_id = ti.transaction_id
        WHERE t.id_user = $1
        GROUP BY t.transaction_id
        ORDER BY t.transaction_date DESC
      `, [userId]);

      const totalSpent = result.rows.reduce(
        (sum, tx) => sum + parseFloat(tx.total_amount), 
        0
      );

      res.json({
        message: "✨ Riwayat transaksi berhasil diambil ✅",
        total_transactions: result.rows.length,
        total_spent: totalSpent,
        transactions: result.rows
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ==================== LOGOUT CUSTOMER ====================

/**
 * @swagger
 * /customer/logout:
 *   post:
 *     tags: [Customer]
 *     summary: Logout customer dan menghapus refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout berhasil
 *       400:
 *         description: Refresh token diperlukan
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token diperlukan' });

    // 🗑 Hapus token dari tabel tokens
    await pool.query('DELETE FROM tokens WHERE token = $1', [refreshToken]);

    res.json({
      message: '👋 Logout berhasil! Sampai jumpa kembali ✨'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Logout gagal', detail: err.message });
  }
});

module.exports = router; 