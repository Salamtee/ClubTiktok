const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: 'Not authenticated.' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ id: payload.id }).lean();
    if (!user || user.status !== 'active') {
      return res.status(401).json({ ok: false, error: 'Session expired or account deactivated.' });
    }
    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Invalid or expired session.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
