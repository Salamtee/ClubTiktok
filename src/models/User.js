const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    section: { type: String, default: 'Management' },
    shift: { type: String, default: 'Morning' },
    phone: { type: String, default: 'N/A' },
    address: { type: String, default: 'Freetown' },
    nationalId: { type: String, default: 'N/A' },
    emergencyContact: { type: String, default: 'N/A' },
    photoUrl: { type: String, default: '' },
    status: { type: String, default: 'active' },
    isOnline: { type: Boolean, default: false },
    punctualityStatus: { type: String, default: 'On Time' },
    punctualityMinutes: { type: Number, default: 0 },
    punctualityLabel: { type: String, default: 'On Time' },
    lastSignInAt: { type: Date, default: null },
    lastSignOutAt: { type: Date, default: null },
    createdAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', UserSchema);
