const express = require('express');
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');
const Item = require('../models/Item');
const Report = require('../models/Report');
const StockLog = require('../models/StockLog');
const Booking = require('../models/Booking');
const Activity = require('../models/Activity');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [users, items, reports, stockLog, bookings, activity] = await Promise.all([
      User.find().select('-password -_id').lean(),
      Item.find().select('-_id').lean(),
      Report.find().select('-_id').sort({ submittedAt: -1 }).lean(),
      StockLog.find().select('-_id').sort({ date: -1 }).lean(),
      Booking.find().select('-_id').sort({ createdAt: -1 }).lean(),
      Activity.find().select('-_id').sort({ at: -1 }).limit(150).lean(),
    ]);
    return res.json({ ok: true, users, items, reports, stockLog, bookings, activity });
  } catch (err) {
    console.error('[state]', err);
    return res.status(500).json({ ok: false, error: 'Failed to load system state.' });
  }
});

module.exports = router;
