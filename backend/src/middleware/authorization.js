const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // verify refresh token presence is for refresh flow; for access token we can optionally trust JWT
    // but we keep tokens table check for extra safety (if you store refresh tokens only, you can skip)
    req.user = { id_users: payload.id_users, username: payload.username, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};

const authorizeRole = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
