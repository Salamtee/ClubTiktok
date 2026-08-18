const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'system_settings' },
    shiftTimes: {
      Morning: { start: { type: String, default: '08:00' }, end: { type: String, default: '16:00' } },
      Afternoon: { start: { type: String, default: '12:00' }, end: { type: String, default: '20:00' } },
      Evening: { start: { type: String, default: '16:00' }, end: { type: String, default: '00:00' } },
      Night: { start: { type: String, default: '00:00' }, end: { type: String, default: '08:00' } },
    },
    updatedAt: { type: String, default: () => new Date().toISOString() },
    updatedBy: { type: String, default: 'system' },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Setting', SettingSchema);
