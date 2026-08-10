const mongoose = require('mongoose');

const StockLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    section: { type: String, required: true },
    supplierName: { type: String, required: true },
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    qtyReceived: { type: Number, required: true },
    unitCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    receivedBy: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('StockLog', StockLogSchema);
