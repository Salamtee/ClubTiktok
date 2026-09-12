/* ============================================================
   Club Tiktok — Data Layer & API Module
   Talks to the real backend (Express + Supabase) instead of
   localStorage. All Api methods keep the exact same synchronous
   signatures app.js already calls: on boot we hydrate an
   in-memory cache from the server (see Api.ready()), then every
   read/write in this file works against that cache instantly,
   while writes are pushed to the server in the background.
   ============================================================ */

const API_BASE = (window.API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const LOCAL_SNAPSHOT_KEY = 'ctb_snapshot_v1';
const SESSION_KEY = 'ctb_session_v8'; // device-local session only

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

const STAFF_ROLES = [ROLES.SHISHA, ROLES.BAR1, ROLES.BAR2, ROLES.WAITER, ROLES.WAITRESS];

function calculatePunctuality(shiftName, dateObj = new Date()) {
  return { status: 'On Time', label: 'On Time', minutesLate: 0, badge: '🟢 On Time' };
}

function getPresetAvatar(name, gender = 'm') {
  return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSI2MCIgZmlsbD0iI0M5QTIyNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTQlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0MiIgZm9udC13ZWlnaHQ9ImJvbGQiPkNUPC90ZXh0Pjwvc3ZnPg==';
}

function uid(prefix) { return prefix + '_' + Math.random().toString(36).slice(2, 9); }
function todayISO() { return new Date().toISOString().slice(0, 10); }

/* ---------------- in-memory cache, hydrated from the server ---------------- */
const COLLECTIONS = ['users', 'items', 'reports', 'activity', 'stockLog', 'stockAdjustments', 'bookings'];
const CACHE = { users: [], items: [], reports: [], activity: [], stockLog: [], stockAdjustments: [], bookings: [] };

let _readyResolve;
const _readyPromise = new Promise(res => { _readyResolve = res; });

function saveSnapshot() {
  try { localStorage.setItem(LOCAL_SNAPSHOT_KEY, JSON.stringify(CACHE)); } catch (e) { /* ignore */ }
}
function loadSnapshot() {
  try {
    const raw = localStorage.getItem(LOCAL_SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

async function hydrate() {
  try {
    const results = await Promise.all(
      COLLECTIONS.map(name =>
        fetch(`${API_BASE}/${name}`).then(r => {
          if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
          return r.json();
        })
      )
    );
    COLLECTIONS.forEach((name, i) => { CACHE[name] = Array.isArray(results[i]) ? results[i] : []; });
    saveSnapshot();
  } catch (err) {
    console.warn('Could not reach backend, using last known local snapshot instead:', err.message);
    const snap = loadSnapshot();
    if (snap) {
      COLLECTIONS.forEach(name => { CACHE[name] = snap[name] || []; });
    }
  } finally {
    _readyResolve();
  }
}
hydrate();

/* fire-and-forget sync helpers — the UI already has its answer from the
   cache by the time these resolve, so we just log failures instead of
   blocking anything on them. */
function syncCreate(collection, obj) {
  fetch(`${API_BASE}/${collection}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj),
  }).catch(err => console.error(`Sync create failed (${collection}):`, err.message));
}
function syncUpdate(collection, id, patch) {
  fetch(`${API_BASE}/${collection}/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
  }).catch(err => console.error(`Sync update failed (${collection}):`, err.message));
}
function syncDelete(collection, id) {
  fetch(`${API_BASE}/${collection}/${id}`, { method: 'DELETE' })
    .catch(err => console.error(`Sync delete failed (${collection}):`, err.message));
}

function getStored(key, defaultVal) {
  // local-only values (currently just the session) still use localStorage
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}
function setStored(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { console.error('Failed to save to localStorage:', e); }
}

const Api = {
  /* call & await this once before the very first Api.* call (app.js's
     boot() already does this) so the cache is populated from the server */
  ready() { return _readyPromise; },

  /* Auth */
  login(username, password, role, shift) {
    const users = this.listUsers();
    const cleanUsername = (username || '').toLowerCase().trim();
    let u = users.find(x => x.username.toLowerCase() === cleanUsername);

    if (u) {
      const updatedUser = { ...u, shift: shift || u.shift || 'Day Shift', isOnline: true };
      if (role) updatedUser.role = role;
      this.updateUser(u.id, { isOnline: true, shift: updatedUser.shift, role: updatedUser.role });
      setStored(SESSION_KEY, updatedUser);
      this.logActivity('Sign In', `${updatedUser.fullName} (${updatedUser.role}) signed in for ${shift || 'Day Shift'}`, updatedUser.fullName, updatedUser.role);
      return { ok: true, user: updatedUser };
    }

    const roleVal = role || ROLES.ADMIN;
    let sectionVal = SECTIONS.MANAGEMENT;
    if ([ROLES.BAR1, ROLES.BAR2].includes(roleVal)) sectionVal = SECTIONS.BAR;
    if ([ROLES.WAITER, ROLES.WAITRESS].includes(roleVal)) sectionVal = SECTIONS.RESTAURANT;
    if (roleVal === ROLES.SHISHA) sectionVal = SECTIONS.SHISHA;

    const newUser = {
      id: uid('u'), username: username || 'user',
      fullName: username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Staff Member',
      role: roleVal, section: sectionVal, shift: shift || 'Day Shift',
      status: 'active', isOnline: true, createdAt: todayISO(),
    };
    CACHE.users.push(newUser);
    saveSnapshot();
    syncCreate('users', newUser);
    setStored(SESSION_KEY, newUser);
    this.logActivity('Sign In', `${newUser.fullName} (${newUser.role}) signed in for ${shift || 'Day Shift'}`, newUser.fullName, newUser.role);
    return { ok: true, user: newUser };
  },

  async authenticate(username, password, role, shift) {
    return this.login(username, password, role, shift);
  },

  getCurrentUser() {
    return getStored(SESSION_KEY, null);
  },

  logout() {
    const u = this.getCurrentUser();
    if (u) {
      this.updateUser(u.id, { isOnline: false });
      this.logActivity('Sign Out', `${u.fullName} (${u.role}) signed out`, u.fullName, u.role);
    }
    localStorage.removeItem(SESSION_KEY);
    return { ok: true };
  },

  /* Users */
  listUsers() { return CACHE.users; },
  getStaffMembers() { return this.listUsers(); },
  createUser(data) {
    const newUser = { id: uid('u'), status: 'active', isOnline: false, createdAt: todayISO(), ...data };
    CACHE.users.push(newUser);
    saveSnapshot();
    syncCreate('users', newUser);
    return { ok: true, user: newUser };
  },
  registerStaff(data) { return this.createUser(data); },
  updateUser(id, data) {
    const idx = CACHE.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      CACHE.users[idx] = { ...CACHE.users[idx], ...data };
      saveSnapshot();
      syncUpdate('users', id, data);
      return { ok: true, user: CACHE.users[idx] };
    }
    return { ok: false, error: 'User not found' };
  },
  deleteUser(id) {
    const idx = CACHE.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      const removed = CACHE.users.splice(idx, 1)[0];
      saveSnapshot();
      syncDelete('users', id);
      return { ok: true, user: removed };
    }
    return { ok: false, error: 'User not found' };
  },

  /* Items & Inventory */
  listItems(section) {
    if (!section || section === 'All' || section === 'Management') return CACHE.items;
    const secStr = String(section).toLowerCase();
    return CACHE.items.filter(item => {
      const iSec = String(item.section || item.category || '').toLowerCase();
      return iSec === secStr || iSec.includes(secStr) || secStr.includes(iSec);
    });
  },
  listInventory(section) { return this.listItems(section); },
  createItem(data) {
    const newItem = {
      id: uid('i'),
      qty: Number(data.qty || 0),
      cost: Number(data.cost || 0),
      price: Number(data.price || 0),
      reorderLevel: Number(data.reorderLevel || 5),
      status: Number(data.qty || 0) > 0 ? 'In Stock' : 'Out of Stock',
      ...data,
    };
    CACHE.items.push(newItem);
    saveSnapshot();
    syncCreate('items', newItem);
    return { ok: true, item: newItem };
  },
  updateItem(id, data) {
    const idx = CACHE.items.findIndex(i => i.id === id);
    if (idx !== -1) {
      CACHE.items[idx] = { ...CACHE.items[idx], ...data };
      if (data.qty !== undefined) {
        CACHE.items[idx].status = Number(CACHE.items[idx].qty) > 0 ? 'In Stock' : 'Out of Stock';
      }
      saveSnapshot();
      syncUpdate('items', id, CACHE.items[idx]);
      return { ok: true, item: CACHE.items[idx] };
    }
    return { ok: false, error: 'Item not found' };
  },
  deleteItem(id) {
    CACHE.items = CACHE.items.filter(i => i.id !== id);
    saveSnapshot();
    syncDelete('items', id);
    return { ok: true };
  },
  getInventoryMetrics(secFilter = 'ALL') {
    let items = this.listItems();
    if (secFilter !== 'ALL') items = items.filter(i => i.section === secFilter);
    const totalItems = items.length;
    const lowStockItems = items.filter(i => i.qty > 0 && i.qty <= (i.reorderLevel || 5)).length;
    const outOfStockItems = items.filter(i => i.qty <= 0).length;
    const totalValue = items.reduce((sum, i) => sum + (i.qty * i.cost), 0);
    const totalSalesValue = items.reduce((sum, i) => sum + (i.qty * i.price), 0);
    const profitMargin = totalValue > 0 ? Math.round(((totalSalesValue - totalValue) / totalSalesValue) * 100) : 0;
    return { totalItems, lowStockItems, outOfStockItems, totalValue, totalSalesValue, profitMargin };
  },

  /* Reports & Section Totals */
  listReports() { return CACHE.reports; },
  submitReport(data) {
    const newReport = {
      id: uid('rep'), date: todayISO(), status: 'Submitted', verified: false,
      totalSales: Number(data.totalSales || 0), ...data,
    };
    CACHE.reports.unshift(newReport);
    saveSnapshot();
    syncCreate('reports', newReport);
    this.logActivity('Report Submitted', `Daily report submitted for ${newReport.section} (Le ${newReport.totalSales})`, newReport.authorName, newReport.authorRole);
    return { ok: true, report: newReport };
  },
  verifyReport(id) {
    const rep = CACHE.reports.find(r => r.id === id);
    if (rep) {
      rep.verified = true;
      rep.status = 'Verified & Approved';
      saveSnapshot();
      syncUpdate('reports', id, { verified: true, status: 'Verified & Approved' });
      this.logActivity('Report Verified', `Report #${id} for ${rep.section} verified by System Admin`, 'System Admin', ROLES.ADMIN);
      return { ok: true };
    }
    return { ok: false };
  },
  getSectionTotals() {
    const reports = this.listReports();
    const today = todayISO();
    const sections = {
      [SECTIONS.BAR]: { name: 'Bar & VIP Lounge', icon: '🍷', totalSales: 0, todaySales: 0, reportsCount: 0 },
      [SECTIONS.RESTAURANT]: { name: 'Fine Dining Restaurant', icon: '🍽️', totalSales: 0, todaySales: 0, reportsCount: 0 },
      [SECTIONS.GUEST_HOUSE]: { name: 'Guest House Suites', icon: '🏨', totalSales: 0, todaySales: 0, reportsCount: 0 },
      [SECTIONS.SHISHA]: { name: 'Exclusive Shisha Lounge', icon: '💨', totalSales: 0, todaySales: 0, reportsCount: 0 },
    };
    let grandTotal = 0;
    reports.forEach(r => {
      if (sections[r.section]) {
        sections[r.section].totalSales += Number(r.totalSales || 0);
        sections[r.section].reportsCount += 1;
        if (r.date === today) sections[r.section].todaySales += Number(r.totalSales || 0);
        grandTotal += Number(r.totalSales || 0);
      }
    });
    return { sections, grandTotal };
  },

  /* Activity Logs */
  listActivity() { return CACHE.activity; },
  logActivity(type, description, userName = 'System', role = 'System') {
    const entry = {
      id: uid('act'), timestamp: new Date().toISOString(),
      type, description, user: userName, role, badge: '🟢 Log',
    };
    CACHE.activity.unshift(entry);
    saveSnapshot();
    syncCreate('activity', entry);
  },

  /* Stock Logs & Inward */
  listStockLogs() { return CACHE.stockLog; },
  recordStockIn(data) {
    const newLog = {
      id: uid('stk'), date: todayISO(),
      qty: Number(data.qtyReceived || data.qty || 0),
      unitCost: Number(data.unitCost || 0),
      totalCost: Number(data.qtyReceived || data.qty || 0) * Number(data.unitCost || 0),
      ...data,
    };
    CACHE.stockLog.unshift(newLog);
    saveSnapshot();
    syncCreate('stockLog', newLog);

    if (data.itemId) {
      const item = CACHE.items.find(i => i.id === data.itemId);
      if (item) this.updateItem(item.id, { qty: Number(item.qty || 0) + Number(newLog.qty) });
    }
    this.logActivity('Stock Received', `Received ${newLog.qty} units for ${newLog.section}`, 'Staff', 'Inventory');
    return { ok: true, log: newLog };
  },

  /* Stock Adjustments */
  listStockAdjustments() { return CACHE.stockAdjustments; },
  recordStockAdjustment(data) {
    const newAdj = { id: uid('adj'), date: todayISO(), qtyChanged: Number(data.qtyChanged || 0), ...data };
    CACHE.stockAdjustments.unshift(newAdj);
    saveSnapshot();
    syncCreate('stockAdjustments', newAdj);

    if (data.itemId) {
      const item = CACHE.items.find(i => i.id === data.itemId);
      if (item) {
        const change = data.adjustmentType === 'Damage' || data.adjustmentType === 'Loss'
          ? -Math.abs(newAdj.qtyChanged) : Math.abs(newAdj.qtyChanged);
        const newQty = Math.max(0, Number(item.qty || 0) + change);
        this.updateItem(item.id, { qty: newQty });
      }
    }
    return { ok: true, adjustment: newAdj };
  },

  /* Bookings & Receipts */
  listBookings() { return CACHE.bookings; },
  createBooking(data) {
    const newBk = { id: uid('bk'), date: todayISO(), amount: Number(data.amount || 0), status: 'Confirmed', ...data };
    CACHE.bookings.unshift(newBk);
    saveSnapshot();
    syncCreate('bookings', newBk);
    this.logActivity('Booking Created', `Booking receipt for ${newBk.guestName} (${newBk.roomOrTable}) - Le ${newBk.amount}`, newBk.createdBy || 'Staff', ROLES.ADMIN);
    return { ok: true, booking: newBk };
  },

  /* Reset Demo Data — wipes & reseeds the real database, then re-hydrates
     the local cache. Returns a promise; app.js awaits it before reloading. */
  async resetDemoData() {
    try {
      await fetch(`${API_BASE}/reset`, { method: 'POST' });
    } catch (err) {
      console.error('Reset request failed:', err.message);
    }
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LOCAL_SNAPSHOT_KEY);
    await hydrate();
    return { ok: true };
  },
};

window.Api = Api;
window.api = Api;
