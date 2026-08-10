const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    bookingRef: { type: String, required: true },
    guestName: { type: String, required: true },
    guestPhone: { type: String, default: 'N/A' },
    section: { type: String, required: true },
    roomOrTable: { type: String, required: true },
    checkInDate: { type: String, default: '' },
    checkOutDate: { type: String, default: '' },
    numGuests: { type: Number, default: 1 },
    totalAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'Paid' },
    receiptGeneratedBy: { type: String, default: '' },
    submittedToAdmin: { type: Boolean, default: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Booking', BookingSchema);
