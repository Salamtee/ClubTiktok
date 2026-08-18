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
const settingsRoutes = require('./src/routes/settings');

const app = express();

// Lightweight health/keep-alive endpoint. Deliberately registered before
// CORS/JSON middleware and outside /api's DB-dependent routes so it stays
// fast and responds even if something else is slow — this is what the
// keep-alive pinger below (and any external uptime monitor) hits.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

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
app.use('/api/settings', settingsRoutes);

// Serve the frontend as a static site from the same server.
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

const PORT = process.env.PORT || 5001;

// ------------------------------------------------------------------
// Keep-alive self-ping.
//
// Free hosting tiers (Render, Railway, etc.) spin the service down
// after a period of no incoming traffic, which means the next real
// request eats a slow cold start. To avoid that, once the server is
// up we periodically hit our own /api/health endpoint so the host
// always sees recent traffic and never puts the service to sleep.
//
// The public URL is picked up automatically:
//   - Render sets RENDER_EXTERNAL_URL for every web service.
//   - Otherwise, set KEEP_ALIVE_URL yourself (e.g. your Railway/
//     custom domain URL) in the environment.
// If neither is set (e.g. local dev), the pinger simply never
// starts — nothing else changes.
const KEEP_ALIVE_URL = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL || '';
const KEEP_ALIVE_INTERVAL_MS = Number(process.env.KEEP_ALIVE_INTERVAL_MS) || 10 * 60 * 1000; // 10 min

function startKeepAlivePinger() {
  if (!KEEP_ALIVE_URL) {
    console.log('[keep-alive] no KEEP_ALIVE_URL/RENDER_EXTERNAL_URL set — skipping self-ping (fine for local dev).');
    return;
  }

  const healthUrl = `${KEEP_ALIVE_URL.replace(/\/+$/, '')}/api/health`;

  const ping = async () => {
    try {
      const res = await fetch(healthUrl);
      console.log(`[keep-alive] ping ${healthUrl} -> ${res.status}`);
    } catch (err) {
      console.warn(`[keep-alive] ping failed: ${err.message}`);
    }
  };

  setInterval(ping, KEEP_ALIVE_INTERVAL_MS);
  // Fire one shortly after boot too, rather than waiting a full interval.
  setTimeout(ping, 15 * 1000);
  console.log(`[keep-alive] pinging ${healthUrl} every ${KEEP_ALIVE_INTERVAL_MS / 60000} min.`);
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] Club Tiktok system running on http://localhost:${PORT}`);
      startKeepAlivePinger();
    });
  })
  .catch((err) => {
    console.error('[server] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
