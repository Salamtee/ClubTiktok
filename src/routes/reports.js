const express = require('express');
const Report = require('../models/Report');
const Item = require('../models/Item');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES, SECTIONS, todayISO } = require('../constants');
const logActivity = require('../logActivity');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const reports = await Report.find().select('-_id').sort({ submittedAt: -1 }).lean();
  res.json({ ok: true, reports });
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { id, authorId, authorUsername, authorRole, section, type, lines, totalSales, notes, recipients } = req.body || {};
    if (!id) return res.json({ ok: false, error: 'Missing report id.' });

    const reportSection = section || req.user.section || SECTIONS.BAR;
    const report = await Report.create({
      id,
      authorId: authorId || req.user.id,
      authorUsername: authorUsername || req.user.username,
      authorRole: authorRole || req.user.role,
      section: reportSection,
      type: type || 'staff',
      date: todayISO(),
      submittedAt: new Date().toISOString(),
      lines: lines || [],
      totalSales: Number(totalSales) || 0,
      notes: notes || '',
      recipients: recipients || [],
      status: 'Pending',
      verifiedBy: null,
    });

    if (Array.isArray(lines) && lines.length) {
      for (const line of lines) {
        const item = await Item.findOne({ id: line.itemId });
        if (item) {
          item.stockQuantity = Math.max(0, item.stockQuantity - Number(line.qty || 0));
          await item.save();
        }
      }
    }

    await logActivity(
      report.authorUsername,
      `Submitted ${reportSection} daily report (Le ${report.totalSales})`,
      report.authorRole,
      reportSection
    );

    res.json({ ok: true, report });
  } catch (err) {
    console.error('[reports/create]', err);
    res.status(500).json({ ok: false, error: 'Failed to submit report.' });
  }
});

router.patch('/:id/verify', requireAuth, requireRole(ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGER), async (req, res) => {
  try {
    const report = await Report.findOne({ id: req.params.id });
    if (!report) return res.status(404).json({ ok: false });

    report.status = 'Verified';
    report.verifiedBy = req.user.username;
    await report.save();

    await logActivity(req.user.username, `Verified report ${report.id} (${report.section})`, req.user.role, req.user.section);
    res.json({ ok: true, report });
  } catch (err) {
    console.error('[reports/verify]', err);
    res.status(500).json({ ok: false, error: 'Failed to verify report.' });
  }
});

module.exports = router;
