const express = require('express');
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');
const Item = require('../models/Item');
const Report = require('../models/Report');
const StockLog = require('../models/StockLog');
const Booking = require('../models/Booking');
const Activity = require('../models/Activity');
const Setting = require('../models/Setting');

const router = express.Router();

const DEFAULT_SHIFT_TIMES = {
  Morning: { start: '08:00', end: '16:00' },
  Afternoon: { start: '12:00', end: '20:00' },
  Evening: { start: '16:00', end: '00:00' },
  Night: { start: '00:00', end: '08:00' },
};

router.get('/', requireAuth, async (req, res) => {
  try {
    const [users, items, reports, stockLog, bookings, activity, rawSettings] = await Promise.all([
      User.find().select('-password -_id').lean(),
      Item.find().select('-_id').lean(),
      Report.find().select('-_id').sort({ submittedAt: -1 }).lean(),
      StockLog.find().select('-_id').sort({ date: -1 }).lean(),
      Booking.find().select('-_id').sort({ createdAt: -1 }).lean(),
      Activity.find().select('-_id').sort({ at: -1 }).limit(150).lean(),
      Setting.findOne({ key: 'system_settings' }).select('-_id').lean(),
    ]);
    const settings = rawSettings || {
      key: 'system_settings',
      shiftTimes: DEFAULT_SHIFT_TIMES,
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    };
    return res.json({ ok: true, users, items, reports, stockLog, bookings, activity, settings });
  } catch (err) {
    console.error('[state]', err);
    return res.status(500).json({ ok: false, error: 'Failed to load system state.' });
  }
});

module.exports = router;
