const express = require('express');
const Setting = require('../models/Setting');
const Report = require('../models/Report');
const Booking = require('../models/Booking');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants');
const logActivity = require('../logActivity');

const router = express.Router();

const DEFAULT_SHIFT_TIMES = {
  Morning: { start: '08:00', end: '16:00' },
  Afternoon: { start: '12:00', end: '20:00' },
  Evening: { start: '16:00', end: '00:00' },
  Night: { start: '00:00', end: '08:00' },
};

// GET current settings
router.get('/', requireAuth, async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'system_settings' }).select('-_id').lean();
    if (!settings) {
      settings = {
        key: 'system_settings',
        shiftTimes: DEFAULT_SHIFT_TIMES,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
      };
    }
    res.json({ ok: true, settings });
  } catch (err) {
    console.error('[settings/get]', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve system settings.' });
  }
});

// PATCH update shift times (Admin only)
router.patch('/', requireAuth, requireRole(ROLES.ADMIN), async (req, res) => {
  try {
    const { shiftTimes } = req.body || {};
    if (!shiftTimes || typeof shiftTimes !== 'object') {
      return res.json({ ok: false, error: 'Invalid shift times data.' });
    }

    let settings = await Setting.findOne({ key: 'system_settings' });
    if (!settings) {
      settings = new Setting({ key: 'system_settings' });
    }

    settings.shiftTimes = { ...settings.shiftTimes, ...shiftTimes };
    settings.updatedAt = new Date().toISOString();
    settings.updatedBy = req.user.username;
    await settings.save();

    await logActivity(
      req.user.username,
      'Updated operational shift times in System Settings',
      req.user.role,
      req.user.section
    );

    const result = settings.toObject ? settings.toObject() : { ...settings };
    delete result._id;
    res.json({ ok: true, settings: result });
  } catch (err) {
    console.error('[settings/update]', err);
    res.status(500).json({ ok: false, error: 'Failed to update system settings.' });
  }
});

// POST clear all total sales (Admin only)
router.post('/clear-sales', requireAuth, requireRole(ROLES.ADMIN), async (req, res) => {
  try {
    const reportDeleteResult = await Report.deleteMany({});
    const bookingDeleteResult = await Booking.deleteMany({});

    await logActivity(
      req.user.username,
      `Cleared all total sales data (${reportDeleteResult.deletedCount} daily reports & ${bookingDeleteResult.deletedCount} booking receipts cleared)`,
      req.user.role,
      req.user.section
    );

    res.json({
      ok: true,
      message: 'All total sales data cleared successfully.',
      reportsCleared: reportDeleteResult.deletedCount,
      bookingsCleared: bookingDeleteResult.deletedCount,
    });
  } catch (err) {
    console.error('[settings/clear-sales]', err);
    res.status(500).json({ ok: false, error: 'Failed to clear total sales data.' });
  }
});

module.exports = router;
