/* ============================================================
   Club Tiktok — Runtime config
   Sets the backend API base URL. This is the ONLY file you need
   to edit when the frontend (Vercel) and backend (Render) are
   deployed separately, on different domains.

   - Local dev, where the Express backend also serves this
     frontend from the same origin: leave this as ''.
   - Split deployment (Vercel + Render): set it to your Render
     service's URL, no trailing slash, e.g.
       'https://club-tiktok-backend.onrender.com'
   ============================================================ */

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

// EDIT this one line after you deploy the backend to Render:
const RENDER_BACKEND_URL = 'https://clubtiktok-r4u8.onrender.com';

window.__API_BASE__ = isLocal ? '' : RENDER_BACKEND_URL;
