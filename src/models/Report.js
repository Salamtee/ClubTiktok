const mongoose = require('mongoose');

const ReportLineSchema = new mongoose.Schema(
  {
    itemId: String,
    name: String,
    qty: Number,
    price: Number,
  },
  { _id: false }
);

const ReportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    authorId: { type: String, required: true },
    authorUsername: { type: String, required: true },
    authorRole: { type: String, required: true },
    section: { type: String, required: true },
    type: { type: String, default: 'staff' },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    submittedAt: { type: String, default: () => new Date().toISOString() },
    lines: { type: [ReportLineSchema], default: [] },
    totalSales: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    recipients: { type: [String], default: [] },
    status: { type: String, default: 'Pending' },
    verifiedBy: { type: String, default: null },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Report', ReportSchema);
