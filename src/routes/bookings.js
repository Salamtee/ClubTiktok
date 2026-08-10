const express = require('express');
const Booking = require('../models/Booking');
const { requireAuth } = require('../middleware/auth');
const { ROLES, SECTIONS, todayISO } = require('../constants');
const logActivity = require('../logActivity');

const router = express.Router();

function money(n) {
  return 'Le ' + Number(n || 0).toLocaleString();
}

router.get('/', requireAuth, async (req, res) => {
  const bookings = await Booking.find().select('-_id').sort({ createdAt: -1 }).lean();
  res.json({ ok: true, bookings });
});

router.post('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role === ROLES.ADMIN) {
      return res.json({ ok: false, error: 'System Admin accounts are view-only for booking receipts and cannot generate new receipts.' });
    }

    const { id, guestName, guestPhone, section, roomOrTable, checkInDate, checkOutDate, numGuests, totalAmount, paymentStatus } = req.body || {};
    if (!guestName || !roomOrTable) return res.json({ ok: false, error: 'Missing booking details.' });

    const bookingRef = 'CTB-BK-' + Math.floor(10000 + Math.random() * 90000);
    const booking = await Booking.create({
      id,
      bookingRef,
      guestName,
      guestPhone: guestPhone || 'N/A',
      section: section || SECTIONS.GUEST_HOUSE,
      roomOrTable: roomOrTable || 'Suite/Table 01',
      checkInDate: checkInDate || todayISO(),
      checkOutDate: checkOutDate || todayISO(),
      numGuests: Number(numGuests) || 1,
      totalAmount: Number(totalAmount) || 0,
      paymentStatus: paymentStatus || 'Paid',
      receiptGeneratedBy: req.user.username,
      submittedToAdmin: true,
      createdAt: new Date().toISOString(),
    });

    await logActivity(
      req.user.username,
      `Generated & submitted booking receipt ${bookingRef} for ${guestName} (${money(booking.totalAmount)})`,
      req.user.role,
      booking.section
    );

    res.json({ ok: true, booking });
  } catch (err) {
    console.error('[bookings/create]', err);
    res.status(500).json({ ok: false, error: 'Failed to create booking receipt.' });
  }
});

module.exports = router;
