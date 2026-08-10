const express = require('express');
const Item = require('../models/Item');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES, SECTIONS } = require('../constants');
const logActivity = require('../logActivity');

const router = express.Router();
const canManage = [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGER];

router.get('/', requireAuth, async (req, res) => {
  const items = await Item.find().select('-_id').lean();
  res.json({ ok: true, items });
});

router.post('/', requireAuth, requireRole(...canManage), async (req, res) => {
  try {
    const { id, name, category, section, price, stockQuantity } = req.body || {};
    if (!id || !name || !category) return res.json({ ok: false, error: 'Missing item details.' });

    const sec = section || (category.includes('Bar') ? SECTIONS.BAR :
      category.includes('Shisha') ? SECTIONS.SHISHA :
      category.includes('Guest') ? SECTIONS.GUEST_HOUSE : SECTIONS.RESTAURANT);

    const item = await Item.create({
      id, name, category, section: sec,
      price: Number(price) || 0,
      stockQuantity: Number(stockQuantity) || 0,
    });

    await logActivity(req.user.username, `Added item "${name}" (Le ${price}, Stock: ${stockQuantity})`, req.user.role, req.user.section);
    res.json({ ok: true, item });
  } catch (err) {
    console.error('[items/create]', err);
    res.status(500).json({ ok: false, error: 'Failed to add item.' });
  }
});

router.patch('/:id', requireAuth, requireRole(...canManage), async (req, res) => {
  try {
    const item = await Item.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ ok: false, error: 'Item not found.' });

    const patch = { ...req.body };
    delete patch.id;
    if (patch.price !== undefined) patch.price = Number(patch.price);
    if (patch.stockQuantity !== undefined) patch.stockQuantity = Number(patch.stockQuantity);
    Object.assign(item, patch);
    await item.save();

    await logActivity(req.user.username, `Updated item "${item.name}"`, req.user.role, req.user.section);
    res.json({ ok: true, item });
  } catch (err) {
    console.error('[items/update]', err);
    res.status(500).json({ ok: false, error: 'Failed to update item.' });
  }
});

router.delete('/:id', requireAuth, requireRole(...canManage), async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ id: req.params.id });
    if (item) {
      await logActivity(req.user.username, `Removed item "${item.name}"`, req.user.role, req.user.section);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('[items/delete]', err);
    res.status(500).json({ ok: false, error: 'Failed to remove item.' });
  }
});

module.exports = router;
