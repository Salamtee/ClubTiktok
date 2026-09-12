const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    section: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    stockQuantity: { type: Number, required: true, default: 0 },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Item', ItemSchema);
