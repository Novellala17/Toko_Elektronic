/**
 * @swagger
 * tags:
 *   name: Transaction Items
 *   description: API untuk mengelola item di setiap transaksi
 */
const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRole } = require('../middleware/authorization');

/**
 * @swagger
 * /transaction-items:
 *   get:
 *     summary: Ambil semua item transaksi
 *     tags: [Transaction Items]
 *     responses:
 *       200:
 *         description: List semua item transaksi
 */
router.get(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'cashier']),
  async (req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM transaction_items ORDER BY transaction_id ASC'
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /transaction-items/{transaction_id}:
 *   get:
 *     summary: Ambil semua item berdasarkan ID transaksi
 *     tags: [Transaction Items]
 *     parameters:
 *       - name: transaction_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
router.get(
  '/:transaction_id',
  authenticateToken,
  authorizeRole(['admin', 'cashier']),
  async (req, res) => {
    const { transaction_id } = req.params;
    try {
      const result = await pool.query(
        'SELECT * FROM transaction_items WHERE transaction_id = $1',
        [transaction_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }

      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /transaction-items:
 *   post:
 *     tags: [Transactions_items]
 *     summary: Tambahkan item ke transaksi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_id:
 *                 type: integer
 *                 example: 12
 *               product_id:
 *                 type: integer
 *                 example: 7
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Item ditambahkan ke transaksi
 */

router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'cashier']),
  async (req, res) => {
    const { transaction_id, id_product, quantity, price_each, subtotal } = req.body;

    if (!transaction_id || !id_product || !quantity || !price_each || !subtotal) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    try {
      const result = await pool.query(
        `INSERT INTO transaction_items (transaction_id, id_product, quantity, price_each, subtotal)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [transaction_id, id_product, quantity, price_each, subtotal]
      );
      res
        .status(201)
        .json({ message: 'Item transaksi berhasil ditambahkan', data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /transaction-items/{transaction_id}/{id_product}:
 *   put:
 *     summary: Update item transaksi
 *     tags: [Transaction Items]
 */
router.put(
  '/:transaction_id/:id_product',
  authenticateToken,
  authorizeRole(['admin', 'cashier']),
  async (req, res) => {
    const { transaction_id, id_product } = req.params;
    const { quantity, price_each, subtotal } = req.body;

    try {
      const check = await pool.query(
        'SELECT * FROM transaction_items WHERE transaction_id = $1 AND id_product = $2',
        [transaction_id, id_product]
      );

      if (check.rows.length === 0) {
        return res.status(404).json({ message: 'Item transaksi tidak ditemukan' });
      }

      await pool.query(
        `UPDATE transaction_items 
         SET quantity = $1, price_each = $2, subtotal = $3 
         WHERE transaction_id = $4 AND id_product = $5`,
        [quantity, price_each, subtotal, transaction_id, id_product]
      );

      res.json({ message: 'Item transaksi berhasil diperbarui' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /transaction-items/{transaction_id}/{id_product}:
 *   delete:
 *     summary: Hapus item transaksi
 *     tags: [Transaction Items]
 */
router.delete(
  '/:transaction_id/:id_product',
  authenticateToken,
  authorizeRole(['admin', 'cashier']),
  async (req, res) => {
    const { transaction_id, id_product } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM transaction_items WHERE transaction_id = $1 AND id_product = $2 RETURNING *',
        [transaction_id, id_product]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Item tidak ditemukan' });
      }

      res.json({
        message: 'Item transaksi berhasil dihapus',
        deleted: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
