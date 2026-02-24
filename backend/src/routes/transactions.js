/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transactions (Cashier & Admin)
 */

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRole } = require('../middleware/authorization');


// ===================================================================
// 🔵 GET SEMUA TRANSAKSI → admin & cashier
// ===================================================================
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of all transactions
 */
router.get(
  '/', 
  authenticateToken, 
  authorizeRole(['admin', 'cashier']), 
  async (req, res) => {
    try {
      const q = `
        SELECT t.transaction_id, t.transaction_date, t.total_amount, 
               t.discount_applied, t.payment_status, 
               t.id_user, t.cashier_by,
               u.name AS customer_name, u.membership
        FROM transactions t
        LEFT JOIN users u ON t.id_user = u.id_users
        ORDER BY t.transaction_id DESC
      `;

      const { rows } = await pool.query(q);
      res.json(rows);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);



// ===================================================================
// 🔵 GET TRANSAKSI BERDASARKAN ID → admin & cashier
// ===================================================================
/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction found
 *       404:
 *         description: Transaction not found
 */
router.get(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'cashier']),
  async (req, res) => {
    try {
      const q = `SELECT * FROM transactions WHERE transaction_id = $1`;
      const { rows } = await pool.query(q, [req.params.id]);

      if (!rows.length)
        return res.status(404).json({ message: 'Transaction not found' });

      res.json(rows[0]);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);



// ===================================================================
// 🔵 POST – BUAT TRANSAKSI → admin & cashier
// ===================================================================
/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create new transaction (Cashier only)
 *     tags: [Transactions]
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'cashier']),
  async (req, res) => {
    try {
      const { id_user, discount_applied = 0, payment_status = 'paid' } = req.body;
      const cashierBy = req.user.id_users;

      const q = `
        INSERT INTO transactions (id_user, discount_applied, payment_status, cashier_by)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const { rows } = await pool.query(q, [
        id_user,
        discount_applied,
        payment_status,
        cashierBy
      ]);

      res.status(201).json(rows[0]);

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);



// ===================================================================
// 🔵 PUT – UPDATE TRANSAKSI → admin & cashier
// ===================================================================
/**
 * @swagger
 * /transactions/{transaction_id}:
 *   put:
 *     summary: Update transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount_applied:
 *                 type: number
 *               payment_status:
 *                 type: string
 *             example:
 *               discount_applied: 5000
 *               payment_status: "Paid"
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         description: Transaction not found
 */
router.put(
  '/:transaction_id',
  authenticateToken,
  authorizeRole(['admin', 'cashier']),
  async (req, res) => {
    try {
      const { transaction_id } = req.params;
      const { discount_applied, payment_status } = req.body;

      const q = `
        UPDATE transactions
        SET 
          discount_applied = COALESCE($1, discount_applied),
          payment_status = COALESCE($2, payment_status)
        WHERE transaction_id = $3
        RETURNING *
      `;

      const { rows } = await pool.query(q, [
        discount_applied,
        payment_status,
        transaction_id
      ]);

      if (!rows.length)
        return res.status(404).json({ message: 'Transaction not found' });

      res.json(rows[0]);

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);



module.exports = router;
