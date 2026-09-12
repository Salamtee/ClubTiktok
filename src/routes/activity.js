const express = require('express');
const Activity = require('../models/Activity');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const activity = await Activity.find().select('-_id').sort({ at: -1 }).limit(150).lean();
  res.json({ ok: true, activity });
});

module.exports = router;
