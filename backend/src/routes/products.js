/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRole } = require('../middleware/authorization');

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Product]
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'cashier', 'customer']),
  async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products ORDER BY id_product DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Product]
 *     summary: Get product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'cashier', 'customer']),
  async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id_product = $1',
        [req.params.id]
      );

      if (result.rows.length === 0)
        return res.status(404).json({ error: 'Product not found' });

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Product]
 *     summary: Create new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Product created
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const { name, category_id, price, stock, description, image_url } = req.body;

      const result = await pool.query(
        `INSERT INTO products (name, category_id, price, stock, description, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, category_id, price, stock, description, image_url]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Product]
 *     summary: Update product
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const { name, category_id, price, stock, description, image_url } = req.body;

      const result = await pool.query(
        `UPDATE products
         SET name=$1, category_id=$2, price=$3, stock=$4, description=$5, image_url=$6
         WHERE id_product=$7
         RETURNING *`,
        [name, category_id, price, stock, description, image_url, req.params.id]
      );

      if (result.rows.length === 0)
        return res.status(404).json({ error: "Product not found" });

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Product]
 *     summary: Delete product
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE id_product = $1 RETURNING *',
        [req.params.id]
      );

      if (result.rows.length === 0)
        return res.status(404).json({ error: "Product not found" });

      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
