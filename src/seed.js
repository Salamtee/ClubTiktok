// Fix: c-ares (Node.js internal DNS) is configured to use 127.0.0.1 as its DNS
// server, but there is no DNS service running on localhost, causing ECONNREFUSED.
// Override to use Cloudflare (1.1.1.1) before any module that triggers DNS loads.
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config();
const bcrypt = require('bcryptjs');

const connectDB = require('./db');
const User = require('./models/User');
const Item = require('./models/Item');
const Report = require('./models/Report');
const StockLog = require('./models/StockLog');
const Booking = require('./models/Booking');
const Activity = require('./models/Activity');
const { ROLES, SECTIONS } = require('./constants');

async function run() {
  await connectDB();

  // Wipe everything so the system starts completely empty.
  await Promise.all([
    User.deleteMany({}),
    Item.deleteMany({}),
    Report.deleteMany({}),
    StockLog.deleteMany({}),
    Booking.deleteMany({}),
    Activity.deleteMany({}),
  ]);

  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({
    id: 'u_admin',
    username: 'soundboy',
    password: hashed,
    fullName: 'Sound Boy',
    role: ROLES.ADMIN,
    section: SECTIONS.MANAGEMENT,
    shift: 'All',
    phone: 'N/A',
    address: 'N/A',
    nationalId: 'N/A',
    emergencyContact: 'N/A',
    photoUrl: '',
    status: 'active',
    isOnline: false,
  });

  console.log('[seed] Database reset. Created a single default admin account:');
  console.log('[seed]   username: soundboy');
  console.log('[seed]   password: admin123');
  console.log('[seed]   fullName: Sound Boy');
  console.log('[seed] No other users, items, reports, stock, or bookings were created.');

  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
