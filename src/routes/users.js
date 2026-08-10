const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants');
const logActivity = require('../logActivity');

const router = express.Router();

function sanitize(userDoc) {
  const u = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete u.password;
  delete u._id;
  return u;
}

router.get('/', requireAuth, async (req, res) => {
  const users = await User.find().select('-password -_id').lean();
  res.json({ ok: true, users });
});

// Only the System Admin registers new staff accounts.
router.post('/', requireAuth, requireRole(ROLES.ADMIN), async (req, res) => {
  try {
    const {
      id, username, password, fullName, role, section, shift,
      phone, address, nationalId, emergencyContact, photoUrl,
    } = req.body || {};

    if (!id || !username || !password || !fullName) {
      return res.json({ ok: false, error: 'Missing required staff details.' });
    }

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) return res.json({ ok: false, error: 'That username is already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      id,
      username: username.toLowerCase(),
      password: hashed,
      fullName,
      role: role || ROLES.WAITER,
      section: section || 'Bar',
      shift: shift || 'Morning',
      phone: phone || 'N/A',
      address: address || 'Freetown',
      nationalId: nationalId || 'N/A',
      emergencyContact: emergencyContact || 'N/A',
      photoUrl: photoUrl || '',
      status: 'active',
    });

    await logActivity(
      req.user.username,
      `Registered staff "${fullName}" (${user.role} - ${user.section}, Shift: ${user.shift})`,
      req.user.role,
      req.user.section
    );

    return res.json({ ok: true, user: sanitize(user) });
  } catch (err) {
    console.error('[users/create]', err);
    return res.status(500).json({ ok: false, error: 'Failed to register staff account.' });
  }
});

router.patch('/:id', requireAuth, requireRole(ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGER), async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    const patch = { ...req.body };
    if (patch.password) {
      patch.password = await bcrypt.hash(patch.password, 10);
    } else {
      delete patch.password;
    }
    delete patch.id;
    delete patch.username;

    Object.assign(user, patch);
    await user.save();

    await logActivity(req.user.username, `Updated staff details for "${user.fullName}"`, req.user.role, req.user.section);
    return res.json({ ok: true, user: sanitize(user) });
  } catch (err) {
    console.error('[users/update]', err);
    return res.status(500).json({ ok: false, error: 'Failed to update staff account.' });
  }
});

router.patch('/:id/status', requireAuth, requireRole(ROLES.ADMIN), async (req, res) => {
  try {
    const { status } = req.body || {};
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ ok: false });

    user.status = status;
    if (status === 'inactive') user.isOnline = false;
    await user.save();

    await logActivity(
      req.user.username,
      `${status === 'active' ? 'Reactivated' : 'Deactivated'} staff account "${user.username}"`,
      req.user.role,
      req.user.section
    );
    return res.json({ ok: true, user: sanitize(user) });
  } catch (err) {
    console.error('[users/status]', err);
    return res.status(500).json({ ok: false, error: 'Failed to update account status.' });
  }
});

module.exports = router;
