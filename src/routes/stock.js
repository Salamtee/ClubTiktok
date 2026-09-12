const express = require('express');
const StockLog = require('../models/StockLog');
const Item = require('../models/Item');
const { requireAuth } = require('../middleware/auth');
const { ROLES, SECTIONS, todayISO } = require('../constants');
const logActivity = require('../logActivity');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const stockLog = await StockLog.find().select('-_id').sort({ date: -1 }).lean();
  res.json({ ok: true, stockLog });
});

router.post('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role === ROLES.ADMIN) {
      return res.json({ ok: false, error: 'System Admin accounts are view-only for stock and cannot record stock received.' });
    }

    const { id, section, supplierName, itemId, qtyReceived, unitCost, notes } = req.body || {};
    const item = await Item.findOne({ id: itemId });
    if (!item) return res.json({ ok: false, error: 'Select a valid item to replenish.' });

    const qty = Number(qtyReceived);
    if (isNaN(qty) || qty <= 0) return res.json({ ok: false, error: 'Enter a valid stock quantity.' });

    const cost = Number(unitCost) || item.price * 0.6;
    item.stockQuantity += qty;
    await item.save();

    const entry = await StockLog.create({
      id,
      date: todayISO(),
      section: section || item.section || SECTIONS.BAR,
      supplierName: supplierName || 'General Supplier',
      itemId: item.id,
      itemName: item.name,
      qtyReceived: qty,
      unitCost: cost,
      totalCost: cost * qty,
      receivedBy: req.user.username,
      notes: notes || '',
    });

    await logActivity(
      req.user.username,
      `Recorded +${qty} ${item.name} received from ${entry.supplierName} (${entry.section})`,
      req.user.role,
      entry.section
    );

    res.json({ ok: true, entry, item });
  } catch (err) {
    console.error('[stock/create]', err);
    res.status(500).json({ ok: false, error: 'Failed to record stock received.' });
  }
});

module.exports = router;
