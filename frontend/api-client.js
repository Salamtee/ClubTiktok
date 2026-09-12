/* ============================================================
   Club Tiktok — API Client (replaces the old localStorage mock)
   Talks to the Node.js/Express + MongoDB backend over fetch().
   Exposes the exact same `Api`, `ROLES`, `SECTIONS`, `STAFF_ROLES`,
   `getPresetAvatar`, `uid` surface the UI (app.js) already expects,
   so the rest of the app did not need to be rewritten.

   Reads are served instantly from an in-memory cache that is
   populated from the server on login / boot. Writes update that
   cache immediately (so the UI feels instant) and persist to
   MongoDB in the background; if the server rejects a write the
   cache change is rolled back and the user is notified.
   ============================================================ */

const API_BASE = 'https://clubtiktok-r4u8.onrender.com'; // Render backend URL

const ROLES = {
  ADMIN: 'System Admin',
  SUPERVISOR: 'Supervisor',
  MANAGER: 'Manager',
  SHISHA: 'Shisha Agent',
  BAR1: 'Bar Tender — General',
  BAR2: 'Bar Tender — VIP',
  WAITER: 'Waiter',
  WAITRESS: 'Waitress',
};

const SECTIONS = {
  BAR: 'Bar',
  RESTAURANT: 'Restaurant',
  GUEST_HOUSE: 'Guest House',
  SHISHA: 'Shisha',
  MANAGEMENT: 'Management',
};

const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night', 'All'];
const STAFF_ROLES = [ROLES.SHISHA, ROLES.BAR1, ROLES.BAR2, ROLES.WAITER, ROLES.WAITRESS];

const TOKEN_KEY = 'ctb_token';

function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

function getPresetAvatar(name, gender = 'm') {
  const bgColors = ['#C9A227', '#4C7A57', '#3A6EA5', '#A63A3A', '#7A2020', '#6B5B95'];
  const hash = (name || 'Staff').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = bgColors[hash % bgColors.length];
  const initialsText = (name || 'CT').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="60" fill="${color}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="42" font-weight="bold">${initialsText}</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

/* ---------------- in-memory cache ---------------- */
let cache = { users: [], items: [], reports: [], stockLog: [], bookings: [], activity: [], settings: null };
let currentUser = null;
let authToken = localStorage.getItem(TOKEN_KEY) || null;

function notifyError(message) {
  console.error('[api]', message);
  if (typeof window.toast === 'function') window.toast(message);
}

async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { ok: false, error: 'Unexpected server response.' };
  }
  if (!res.ok && data.ok === undefined) {
    data = { ok: false, error: data.error || `Request failed (${res.status}).` };
  }
  return data;
}

function pushActivity(username, action, role = '', section = '') {
  cache.activity.unshift({
    id: uid('a'),
    username: username || 'user',
    role: role || '',
    section: section || '',
    action: action || '',
    at: new Date().toISOString(),
  });
  cache.activity = cache.activity.slice(0, 150);
}

async function fetchState() {
  const res = await apiRequest('/api/state');
  if (res.ok) {
    cache = {
      users: res.users || [],
      items: res.items || [],
      reports: res.reports || [],
      stockLog: res.stockLog || [],
      bookings: res.bookings || [],
      activity: res.activity || [],
      settings: res.settings || null,
    };
  }
  return res.ok;
}

