/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Manage existing users (Admin only)
 */

const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticateToken, authorizeRole } = require('../middleware/authorization');
const bcrypt = require('bcrypt');


// ====================== GET PROFILE (ALL ROLES) ========================
/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [User Management]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_users, name, username, email, role, active FROM users WHERE id_users = $1',
      [req.user.id_users]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// ====================== GET ALL USERS (ADMIN ONLY) ========================
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User Management]
 *     summary: Get all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 */
router.get(
  '/',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id_users, name, username, email, role, active FROM users ORDER BY id_users ASC'
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
);


// =================== TOGGLE ACTIVE USER (ADMIN ONLY) ==========================
/**
 * @swagger
 * /users/toggle-active:
 *   put:
 *     tags: [User Management]
 *     summary: Activate / deactivate a user (toggle) — ADMIN ONLY
 *     security:
 *       - bearerAuth: []
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
 *         description: Status user berhasil diubah
 */
router.put(
  '/toggle-active',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const { id_users } = req.body;

      const { rows } = await pool.query(
        'SELECT id_users, role, active FROM users WHERE id_users = $1',
        [id_users]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = rows[0];

      if (user.role === 'admin') {
        return res.status(400).json({ message: '❌ Admin cannot be deactivated' });
      }

      const newStatus = !user.active;

      await pool.query(
        'UPDATE users SET active = $1 WHERE id_users = $2',
        [newStatus, id_users]
      );

      res.json({
        message: `User status updated: ${newStatus ? 'Activated' : 'Deactivated'}`,
        active: newStatus
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to toggle user status' });
    }
  }
);


module.exports = router;
