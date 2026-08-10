const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { calculatePunctuality } = require('../constants');
const logActivity = require('../logActivity');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });
}

function sanitize(userDoc) {
  const u = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete u.password;
  delete u._id;
  return u;
}

router.post('/login', async (req, res) => {
  try {
    const { username, password, shift } = req.body || {};
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.json({ ok: false, error: 'Please enter a valid username.' });
    }
    const cleanUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: cleanUsername });
    if (!user) return res.json({ ok: false, error: 'No staff account found for that username.' });
    if (user.status !== 'active') {
      return res.json({ ok: false, error: 'This staff account is deactivated. Contact the System Admin.' });
    }
    const match = await bcrypt.compare(password || '', user.password);
    if (!match) return res.json({ ok: false, error: 'Incorrect password.' });

    const now = new Date();
    user.isOnline = true;
    user.lastSignInAt = now;

    const punctuality = calculatePunctuality(user.shift || shift || 'Morning', now);
    user.punctualityStatus = punctuality.status;
    user.punctualityMinutes = punctuality.minutesLate;
    user.punctualityLabel = punctuality.label;
    await user.save();

    await logActivity(
      user.username,
      `Signed in (Shift: ${user.shift || shift || 'General'} — ${punctuality.badge})`,
      user.role,
      user.section
    );

    const token = signToken(user);
    return res.json({ ok: true, user: sanitize(user), token });
  } catch (err) {
    console.error('[auth/login]', err);
    return res.status(500).json({ ok: false, error: 'Login error occurred. Please try again.' });
  }
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (user) {
      user.isOnline = false;
      user.lastSignOutAt = new Date();
      await user.save();
      await logActivity(user.username, 'Signed out', user.role, user.section);
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('[auth/logout]', err);
    return res.status(500).json({ ok: false, error: 'Logout failed.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ ok: true, user: req.user });
});

module.exports = router;