/* ---------------- Api ---------------- */
const Api = {
  /* ---------- auth & session ---------- */
  async login(username, password, role, shift) {
    const res = await apiRequest('/api/auth/login', { method: 'POST', body: { username, password, shift } });
    if (!res.ok) return res;
    authToken = res.token;
    localStorage.setItem(TOKEN_KEY, authToken);
    currentUser = res.user;
    await fetchState();
    return { ok: true, user: currentUser };
  },

  // Called once at app boot. Validates any stored session and hydrates the
  // cache. Resolves to the restored user, or null if there is no session.
  async restoreSession() {
    if (!authToken) return null;
    const me = await apiRequest('/api/auth/me');
    if (!me.ok) {
      authToken = null;
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    currentUser = me.user;
    await fetchState();
    return currentUser;
  },

  getCurrentUser() {
    return currentUser;
  },

  async logout() {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // best-effort — still clear the local session below
    }
    authToken = null;
    currentUser = null;
    cache = { users: [], items: [], reports: [], stockLog: [], bookings: [], activity: [] };
    localStorage.removeItem(TOKEN_KEY);
  },

  /* ---------- Section Financial Totals & Metrics (Admin) ---------- */
  getSectionTotals() {
    const today = new Date().toISOString().slice(0, 10);
    const sections = {
      [SECTIONS.BAR]: { name: 'Bar & VIP Lounge', totalSales: 0, todaySales: 0, reportsCount: 0, itemsCount: 0, icon: '🍷' },
      [SECTIONS.RESTAURANT]: { name: 'Fine Restaurant', totalSales: 0, todaySales: 0, reportsCount: 0, itemsCount: 0, icon: '🍽️' },
      [SECTIONS.GUEST_HOUSE]: { name: 'Guest House Rooms', totalSales: 0, todaySales: 0, reportsCount: 0, itemsCount: 0, icon: '🏨' },
      [SECTIONS.SHISHA]: { name: 'Shisha Lounge', totalSales: 0, todaySales: 0, reportsCount: 0, itemsCount: 0, icon: '💨' },
    };

    (cache.items || []).forEach(item => {
      const cat = item.category || '';
      const secKey = item.section || (cat.includes('Bar') ? SECTIONS.BAR :
        cat.includes('Shisha') ? SECTIONS.SHISHA :
          cat.includes('Guest') ? SECTIONS.GUEST_HOUSE : SECTIONS.RESTAURANT);
      if (sections[secKey]) sections[secKey].itemsCount++;
    });

    (cache.reports || []).forEach(r => {
      let secKey = r.section;
      if (!secKey) {
        if (r.lines && r.lines.length > 0) {
          const firstItem = (cache.items || []).find(i => i.id === r.lines[0].itemId);
          secKey = firstItem ? firstItem.section : SECTIONS.BAR;
        } else if (r.authorRole?.includes('Shisha')) secKey = SECTIONS.SHISHA;
        else if (r.authorRole?.includes('Bar')) secKey = SECTIONS.BAR;
        else secKey = SECTIONS.RESTAURANT;
      }
      if (sections[secKey]) {
        sections[secKey].totalSales += (r.totalSales || 0);
        sections[secKey].reportsCount++;
        if (r.date && r.date.slice(0, 10) === today) {
          sections[secKey].todaySales += (r.totalSales || 0);
        }
      }
    });

    const grandTotal = Object.values(sections).reduce((acc, s) => acc + s.totalSales, 0);
    return { sections, grandTotal };
  },

  /* ---------- Users & Staff Registration ---------- */
  listUsers() {
    return cache.users;
  },

  createUser({ username, password, fullName, role, section, shift, phone, address, nationalId, emergencyContact, photoUrl }) {
    if (cache.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: 'That username is already registered.' };
    }
    const id = uid('u');
    const finalPhoto = photoUrl || getPresetAvatar(fullName);
    const user = {
      id, username, fullName,
      role: role || ROLES.WAITER,
      section: section || SECTIONS.BAR,
      shift: shift || 'Morning',
      phone: phone || 'N/A',
      address: address || 'Freetown',
      nationalId: nationalId || 'N/A',
      emergencyContact: emergencyContact || 'N/A',
      photoUrl: finalPhoto,
      status: 'active',
      isOnline: false,
      lastSignInAt: null,
      lastSignOutAt: null,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    cache.users.push(user);
    pushActivity(currentUser?.username || 'admin', `Registered staff "${fullName}" (${user.role} - ${user.section}, Shift: ${user.shift})`, currentUser?.role, currentUser?.section);

    apiRequest('/api/users', { method: 'POST', body: { id, username, password, fullName, role: user.role, section: user.section, shift: user.shift, phone: user.phone, address: user.address, nationalId: user.nationalId, emergencyContact: user.emergencyContact, photoUrl: finalPhoto } })
      .then(res => {
        if (!res.ok) {
          cache.users = cache.users.filter(u => u.id !== id);
          notifyError(res.error || 'Failed to save the new staff account.');
        }
      })
      .catch(() => {
        cache.users = cache.users.filter(u => u.id !== id);
        notifyError('Network error while registering staff. Please try again.');
      });

    return { ok: true, user };
  },

  updateUser(id, patch) {
    const u = cache.users.find(x => x.id === id);
    if (!u) return { ok: false, error: 'User not found' };
    
    // Copy patch data without password to local cache
    const localPatch = { ...patch };
    delete localPatch.password;
    Object.assign(u, localPatch);

    pushActivity(currentUser?.username || 'admin', `Updated staff details for "${u.fullName}"`, currentUser?.role, currentUser?.section);

    apiRequest(`/api/users/${id}`, { method: 'PATCH', body: patch })
      .then(res => {
        if (!res.ok) {
          notifyError(res.error || 'Failed to save staff update.');
        } else if (res.user) {
          Object.assign(u, res.user);
        }
      })
      .catch(() => notifyError('Network error while saving staff update.'));

    return { ok: true, user: u };
  },

  deleteUser(id) {
    const u = cache.users.find(x => x.id === id);
    if (!u) return { ok: false, error: 'User not found' };
    const originalUsers = [...cache.users];
    cache.users = cache.users.filter(x => x.id !== id);
    pushActivity(currentUser?.username || 'admin', `Deleted staff account "${u.fullName}" (${u.username})`, currentUser?.role, currentUser?.section);

    apiRequest(`/api/users/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) {
          cache.users = originalUsers;
          notifyError(res.error || 'Failed to delete staff account.');
        }
      })
      .catch(() => {
        cache.users = originalUsers;
        notifyError('Network error while deleting staff account.');
      });

    return { ok: true };
  },

  /* ---------- Items & Pricing ---------- */
  listItems(section) {
    if (!section || section === 'All' || section === 'Management') {
      return cache.items;
    }
    const secStr = String(section).toLowerCase();
    return cache.items.filter(item => {
      const iSec = String(item.section || item.category || '').toLowerCase();
      return iSec === secStr || iSec.includes(secStr) || secStr.includes(iSec);
    });
  },

  createItem({ name, category, section, price, stockQuantity }) {
    const id = uid('i');
    const sec = section || (category.includes('Bar') ? SECTIONS.BAR :
      category.includes('Shisha') ? SECTIONS.SHISHA :
        category.includes('Guest') ? SECTIONS.GUEST_HOUSE : SECTIONS.RESTAURANT);
    const item = { id, name, category, section: sec, price: Number(price), stockQuantity: Number(stockQuantity) };
    cache.items.push(item);
    pushActivity(currentUser?.username || 'system', `Added item "${name}" (Le ${price}, Stock: ${stockQuantity})`, currentUser?.role, currentUser?.section);

    apiRequest('/api/items', { method: 'POST', body: item })
      .then(res => {
        if (!res.ok) {
          cache.items = cache.items.filter(i => i.id !== id);
          notifyError(res.error || 'Failed to save the new item.');
        }
      })
      .catch(() => {
        cache.items = cache.items.filter(i => i.id !== id);
        notifyError('Network error while adding item.');
      });

    return { ok: true, item };
  },

  updateItem(id, patch) {
    const item = cache.items.find(i => i.id === id);
    if (!item) return { ok: false };
    Object.assign(item, patch);
    pushActivity(currentUser?.username || 'system', `Updated item "${item.name}"`, currentUser?.role, currentUser?.section);

    apiRequest(`/api/items/${id}`, { method: 'PATCH', body: patch })
      .then(res => { if (!res.ok) notifyError(res.error || 'Failed to save item update.'); })
      .catch(() => notifyError('Network error while saving item update.'));

    return { ok: true, item };
  },

  deleteItem(id) {
    const item = cache.items.find(i => i.id === id);
    cache.items = cache.items.filter(i => i.id !== id);
    if (item) pushActivity(currentUser?.username || 'system', `Removed item "${item.name}"`, currentUser?.role, currentUser?.section);

    apiRequest(`/api/items/${id}`, { method: 'DELETE' })
      .then(res => { if (!res.ok) notifyError(res.error || 'Failed to remove item.'); })
      .catch(() => notifyError('Network error while removing item.'));

    return { ok: true };
  },

  /* ---------- Daily Reports ---------- */
  submitReport({ authorId, authorUsername, authorRole, section, type, lines, totalSales, notes, recipients }) {
    const id = uid('r');
    const author = cache.users.find(u => u.id === authorId);
    const reportSection = section || author?.section || SECTIONS.BAR;

    const report = {
      id, authorId, authorUsername, authorRole,
      section: reportSection,
      type,
      date: new Date().toISOString().slice(0, 10),
      submittedAt: new Date().toISOString(),
      lines: lines || [],
      totalSales: Number(totalSales) || 0,
      notes: notes || '',
      recipients: recipients || [],
      status: 'Pending',
      verifiedBy: null,
    };
    cache.reports.unshift(report);

    if (lines && lines.length > 0) {
      lines.forEach(l => {
        const item = cache.items.find(i => i.id === l.itemId);
        if (item) item.stockQuantity = Math.max(0, item.stockQuantity - l.qty);
      });
    }

    pushActivity(authorUsername, `Submitted ${reportSection} daily report (Le ${report.totalSales})`, authorRole, reportSection);

    apiRequest('/api/reports', { method: 'POST', body: report })
      .then(res => { if (!res.ok) notifyError(res.error || 'Failed to submit report.'); })
      .catch(() => notifyError('Network error while submitting report.'));

    return { ok: true, report };
  },

  listReports() {
    return cache.reports;
  },

  verifyReport(id) {
    const r = cache.reports.find(x => x.id === id);
    if (!r) return { ok: false };
    r.status = 'Verified';
    r.verifiedBy = currentUser?.username || 'unknown';
    pushActivity(currentUser?.username || 'system', `Verified report ${id} (${r.section})`, currentUser?.role, currentUser?.section);

    apiRequest(`/api/reports/${id}/verify`, { method: 'PATCH' })
      .then(res => { if (!res.ok) notifyError(res.error || 'Failed to verify report.'); })
      .catch(() => notifyError('Network error while verifying report.'));

    return { ok: true };
  },

  /* ---------- Supplier Stock Received & Stock In/Out Logs ---------- */
  listStockLogs() {
    return cache.stockLog;
  },

  recordStockIn({ section, supplierName, itemId, qtyReceived, unitCost, notes }) {
    if (currentUser?.role === ROLES.ADMIN) {
      return { ok: false, error: 'System Admin accounts are view-only for stock and cannot record stock received.' };
    }

    const item = cache.items.find(i => i.id === itemId);
    if (!item) return { ok: false, error: 'Select a valid item to replenish.' };

    const qty = Number(qtyReceived);
    if (isNaN(qty) || qty <= 0) return { ok: false, error: 'Enter a valid stock quantity.' };

    const id = uid('st');
    const cost = Number(unitCost) || item.price * 0.6;
    item.stockQuantity += qty;

    const entry = {
      id,
      date: new Date().toISOString().slice(0, 10),
      section: section || item.section || SECTIONS.BAR,
      supplierName: supplierName || 'General Supplier',
      itemId: item.id,
      itemName: item.name,
      qtyReceived: qty,
      unitCost: cost,
      totalCost: cost * qty,
      receivedBy: currentUser?.username || 'supervisor',
      notes: notes || '',
    };

    cache.stockLog.unshift(entry);
    pushActivity(currentUser?.username || 'supervisor', `Recorded +${qty} ${item.name} received from ${entry.supplierName} (${entry.section})`, currentUser?.role, entry.section);

    apiRequest('/api/stock', { method: 'POST', body: entry })
      .then(res => { if (!res.ok) notifyError(res.error || 'Failed to record stock received.'); })
      .catch(() => notifyError('Network error while recording stock received.'));

    return { ok: true, entry, item };
  },

  /* ---------- Booking Receipts & Admin Submissions ---------- */
  listBookings() {
    return cache.bookings;
  },

  createBooking({ guestName, guestPhone, section, roomOrTable, checkInDate, checkOutDate, numGuests, totalAmount, paymentStatus }) {
    if (currentUser?.role === ROLES.ADMIN) {
      return { ok: false, error: 'System Admin accounts are view-only for booking receipts and cannot generate new receipts.' };
    }

    const id = uid('bk');
    const bookingRef = 'CTB-BK-' + Math.floor(10000 + Math.random() * 90000);
    const booking = {
      id, bookingRef, guestName,
      guestPhone: guestPhone || 'N/A',
      section: section || SECTIONS.GUEST_HOUSE,
      roomOrTable: roomOrTable || 'Suite/Table 01',
      checkInDate: checkInDate || new Date().toISOString().slice(0, 10),
      checkOutDate: checkOutDate || new Date().toISOString().slice(0, 10),
      numGuests: Number(numGuests) || 1,
      totalAmount: Number(totalAmount) || 0,
      paymentStatus: paymentStatus || 'Paid',
      receiptGeneratedBy: currentUser?.username || 'supervisor',
      submittedToAdmin: true,
      createdAt: new Date().toISOString(),
    };

    cache.bookings.unshift(booking);
    pushActivity(currentUser?.username || 'supervisor', `Generated & submitted booking receipt ${bookingRef} for ${guestName} (Le ${Number(booking.totalAmount).toLocaleString()})`, currentUser?.role, booking.section);

    apiRequest('/api/bookings', { method: 'POST', body: booking })
      .then(res => { if (!res.ok) notifyError(res.error || 'Failed to create booking receipt.'); })
      .catch(() => notifyError('Network error while creating booking receipt.'));

    return { ok: true, booking };
  },

  /* ---------- Activity & Attendance Log ---------- */
  listActivity() {
    return cache.activity;
  },

  /* ---------- System Settings & Administration ---------- */
  getSettings() {
    return cache.settings || {
      key: 'system_settings',
      shiftTimes: {
        Morning: { start: '08:00', end: '16:00' },
        Afternoon: { start: '12:00', end: '20:00' },
        Evening: { start: '16:00', end: '00:00' },
        Night: { start: '00:00', end: '08:00' },
      },
    };
  },

  async updateShiftTimes(shiftTimes) {
    const res = await apiRequest('/api/settings', { method: 'PATCH', body: { shiftTimes } });
    if (res.ok && res.settings) {
      cache.settings = res.settings;
      pushActivity(currentUser?.username || 'admin', 'Updated operational shift times in System Settings', currentUser?.role, currentUser?.section);
    }
    return res;
  },

  async clearAllTotalSales() {
    const res = await apiRequest('/api/settings/clear-sales', { method: 'POST' });
    if (res.ok) {
      cache.reports = [];
      cache.bookings = [];
      pushActivity(currentUser?.username || 'admin', 'Cleared all total sales data across system', currentUser?.role, currentUser?.section);
    }
    return res;
  },

  /* ---------- Utility ---------- */
  resetDemoData() {
    // Not a real data wipe — just clears the local session/cache so a
    // broken render can recover by re-syncing from MongoDB.
    authToken = null;
    currentUser = null;
    cache = { users: [], items: [], reports: [], stockLog: [], bookings: [], activity: [], settings: null };
    localStorage.removeItem(TOKEN_KEY);
  },
};