const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, default: 'user' },
    role: { type: String, default: '' },
    section: { type: String, default: '' },
    action: { type: String, default: '' },
    at: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Activity', ActivitySchema);
