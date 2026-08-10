require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db');

const authRoutes = require('./src/routes/auth');
const stateRoutes = require('./src/routes/state');
const userRoutes = require('./src/routes/users');
const itemRoutes = require('./src/routes/items');
const reportRoutes = require('./src/routes/reports');
const stockRoutes = require('./src/routes/stock');
const bookingRoutes = require('./src/routes/bookings');
const activityRoutes = require('./src/routes/activity');

const app = express();

// FRONTEND_URL can be a single origin or a comma-separated list, e.g.
// "https://club-tiktok.vercel.app,https://club-tiktok-git-main-you.vercel.app"
// Leave unset in local dev to allow any origin.
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length === 0 ? true : allowedOrigins,
}));
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/activity', activityRoutes);

// Serve the frontend as a static site from the same server.
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] Club Tiktok system running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('[server] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
