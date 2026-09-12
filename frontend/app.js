/* ============================================================
   Club Tiktok — App Shell / Router / Views (v3.0)
   Includes Landing Page, Admin Section Totals, Staff Registration
   with Photos, Shifts & Personal Info, and Attendance Oversight.
   ============================================================ */

const state = {
  user: null,
  route: 'dashboard',
  screen: 'landing', // 'landing' | 'login' | 'app'
};

/* ---------------- icons ---------------- */
const ICONS = {
  grid: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  users: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  box: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>',
  file: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  activity: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  send: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  inbox: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></svg>',
  history: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>',
  settings: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  empty: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
};

/* ---------------- helpers ---------------- */
function money(n) { return 'Le ' + Number(n || 0).toLocaleString(); }
function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' +
         d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
function initials(name) {
  return (name || '?').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
}
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.hidden = true; }, 2800);
}

function openModal(title, bodyHTML, onMount) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = bodyHTML;
  $('#modalOverlay').hidden = false;
  if (onMount) onMount($('#modalBody'));
}
function closeModal() { $('#modalOverlay').hidden = true; }
$('#modalClose').addEventListener('click', closeModal);
$('#modalOverlay').addEventListener('click', e => { if (e.target === $('#modalOverlay')) closeModal(); });

/* ---------------- theme ---------------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ctb_theme', theme);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}
applyTheme(localStorage.getItem('ctb_theme') || 'dark');

$('#themeToggleLogin')?.addEventListener('click', toggleTheme);
$('#themeToggleApp')?.addEventListener('click', toggleTheme);
$('#themeToggleLanding')?.addEventListener('click', toggleTheme);

/* ---------------- screen management ---------------- */
function showScreen(screenName) {
  state.screen = screenName;
  $('#landingScreen').hidden = screenName !== 'landing';
  $('#loginScreen').hidden = screenName !== 'login';
  $('#appShell').hidden = screenName !== 'app';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Landing Page Actions
$('#btnOpenPortalHeader')?.addEventListener('click', () => showScreen('login'));
$('#btnOpenPortalHero')?.addEventListener('click', () => showScreen('login'));
$('#btnOpenPortalContact')?.addEventListener('click', () => showScreen('login'));
$('#btnBackToLanding')?.addEventListener('click', () => showScreen('landing'));

$('#btnExploreSections')?.addEventListener('click', () => {
  const el = $('#sectionsGrid');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
});

/* ---------------- nav config per role ---------------- */
function navForRole(role) {
  const dashboard = { id: 'dashboard', label: 'Dashboard', icon: 'grid' };
  switch (role) {
    case ROLES.ADMIN:
      return [
        dashboard,
        { id: 'users', label: 'Staff Accounts & Profiles', icon: 'users' },
        { id: 'allReports', label: 'All Daily Reports', icon: 'file' },
        { id: 'bookings', label: 'Guest Bookings & Receipts', icon: 'file' },
        { id: 'stock', label: 'Supplier Stock & Inward', icon: 'box' },
        { id: 'activity', label: 'Activity & Attendance Log', icon: 'activity' },
        { id: 'settings', label: 'System Settings', icon: 'settings' },
      ];
    case ROLES.SUPERVISOR:
    case ROLES.MANAGER:
      return [
        dashboard,
        { id: 'stock', label: 'Supplier Stock & Inward', icon: 'box' },
        { id: 'bookings', label: 'Guest Bookings & Receipts', icon: 'file' },
        { id: 'allReports', label: 'Section & Staff Reports', icon: 'file' },
        { id: 'inbox', label: 'Reports Inbox', icon: 'inbox' },
        { id: 'staff', label: 'Staff Performance & Sales', icon: 'users' },
        { id: 'items', label: 'Items & Pricing', icon: 'box' },
        { id: 'submit', label: 'Send Daily Report', icon: 'send' },
      ];
    default:
      return [
        dashboard,
        { id: 'items', label: 'Price List', icon: 'box' },
        { id: 'submit', label: 'Submit Daily Report', icon: 'send' },
        { id: 'myReports', label: 'My Reports', icon: 'history' },
      ];
  }
}

const PAGE_SUBTITLES = {
  dashboard: 'Executive Section Totals & Daily Overview',
  users: 'Register and manage staff personal details, photos, shifts & sections',
  items: 'Bar, Shisha, Restaurant and Guest Room pricing & inventory',
  allReports: 'Daily reports breakdown by section and individual staff member',
  activity: 'Live staff attendance sign-in/out and system audit trail',
  staff: 'Individual staff sales performance, sales generated, and daily reports inspection',
  inbox: 'Daily reports awaiting your review',
  submit: 'Submit your end-of-day sales & stock report',
  myReports: 'Your report submission history',
  stock: 'Record supplier stock received, track section inventory inward, and unit costs',
  bookings: 'Generate official booking receipts for Guest House suites & VIP tables, and submit to System Admin',
  settings: 'Configure operational shift times and clear system total sales data',
};

/* ---------------- auth & auto-fill ---------------- */
$('#username')?.addEventListener('input', e => {
  const v = e.target.value.toLowerCase().trim();
  const roleSelect = $('#loginRole');
  if (v === 'admin') roleSelect.value = ROLES.ADMIN;
  if (v === 'supervisor') roleSelect.value = ROLES.SUPERVISOR;
  if (v === 'manager') roleSelect.value = ROLES.MANAGER;
  if (v === 'shisha') roleSelect.value = ROLES.SHISHA;
  if (v === 'bartender1') roleSelect.value = ROLES.BAR1;
  if (v === 'bartender2') roleSelect.value = ROLES.BAR2;
  if (v === 'waiter') roleSelect.value = ROLES.WAITER;
  if (v === 'waitress') roleSelect.value = ROLES.WAITRESS;
});

$('#loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const username = $('#username')?.value || '';
  const password = $('#password')?.value || '';
  const role = $('#loginRole')?.value || '';
  const shift = $('#loginShift')?.value || '';
  const errEl = $('#loginError');
  if (errEl) errEl.hidden = true;

  try {
    const res = await Api.login(username, password, role, shift);
    
    if (!res || !res.ok) {
      if (errEl) {
        errEl.textContent = res?.error || 'Invalid login details.';
        errEl.hidden = false;
      }
      return;
    }
    
    state.user = res.user;
    enterApp();
  } catch(e) {
    console.error('Login Error:', e);
    if (errEl) {
      errEl.textContent = e?.message || 'An error occurred during login. Please check credentials and try again.';
      errEl.hidden = false;
    }
  }
});

$('#logoutBtn')?.addEventListener('click', async () => {
  await Api.logout();
  state.user = null;
  showScreen('login');
  $('#loginForm')?.reset();
  $('.sidebar')?.classList.remove('is-open');
  toast('Signed out successfully.');
});

function enterApp() {
  if (!state.user) return;
  showScreen('app');
  
  const userAvatar = $('#userAvatar');
  if (userAvatar) {
    if (state.user.photoUrl) {
      userAvatar.outerHTML = `<img id="userAvatar" class="avatar-img" src="${state.user.photoUrl}" alt="${state.user.fullName || 'User'}" />`;
    } else {
      userAvatar.outerHTML = `<div id="userAvatar" class="avatar-placeholder">${initials(state.user.fullName || 'User')}</div>`;
    }
  }

  const nameEl = $('#userName');
  if (nameEl) nameEl.textContent = state.user.fullName || state.user.username || 'User';
  
  const roleEl = $('#userRole');
  if (roleEl) roleEl.textContent = `${state.user.role || 'Staff'} · ${state.user.section || 'General'} (${state.user.shift || 'Shift'})`;
  
  const badgeEl = $('#roleBadgeText');
  if (badgeEl) badgeEl.textContent = state.user.role || 'Staff';
  
  const dateEl = $('#todayDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  buildNav();
  navigate('dashboard');
}

/* ---------------- nav / routing ---------------- */
function buildNav() {
  const nav = $('#sideNav');
  const items = navForRole(state.user.role);
  nav.innerHTML = items.map(it => `
    <button class="nav-item" data-route="${it.id}" type="button">
      ${ICONS[it.icon] || ''}<span>${it.label}</span>
    </button>
  `).join('');
  $all('.nav-item', nav).forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.route);
      $('.sidebar').classList.remove('is-open');
    });
  });
}

$('#navToggle')?.addEventListener('click', () => $('.sidebar').classList.toggle('is-open'));

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  users: 'Staff Accounts & Profiles',
  items: 'Items & Pricing',
  allReports: 'All Daily Reports',
  activity: 'Activity & Attendance Log',
  inbox: 'Reports Inbox',
  submit: 'Send Daily Report',
  myReports: 'My Reports',
  stock: 'Supplier Stock Received & Inward Logs',
  bookings: 'Guest House Bookings & Receipts',
  settings: 'System Settings',
};

function getViewRenderer(routeId) {
  const VIEWS = {
    dashboard: renderDashboard,
    users: renderUsers,
    items: renderItems,
    allReports: renderAllReports,
    activity: renderActivity,
    inbox: renderInbox,
    submit: renderSubmit,
    myReports: renderMyReports,
    stock: renderStock,
    bookings: renderBookings,
    settings: renderSettings,
  };
  return VIEWS[routeId] || VIEWS.dashboard;
}

function navigate(routeId) {
  try {
    // Junior staff privacy guard: restricted from seeing other staff reports or management routes
    if (STAFF_ROLES.includes(state.user?.role) && ['allReports', 'inbox', 'users', 'activity', 'stock', 'bookings'].includes(routeId)) {
      routeId = 'myReports';
    }

    state.route = routeId;
    $all('.nav-item').forEach(b => b.classList.toggle('is-active', b.dataset.route === routeId));
    $('#pageTitle').textContent = VIEW_TITLES[routeId] || 'Dashboard';
    if (routeId === 'bookings' && state.user?.role === ROLES.ADMIN) {
      $('#pageSubtitle').textContent = 'Inspect and view official guest house & VIP table booking receipts submitted to System Admin';
    } else if (routeId === 'stock' && state.user?.role === ROLES.ADMIN) {
      $('#pageSubtitle').textContent = 'Inspect supplier stock in deliveries, section inventory levels, and stock reduction logs';
    } else {
      $('#pageSubtitle').textContent = PAGE_SUBTITLES[routeId] || '';
    }
    const root = $('#viewRoot');
    const renderFn = getViewRenderer(routeId);
    root.innerHTML = renderFn();
    bindView(routeId, root);
    window.scrollTo({ top: 0 });
  } catch (err) {
    console.error('Error rendering view route:', routeId, err);
    const root = $('#viewRoot');
    if (root) {
      root.innerHTML = `
        <div class="card" style="padding:24px; margin-top:20px; text-align:center;">
          <h3 style="color:var(--gold-bright);">Dashboard Ready</h3>
          <p style="color:var(--text-dim); margin-top:8px;">Synchronizing workspace data...</p>
          <button class="btn btn--gold" style="margin-top:16px;" onclick="Api.resetDemoData(); location.reload();">Reset System Data & Refresh</button>
        </div>
      `;
    }
  }
}

/* ---------- Dashboard (Admin, Supervisor, Manager & Staff) ---------- */
function renderDashboard() {
  const role = state.user.role;
  const users = Api.listUsers();
  const items = Api.listItems();
  const reports = Api.listReports();
  const today = todayISO();
  const todaysReports = reports.filter(r => r.date === today);
  const todaysSales = todaysReports.reduce((s, r) => s + r.totalSales, 0);

  const isManagement = [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGER].includes(role);

  if (isManagement) {
    const { sections, grandTotal } = Api.getSectionTotals();

    const sectionCardsHTML = Object.entries(sections).map(([key, sec]) => {
      const sharePct = grandTotal > 0 ? Math.round((sec.totalSales / grandTotal) * 100) : 0;
      let badgeClass = 'badge--section-bar';
      if (key === SECTIONS.RESTAURANT) badgeClass = 'badge--section-rest';
      if (key === SECTIONS.GUEST_HOUSE) badgeClass = 'badge--section-guest';
      if (key === SECTIONS.SHISHA) badgeClass = 'badge--section-shisha';

      return `
        <div class="section-stat-card">
          <div class="section-stat-card__head">
            <span class="badge ${badgeClass}">${sec.name}</span>
            <span class="section-stat-card__icon">${sec.icon}</span>
          </div>
          <div class="section-stat-card__title">Total Section Sales</div>
          <div class="section-stat-card__val">${money(sec.totalSales)}</div>
          <div class="section-stat-card__sub">
            <span>Today: <b>${money(sec.todaySales)}</b></span>
            <span>Reports: <b>${sec.reportsCount}</b></span>
          </div>
          <div class="section-stat-card__bar">
            <div class="section-stat-card__fill" style="width: ${sharePct}%;"></div>
          </div>
          <div style="font-size: 11px; color: var(--text-faint); margin-top: 4px; text-align: right;">${sharePct}% of Total Revenue</div>
        </div>
      `;
    }).join('');

    const recentActivity = Api.listActivity();
    const monitoredStaff = users.filter(u => u.role !== ROLES.ADMIN);

    const stats = statCard('Staff Monitored', monitoredStaff.length, 'Active operational staff') +
      statCard('Items & Inventory', items.length, 'Managed across 4 sections') +
      statCard('Reports Today', todaysReports.length, 'Submitted daily reports') +
      statCard('Today\'s Total Revenue', money(todaysSales), 'Consolidated sales');

    return `
      <div class="section-head">
        <div>
          <h3>Executive Financial Totals & Section Overview</h3>
          <p>Real-time revenue consolidation across Bar, Restaurant, Guest House, and Shisha sections.</p>
        </div>
        <div class="stat-card" style="padding: 10px 18px; text-align: right;">
          <div class="stat-card__label">Grand Total Revenue</div>
          <div class="stat-card__value" style="font-size: 24px; color: var(--gold-bright);">${money(grandTotal)}</div>
        </div>
      </div>

      <div class="section-grid-4">
        ${sectionCardsHTML}
      </div>

      <div class="stat-grid" style="margin-top: 20px;">
        ${stats}
      </div>

      <div class="two-col" style="margin-top: 20px;">
        <div class="card">
          <div class="card__head">
            <h4>Recent Daily Reports Across Sections</h4>
          </div>
          ${reportsTable(reports.slice(0, 6))}
        </div>

        <div class="card">
          <div class="card__head">
            <h4>Live Activity & Staff Sign-Ins</h4>
          </div>
          <div class="activity-list">
            ${recentActivity.length ? recentActivity.map(a => `
              <div class="activity-row">
                <span class="activity-row__dot"></span>
                <span class="activity-row__text"><b>${a.username}</b> (${a.role || 'Staff'}) — ${a.action}</span>
                <span class="activity-row__time">${fmtDateTime(a.at)}</span>
              </div>
            `).join('') : emptyState('No activity recorded yet.')}
          </div>
        </div>
      </div>
    `;
  }

  // Junior Staff Dashboard (Shisha, Bartenders, Waiters, Waitresses)
  const mine = reports.filter(r => r.authorId === state.user.id);
  const lastReport = mine[0];
  const stats = statCard('Section Assigned', state.user.section || 'General', `Shift: ${state.user.shift || 'All'}`) +
    statCard('Items Available', items.length, 'Current price list') +
    statCard('My Reports This Week', mine.filter(r => withinDays(r.submittedAt, 7)).length, 'Submitted') +
    statCard('Last Submission', lastReport ? fmtDateTime(lastReport.submittedAt) : '—', lastReport ? money(lastReport.totalSales) : 'No reports yet');

  return `
    <div class="stat-grid">${stats}</div>
    <div class="card" style="margin-top: 20px;">
      <div class="card__head"><h4>My Recent Daily Reports</h4></div>
      ${reportsTable(mine.slice(0, 6))}
    </div>
  `;
}

function statCard(label, value, meta) {
  return `<div class="stat-card">
    <div class="stat-card__label">${label}</div>
    <div class="stat-card__value">${value}</div>
    <div class="stat-card__meta">${meta}</div>
  </div>`;
}
function emptyState(msg) {
  return `<div class="empty-state">${ICONS.empty}<p>${msg}</p></div>`;
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function withinDays(iso, days) {
  return (Date.now() - new Date(iso).getTime()) < days * 86400000;
}

function reportsTable(reports) {
  if (!reports.length) return emptyState('No reports submitted yet.');
  return `<div class="table-wrap"><table>
    <thead><tr><th>Date</th><th>Staff</th><th>Role & Section</th><th>Total</th><th>Status</th></tr></thead>
    <tbody>
      ${reports.map(r => {
        let badgeClass = 'badge--section-bar';
        if (r.section === SECTIONS.RESTAURANT) badgeClass = 'badge--section-rest';
        if (r.section === SECTIONS.GUEST_HOUSE) badgeClass = 'badge--section-guest';
        if (r.section === SECTIONS.SHISHA) badgeClass = 'badge--section-shisha';
        return `
        <tr>
          <td>${r.date}</td>
          <td><b>${r.authorUsername}</b></td>
          <td><span class="badge ${badgeClass}">${r.section || 'General'}</span> <span class="badge badge--neutral" style="margin-left: 4px;">${r.authorRole}</span></td>
          <td class="num"><b>${money(r.totalSales)}</b></td>
          <td><span class="badge ${r.status==='Verified' ? 'badge--active' : 'badge--inactive'}">${r.status}</span></td>
        </tr>
      `}).join('')}
    </tbody>
  </table></div>`;
}

/* ---------- Users & Staff Registration (Admin) ---------- */
function renderUsers() {
  const users = Api.listUsers();
  return `
    <div class="section-head">
      <div>
        <h3>Staff Accounts & Personal Profiles</h3>
        <p>Register new staff by Name, Photo, Personal Information, Assigned Section, and Shift.</p>
      </div>
      <button class="btn btn--gold" id="btnAddUser">+ Register Staff Member</button>
    </div>
    
    <div class="card">
      <div class="table-wrap"><table>
        <thead>
          <tr>
            <th>Staff Member</th>
            <th>Username</th>
            <th>Role</th>
            <th>Section</th>
            <th>Shift</th>
            <th>Contact & ID</th>
            <th>Presence Status</th>
            <th>Shift Punctuality</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => {
            let badgeClass = 'badge--section-bar';
            if (u.section === SECTIONS.RESTAURANT) badgeClass = 'badge--section-rest';
            if (u.section === SECTIONS.GUEST_HOUSE) badgeClass = 'badge--section-guest';
            if (u.section === SECTIONS.SHISHA) badgeClass = 'badge--section-shisha';
            if (u.section === SECTIONS.MANAGEMENT) badgeClass = 'badge--section-mgmt';

            const isLate = u.punctualityStatus === 'Late';

            return `
            <tr data-id="${u.id}">
              <td style="display:flex; align-items:center; gap:10px;">
                <img class="avatar-img" src="${u.photoUrl}" alt="${u.fullName}" />
                <div>
                  <strong>${u.fullName}</strong>
                </div>
              </td>
              <td class="num"><code>${u.username}</code></td>
              <td><span class="badge badge--gold">${u.role}</span></td>
              <td><span class="badge ${badgeClass}">${u.section || 'General'}</span></td>
              <td><span class="badge badge--neutral">${u.shift || 'All'}</span></td>
              <td style="font-size:12px;">
                <div>📞 ${u.phone || 'N/A'}</div>
                <div style="color:var(--text-faint);">ID: ${u.nationalId || 'N/A'}</div>
              </td>
              <td>
                <span class="status-dot ${u.isOnline ? 'status-dot--online' : 'status-dot--offline'}"></span>
                <span style="font-size:12px;">${u.isOnline ? 'Signed In' : 'Signed Out'}</span>
              </td>
              <td>
                <span class="badge ${isLate ? 'badge--punctual-late' : 'badge--punctual-ontime'}">
                  ${isLate ? `🔴 ${u.punctualityLabel || 'Late'}` : '🟢 On Time'}
                </span>
              </td>
              <td style="white-space:nowrap; display:flex; gap:6px; align-items:center;">
                <button class="btn btn--sm btn--ghost" data-action="view-profile" data-id="${u.id}">Profile</button>
                <button class="btn btn--sm btn--outline" data-action="edit-user" data-id="${u.id}">✏️ Edit</button>
                <button class="btn btn--sm btn--danger" data-action="delete-user" data-id="${u.id}">🗑️ Delete</button>
              </td>
            </tr>
          `}).join('')}
        </tbody>
      </table></div>
    </div>
  `;
}

function bindUsersView(root) {
  // Staff registration modal with full personal info & photo
  $('#btnAddUser', root)?.addEventListener('click', () => {
    let selectedPhotoUrl = '';

    const presetAvatars = [
      getPresetAvatar('Staff One', 'm'),
      getPresetAvatar('Staff Two', 'f'),
      getPresetAvatar('Staff Three', 'm'),
      getPresetAvatar('Staff Four', 'f'),
    ];

    openModal('Register Staff Member', `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div class="field" style="background:var(--bg-elev); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border);">
          <span class="field__label" style="font-size:13px; color:var(--gold-bright);">📸 Staff Profile Picture / Photo</span>
          <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
            <img id="fPhotoPreview" class="avatar-img avatar-img--lg" src="${presetAvatars[0]}" alt="Staff Avatar Preview" style="border:2px solid var(--gold);" />
            <div style="flex:1;">
              <label class="btn btn--sm btn--gold" style="cursor:pointer; display:inline-block; margin-bottom:6px;">
                📁 Choose Photo File from Computer
                <input type="file" id="fPhotoFile" accept="image/*" style="display:none;" />
              </label>
              <div class="field" style="margin-top:4px;">
                <input id="fPhotoUrl" type="url" placeholder="Or paste direct image URL (e.g. https://...)" style="font-size:11px; padding:6px 10px;" />
              </div>
            </div>
          </div>
          <div style="font-size:11px; color:var(--text-faint); margin-top:10px;">Or pick from avatar presets:</div>
          <div class="avatar-presets" id="presetAvatarList" style="margin-top:4px;">
            ${presetAvatars.map((url, idx) => `
              <button type="button" class="avatar-preset-btn ${idx === 0 ? 'is-selected' : ''}" data-url="${url}">
                <img src="${url}" alt="Preset ${idx+1}" />
              </button>
            `).join('')}
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Full Name</span><input id="fUserName" placeholder="e.g. Lamin Sesay" required /></div>
          <div class="field"><span class="field__label">Username</span><input id="fUsername" placeholder="e.g. lamin.s" required /></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Password</span><input id="fPassword" type="text" placeholder="e.g. Staff123" required /></div>
          <div class="field"><span class="field__label">Role</span>
            <select id="fRole">
              ${Object.values(ROLES).map(r => `<option value="${r}">${r}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Assigned Section</span>
            <select id="fSection">
              <option value="${SECTIONS.BAR}">Bar & VIP Lounge</option>
              <option value="${SECTIONS.RESTAURANT}">Fine Restaurant</option>
              <option value="${SECTIONS.GUEST_HOUSE}">Guest House</option>
              <option value="${SECTIONS.SHISHA}">Shisha Lounge</option>
              <option value="${SECTIONS.MANAGEMENT}">Management</option>
            </select>
          </div>
          <div class="field"><span class="field__label">Assigned Shift</span>
            <select id="fShift">
              <option value="Morning">Morning Shift (08:00 - 16:00)</option>
              <option value="Afternoon">Afternoon Shift (12:00 - 20:00)</option>
              <option value="Evening">Evening Shift (16:00 - 00:00)</option>
              <option value="Night">Night Shift (00:00 - 08:00)</option>
              <option value="All">All / Any Shift</option>
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Phone Number</span><input id="fPhone" placeholder="e.g. +232 76 111 222" /></div>
          <div class="field"><span class="field__label">National ID Number</span><input id="fNationalId" placeholder="e.g. SL-ID-123456" /></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Emergency Contact</span><input id="fEmergency" placeholder="e.g. Brother (+232 77...)" /></div>
          <div class="field"><span class="field__label">Residential Address</span><input id="fAddress" placeholder="e.g. 24 Beach Road, Freetown" /></div>
        </div>

        <button class="btn btn--gold btn--block" id="fSubmit" style="margin-top:6px;">Save Staff Registration</button>
      </div>
    `, body => {
      selectedPhotoUrl = presetAvatars[0];

      // Preset click handling
      $all('.avatar-preset-btn', body).forEach(btn => {
        btn.addEventListener('click', () => {
          $all('.avatar-preset-btn', body).forEach(b => b.classList.remove('is-selected'));
          btn.classList.add('is-selected');
          selectedPhotoUrl = btn.dataset.url;
          $('#fPhotoPreview', body).src = selectedPhotoUrl;
          if ($('#fPhotoUrl', body)) $('#fPhotoUrl', body).value = '';
        });
      });

      // Image URL input handling
      $('#fPhotoUrl', body)?.addEventListener('input', e => {
        const val = e.target.value.trim();
        if (val) {
          selectedPhotoUrl = val;
          $('#fPhotoPreview', body).src = val;
          $all('.avatar-preset-btn', body).forEach(b => b.classList.remove('is-selected'));
        }
      });

      // Custom photo upload handling
      $('#fPhotoFile', body).addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            selectedPhotoUrl = evt.target.result;
            $('#fPhotoPreview', body).src = selectedPhotoUrl;
            $all('.avatar-preset-btn', body).forEach(b => b.classList.remove('is-selected'));
            if ($('#fPhotoUrl', body)) $('#fPhotoUrl', body).value = '';
          };
          reader.readAsDataURL(file);
        }
      });

      $('#fSubmit', body).addEventListener('click', () => {
        const fullName = $('#fUserName', body).value.trim();
        const username = $('#fUsername', body).value.trim();
        const password = $('#fPassword', body).value.trim();
        const role = $('#fRole', body).value;
        const section = $('#fSection', body).value;
        const shift = $('#fShift', body).value;
        const phone = $('#fPhone', body).value.trim();
        const address = $('#fAddress', body).value.trim();
        const nationalId = $('#fNationalId', body).value.trim();
        const emergencyContact = $('#fEmergency', body).value.trim();

        if (!fullName || !username || !password) {
          toast('Please enter Full Name, Username, and Password.');
          return;
        }

        const res = Api.createUser({
          username, password, fullName, role, section, shift,
          phone, address, nationalId, emergencyContact,
          photoUrl: selectedPhotoUrl
        });

        if (!res.ok) { toast(res.error); return; }
        closeModal();
        toast(`${fullName} registered successfully with profile photo.`);
        navigate('users');
      });
    });
  });

  // View Profile Modal & Photo Editor
  $all('[data-action="view-profile"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const u = Api.listUsers().find(x => x.id === btn.dataset.id);
      if (!u) return;

      const isLate = u.punctualityStatus === 'Late';

      openModal(`Staff Profile — ${u.fullName}`, `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-elev); padding:16px; border-radius:var(--radius-md);">
            <div style="display:flex; align-items:center; gap:16px;">
              <img class="avatar-img avatar-img--lg" id="profileModalAvatar" src="${u.photoUrl}" alt="${u.fullName}" />
              <div>
                <h3 style="font-size:20px; margin:0;">${u.fullName}</h3>
                <div style="display:flex; gap:6px; margin-top:4px; flex-wrap:wrap;">
                  <span class="badge badge--gold">${u.role}</span>
                  <span class="badge badge--neutral">${u.section}</span>
                  <span class="badge badge--neutral">Shift: ${u.shift}</span>
                  <span class="badge ${isLate ? 'badge--punctual-late' : 'badge--punctual-ontime'}">
                    ${isLate ? `🔴 ${u.punctualityLabel || 'Late'}` : '🟢 On Time'}
                  </span>
                </div>
              </div>
            </div>
            <button class="btn btn--sm btn--outline" id="btnEditStaffPhoto">📷 Change Photo</button>
          </div>

          <div class="staff-user-card__details" style="grid-template-columns:1fr 1fr; gap:12px; font-size:13px; padding:16px;">
            <div><span>Username:</span> <strong>${u.username}</strong></div>
            <div><span>Presence:</span> <strong>${u.isOnline ? '🟢 Signed In' : '⚪ Signed Out'}</strong></div>
            <div><span>Shift Punctuality:</span> <strong><span class="badge ${isLate ? 'badge--punctual-late' : 'badge--punctual-ontime'}">${isLate ? `🔴 ${u.punctualityLabel || 'Late'}` : '🟢 On Time'}</span></strong></div>
            <div><span>Phone:</span> <strong>${u.phone || 'N/A'}</strong></div>
            <div><span>National ID:</span> <strong>${u.nationalId || 'N/A'}</strong></div>
            <div><span>Emergency Contact:</span> <strong>${u.emergencyContact || 'N/A'}</strong></div>
            <div><span>Residential Address:</span> <strong>${u.address || 'N/A'}</strong></div>
            <div><span>Last Sign In:</span> <strong>${fmtDateTime(u.lastSignInAt)}</strong></div>
            <div><span>Last Sign Out:</span> <strong>${fmtDateTime(u.lastSignOutAt)}</strong></div>
          </div>
        </div>
      `, modalBody => {
        $('#btnEditStaffPhoto', modalBody)?.addEventListener('click', () => {
          let updatedPhoto = u.photoUrl;
          openModal(`Update Photo — ${u.fullName}`, `
            <div style="display:flex; flex-direction:column; gap:14px; text-align:center;">
              <img id="editPhotoPreview" class="avatar-img avatar-img--lg" src="${u.photoUrl}" style="margin:0 auto; width:90px; height:90px; border:2px solid var(--gold);" />
              <label class="btn btn--sm btn--gold" style="cursor:pointer; display:inline-block; margin-top:6px;">
                📁 Upload New Photo from Device
                <input type="file" id="editPhotoFile" accept="image/*" style="display:none;" />
              </label>
              <div class="field" style="margin-top:6px;">
                <span class="field__label">Or Paste Image URL</span>
                <input id="editPhotoUrl" type="url" placeholder="https://..." value="${u.photoUrl.startsWith('data:') ? '' : u.photoUrl}" />
              </div>
              <button class="btn btn--gold btn--block" id="btnSaveStaffPhoto" style="margin-top:10px;">Save Updated Profile Photo</button>
            </div>
          `, editBody => {
            $('#editPhotoFile', editBody)?.addEventListener('change', e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                  updatedPhoto = evt.target.result;
                  $('#editPhotoPreview', editBody).src = updatedPhoto;
                };
                reader.readAsDataURL(file);
              }
            });

            $('#editPhotoUrl', editBody)?.addEventListener('input', e => {
              const val = e.target.value.trim();
              if (val) {
                updatedPhoto = val;
                $('#editPhotoPreview', editBody).src = val;
              }
            });

            $('#btnSaveStaffPhoto', editBody)?.addEventListener('click', () => {
              Api.updateUser(u.id, { photoUrl: updatedPhoto });
              closeModal();
              toast(`Profile picture updated for ${u.fullName}.`);
              navigate('users');
            });
          });
        });
      });
    });
  });

  $all('[data-action="edit-user"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const u = Api.listUsers().find(x => x.id === btn.dataset.id);
      if (u) openEditUserModal(u);
    });
  });

  $all('[data-action="delete-user"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const u = Api.listUsers().find(x => x.id === btn.dataset.id);
      if (u) openDeleteUserModal(u);
    });
  });
}

function openEditUserModal(u) {
  let selectedPhotoUrl = u.photoUrl || '';
  const presetAvatars = [
    getPresetAvatar('Staff One', 'm'),
    getPresetAvatar('Staff Two', 'f'),
    getPresetAvatar('Staff Three', 'm'),
    getPresetAvatar('Staff Four', 'f'),
  ];
  if (!selectedPhotoUrl) selectedPhotoUrl = presetAvatars[0];

  openModal(`Edit Staff Account — ${u.fullName}`, `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div class="field" style="background:var(--bg-elev); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border);">
        <span class="field__label" style="font-size:13px; color:var(--gold-bright);">📸 Staff Profile Picture / Photo</span>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <img id="ePhotoPreview" class="avatar-img avatar-img--lg" src="${selectedPhotoUrl}" alt="Staff Avatar Preview" style="border:2px solid var(--gold);" />
          <div style="flex:1;">
            <label class="btn btn--sm btn--gold" style="cursor:pointer; display:inline-block; margin-bottom:6px;">
              📁 Choose Photo File from Computer
              <input type="file" id="ePhotoFile" accept="image/*" style="display:none;" />
            </label>
            <div class="field" style="margin-top:4px;">
              <input id="ePhotoUrl" type="url" placeholder="Or paste direct image URL (e.g. https://...)" value="${selectedPhotoUrl.startsWith('data:') ? '' : selectedPhotoUrl}" style="font-size:11px; padding:6px 10px;" />
            </div>
          </div>
        </div>
        <div style="font-size:11px; color:var(--text-faint); margin-top:10px;">Or pick from avatar presets:</div>
        <div class="avatar-presets" id="ePresetAvatarList" style="margin-top:4px;">
          ${presetAvatars.map((url, idx) => `
            <button type="button" class="avatar-preset-btn ${selectedPhotoUrl === url ? 'is-selected' : ''}" data-url="${url}">
              <img src="${url}" alt="Preset ${idx+1}" />
            </button>
          `).join('')}
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="field"><span class="field__label">Full Name</span><input id="eUserName" value="${u.fullName}" required /></div>
        <div class="field"><span class="field__label">Username</span><input id="eUsername" value="${u.username}" required /></div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="field">
          <span class="field__label">New Password</span>
          <input id="ePassword" type="text" placeholder="Leave blank to keep current password" />
        </div>
        <div class="field"><span class="field__label">Role</span>
          <select id="eRole">
            ${Object.values(ROLES).map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="field"><span class="field__label">Assigned Section</span>
          <select id="eSection">
            <option value="${SECTIONS.BAR}" ${u.section === SECTIONS.BAR ? 'selected' : ''}>Bar & VIP Lounge</option>
            <option value="${SECTIONS.RESTAURANT}" ${u.section === SECTIONS.RESTAURANT ? 'selected' : ''}>Fine Restaurant</option>
            <option value="${SECTIONS.GUEST_HOUSE}" ${u.section === SECTIONS.GUEST_HOUSE ? 'selected' : ''}>Guest House</option>
            <option value="${SECTIONS.SHISHA}" ${u.section === SECTIONS.SHISHA ? 'selected' : ''}>Shisha Lounge</option>
            <option value="${SECTIONS.MANAGEMENT}" ${u.section === SECTIONS.MANAGEMENT ? 'selected' : ''}>Management</option>
          </select>
        </div>
        <div class="field"><span class="field__label">Assigned Shift</span>
          <select id="eShift">
            <option value="Morning" ${u.shift === 'Morning' ? 'selected' : ''}>Morning Shift (08:00 - 16:00)</option>
            <option value="Afternoon" ${u.shift === 'Afternoon' ? 'selected' : ''}>Afternoon Shift (12:00 - 20:00)</option>
            <option value="Evening" ${u.shift === 'Evening' ? 'selected' : ''}>Evening Shift (16:00 - 00:00)</option>
            <option value="Night" ${u.shift === 'Night' ? 'selected' : ''}>Night Shift (00:00 - 08:00)</option>
            <option value="All" ${u.shift === 'All' ? 'selected' : ''}>All / Any Shift</option>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="field"><span class="field__label">Phone Number</span><input id="ePhone" value="${u.phone || ''}" /></div>
        <div class="field"><span class="field__label">National ID Number</span><input id="eNationalId" value="${u.nationalId || ''}" /></div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="field"><span class="field__label">Emergency Contact</span><input id="eEmergency" value="${u.emergencyContact || ''}" /></div>
        <div class="field"><span class="field__label">Residential Address</span><input id="eAddress" value="${u.address || ''}" /></div>
      </div>

      <button class="btn btn--gold btn--block" id="eSubmit" style="margin-top:6px;">Save Account Changes</button>
    </div>
  `, body => {
    // Preset click handling
    $all('.avatar-preset-btn', body).forEach(btn => {
      btn.addEventListener('click', () => {
        $all('.avatar-preset-btn', body).forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedPhotoUrl = btn.dataset.url;
        $('#ePhotoPreview', body).src = selectedPhotoUrl;
        if ($('#ePhotoUrl', body)) $('#ePhotoUrl', body).value = '';
      });
    });

    // Image URL input handling
    $('#ePhotoUrl', body)?.addEventListener('input', e => {
      const val = e.target.value.trim();
      if (val) {
        selectedPhotoUrl = val;
        $('#ePhotoPreview', body).src = val;
        $all('.avatar-preset-btn', body).forEach(b => b.classList.remove('is-selected'));
      }
    });

    // Custom photo upload handling
    $('#ePhotoFile', body)?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          selectedPhotoUrl = evt.target.result;
          $('#ePhotoPreview', body).src = selectedPhotoUrl;
          $all('.avatar-preset-btn', body).forEach(b => b.classList.remove('is-selected'));
          if ($('#ePhotoUrl', body)) $('#ePhotoUrl', body).value = '';
        };
        reader.readAsDataURL(file);
      }
    });

    $('#eSubmit', body).addEventListener('click', () => {
      const fullName = $('#eUserName', body).value.trim();
      const username = $('#eUsername', body).value.trim();
      const password = $('#ePassword', body).value.trim();
      const role = $('#eRole', body).value;
      const section = $('#eSection', body).value;
      const shift = $('#eShift', body).value;
      const phone = $('#ePhone', body).value.trim();
      const address = $('#eAddress', body).value.trim();
      const nationalId = $('#eNationalId', body).value.trim();
      const emergencyContact = $('#eEmergency', body).value.trim();

      if (!fullName || !username) {
        toast('Full Name and Username cannot be empty.');
        return;
      }

      const patch = {
        fullName, username, role, section, shift,
        phone, address, nationalId, emergencyContact,
        photoUrl: selectedPhotoUrl
      };
      if (password) patch.password = password;

      const res = Api.updateUser(u.id, patch);
      if (res && res.ok === false) { toast(res.error || 'Failed to update user'); return; }

      closeModal();
      toast(`Staff account for ${fullName} updated successfully.`);
      navigate('users');
    });
  });
}

function openDeleteUserModal(u) {
  openModal(`Delete Staff Account — ${u.fullName}`, `
    <div style="display:flex; flex-direction:column; gap:16px; text-align:center; padding:10px;">
      <div style="font-size:44px;">⚠️</div>
      <div style="font-size:15px; color:var(--text-bright);">
        Are you sure you want to permanently delete the staff account for <strong>${u.fullName}</strong> (<code>${u.username}</code>)?
      </div>
      <div style="font-size:12px; color:var(--text-faint);">
        This action cannot be undone. The staff member will no longer be able to log into the system.
      </div>
      <div style="display:flex; gap:10px; margin-top:10px;">
        <button class="btn btn--ghost flex-1" id="btnCancelDelete">Cancel</button>
        <button class="btn btn--danger flex-1" id="btnConfirmDelete">Yes, Delete Staff Account</button>
      </div>
    </div>
  `, body => {
    $('#btnCancelDelete', body)?.addEventListener('click', closeModal);
    $('#btnConfirmDelete', body)?.addEventListener('click', () => {
      const res = Api.deleteUser(u.id);
      if (res && res.ok === false) {
        toast(res.error || 'Failed to delete staff account');
        return;
      }
      closeModal();
      toast(`Staff account "${u.fullName}" has been deleted.`);
      navigate('users');
    });
  });
}

/* ---------- Items & Pricing ---------- */
function renderItems() {
  const items = Api.listItems();
  const canManage = state.user.role === ROLES.SUPERVISOR || state.user.role === ROLES.MANAGER || state.user.role === ROLES.ADMIN;
  const bySec = {};
  items.forEach(i => {
    const sec = i.section || i.category || 'General';
    (bySec[sec] ||= []).push(i);
  });

  return `
    <div class="section-head">
      <div><h3>Items, Pricing & Section Inventory</h3><p>${canManage ? 'Manage items, pricing, and stock levels per section.' : 'Current prices and available stock.'}</p></div>
      ${canManage ? '<button class="btn btn--gold" id="btnAddItem">+ Add New Item</button>' : ''}
    </div>
    ${Object.keys(bySec).length === 0 ? emptyState('No items have been added yet.') :
      Object.entries(bySec).map(([sec, list]) => `
        <div class="card" style="margin-bottom: 20px;">
          <div class="card__head"><h4>Section: ${sec}</h4></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Item Name</th><th>Category</th><th>Price</th><th>In Stock</th>${canManage ? '<th></th>' : ''}</tr></thead>
            <tbody>
              ${list.map(i => `
                <tr data-id="${i.id}">
                  <td><b>${i.name}</b></td>
                  <td><span class="badge badge--neutral">${i.category}</span></td>
                  <td class="num"><b>${money(i.price)}</b></td>
                  <td class="num ${i.stockQuantity <= 5 ? 'text-danger' : ''}">${i.stockQuantity}</td>
                  ${canManage ? `<td style="white-space:nowrap; display:flex; gap:6px;">
                    <button class="btn btn--sm btn--ghost" data-action="edit" data-id="${i.id}">Edit</button>
                    <button class="btn btn--sm btn--danger" data-action="delete" data-id="${i.id}">Remove</button>
                  </td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table></div>
        </div>
      `).join('')
    }
  `;
}

function itemFormHTML(item) {
  return `
    <div class="field"><span class="field__label">Item Name</span><input id="fItemName" value="${item ? item.name : ''}" placeholder="e.g. Heineken Beer (bottle)" /></div>
    <div class="field"><span class="field__label">Section</span>
      <select id="fItemSec">
        <option value="${SECTIONS.BAR}" ${item?.section === SECTIONS.BAR ? 'selected' : ''}>Bar & VIP Lounge</option>
        <option value="${SECTIONS.RESTAURANT}" ${item?.section === SECTIONS.RESTAURANT ? 'selected' : ''}>Fine Restaurant</option>
        <option value="${SECTIONS.GUEST_HOUSE}" ${item?.section === SECTIONS.GUEST_HOUSE ? 'selected' : ''}>Guest House</option>
        <option value="${SECTIONS.SHISHA}" ${item?.section === SECTIONS.SHISHA ? 'selected' : ''}>Shisha Lounge</option>
      </select>
    </div>
    <div class="field"><span class="field__label">Price (Le)</span><input id="fItemPrice" type="number" min="0" value="${item ? item.price : ''}" placeholder="0" /></div>
    <div class="field"><span class="field__label">Initial Stock Quantity</span><input id="fItemStock" type="number" min="0" value="${item ? item.stockQuantity : '0'}" placeholder="0" /></div>
    <button class="btn btn--gold btn--block" id="fItemSave">${item ? 'Save Changes' : 'Add Item'}</button>
  `;
}

function bindItemsView(root) {
  const canManage = state.user.role === ROLES.SUPERVISOR || state.user.role === ROLES.MANAGER || state.user.role === ROLES.ADMIN;
  if (!canManage) return;

  $('#btnAddItem', root)?.addEventListener('click', () => {
    openModal('Add Item', itemFormHTML(null), body => {
      $('#fItemSave', body).addEventListener('click', () => {
        const name = $('#fItemName', body).value.trim();
        const section = $('#fItemSec', body).value;
        const price = $('#fItemPrice', body).value;
        const stockQuantity = $('#fItemStock', body).value;
        if (!name || !price || !stockQuantity) { toast('Fill in name, price and stock.'); return; }
        Api.createItem({ name, category: section, section, price, stockQuantity });
        closeModal();
        toast(`"${name}" added.`);
        navigate('items');
      });
    });
  });

  const items = Api.listItems();

  $all('[data-action="edit"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const item = items.find(i => i.id === btn.dataset.id);
      openModal('Edit Item', itemFormHTML(item), body => {
        $('#fItemSave', body).addEventListener('click', () => {
          const name = $('#fItemName', body).value.trim();
          const section = $('#fItemSec', body).value;
          const price = $('#fItemPrice', body).value;
          const stockQuantity = $('#fItemStock', body).value;
          Api.updateItem(item.id, { name, category: section, section, price: Number(price), stockQuantity: Number(stockQuantity) });
          closeModal();
          toast(`"${name}" updated.`);
          navigate('items');
        });
      });
    });
  });

  $all('[data-action="delete"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const item = items.find(i => i.id === btn.dataset.id);
      if (!confirm(`Remove "${item.name}" from price list?`)) return;
      Api.deleteItem(item.id);
      toast(`"${item.name}" removed.`);
      navigate('items');
    });
  });
}

/* ---------- Activity & Attendance Log (Admin Oversight) ---------- */
function renderActivity() {
  const users = Api.listUsers();
  const activity = Api.listActivity();

  const onlineUsers = users.filter(u => u.isOnline);
  const offlineUsers = users.filter(u => !u.isOnline);
  const onTimeCount = users.filter(u => u.punctualityStatus === 'On Time').length;
  const lateCount = users.filter(u => u.punctualityStatus === 'Late').length;

  return `
    <div class="section-head">
      <div>
        <h3>Staff Attendance & Live Activity Monitoring</h3>
        <p>Oversee staff sign-in / sign-out timestamps, shift presence, and system audit logs.</p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:20px;">
      <div class="card" style="padding:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:12px; color:var(--text-faint);">🟢 On-Time Sign Ins</div>
          <div style="font-size:24px; font-weight:bold; color:var(--success-bright);">${onTimeCount}</div>
        </div>
        <div style="font-size:28px;">⏱️</div>
      </div>
      <div class="card" style="padding:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:12px; color:var(--text-faint);">🔴 Late Shift Sign Ins</div>
          <div style="font-size:24px; font-weight:bold; color:var(--wine-bright);">${lateCount}</div>
        </div>
        <div style="font-size:28px;">🚨</div>
      </div>
      <div class="card" style="padding:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:12px; color:var(--text-faint);">Active Staff Presence</div>
          <div style="font-size:24px; font-weight:bold; color:var(--gold-bright);">${onlineUsers.length} / ${users.length}</div>
        </div>
        <div style="font-size:28px;">👥</div>
      </div>
    </div>

    <div class="two-col" style="margin-bottom: 24px;">
      <div class="card">
        <div class="card__head">
          <h4 style="display:flex; align-items:center; gap:8px;">
            <span class="status-dot status-dot--online"></span> Signed In Staff (${onlineUsers.length})
          </h4>
        </div>
        <div class="staff-sign-list" style="display:flex; flex-direction:column; gap:10px;">
          ${onlineUsers.length ? onlineUsers.map(u => {
            const isLate = u.punctualityStatus === 'Late';
            return `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:var(--bg-elev); border-radius:var(--radius-sm);">
              <div style="display:flex; align-items:center; gap:10px;">
                <img class="avatar-img" src="${u.photoUrl}" alt="${u.fullName}" />
                <div>
                  <strong>${u.fullName}</strong> (${u.role})
                  <div style="font-size:11px; color:var(--text-faint); margin-top:2px; display:flex; gap:6px; align-items:center;">
                    <span>Section: ${u.section} · ${u.shift}</span>
                    <span class="badge ${isLate ? 'badge--punctual-late' : 'badge--punctual-ontime'}" style="font-size:10px; padding:2px 6px;">
                      ${isLate ? `🔴 ${u.punctualityLabel || 'Late'}` : '🟢 On Time'}
                    </span>
                  </div>
                </div>
              </div>
              <div style="text-align:right; font-size:11px;">
                <div style="color:var(--success-bright);">Signed In</div>
                <div style="font-family:var(--font-mono); color:var(--text-faint);">${fmtDateTime(u.lastSignInAt)}</div>
              </div>
            </div>
          `}).join('') : emptyState('No staff currently signed in.')}
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <h4 style="display:flex; align-items:center; gap:8px;">
            <span class="status-dot status-dot--offline"></span> Signed Out / Off-Duty Staff (${offlineUsers.length})
          </h4>
        </div>
        <div class="staff-sign-list" style="display:flex; flex-direction:column; gap:10px;">
          ${offlineUsers.length ? offlineUsers.map(u => {
            const isLate = u.punctualityStatus === 'Late';
            return `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:10px; background:var(--bg-elev); border-radius:var(--radius-sm);">
              <div style="display:flex; align-items:center; gap:10px;">
                <img class="avatar-img" src="${u.photoUrl}" alt="${u.fullName}" />
                <div>
                  <strong>${u.fullName}</strong> (${u.role})
                  <div style="font-size:11px; color:var(--text-faint); margin-top:2px; display:flex; gap:6px; align-items:center;">
                    <span>Section: ${u.section} · ${u.shift}</span>
                    <span class="badge ${isLate ? 'badge--punctual-late' : 'badge--punctual-ontime'}" style="font-size:10px; padding:2px 6px;">
                      ${isLate ? `🔴 ${u.punctualityLabel || 'Late'}` : '🟢 On Time'}
                    </span>
                  </div>
                </div>
              </div>
              <div style="text-align:right; font-size:11px;">
                <div style="color:var(--text-faint);">Signed Out</div>
                <div style="font-family:var(--font-mono); color:var(--text-faint);">${u.lastSignOutAt ? fmtDateTime(u.lastSignOutAt) : 'Never'}</div>
              </div>
            </div>
          `}).join('') : emptyState('No signed out staff records.')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card__head"><h4>System Activity & Attendance Audit Log</h4></div>
      <div class="activity-list">
        ${activity.length ? activity.map(a => `
          <div class="activity-row">
            <span class="activity-row__dot"></span>
            <span class="activity-row__text">
              <b>${a.username}</b> ${a.role ? `(${a.role})` : ''} — ${a.action}
              ${a.section ? `<span class="badge badge--neutral" style="margin-left:6px; font-size:10px;">${a.section}</span>` : ''}
            </span>
            <span class="activity-row__time">${fmtDateTime(a.at)}</span>
          </div>
        `).join('') : emptyState('No activity recorded yet.')}
      </div>
    </div>
  `;
}

/* ---------- Staff Performance & Sales Overview (Supervisor / Manager) ---------- */
function renderStaffOverview() {
  const role = state.user.role;
  let list = Api.listUsers().filter(u => u.role !== ROLES.ADMIN);
  if (role === ROLES.MANAGER) list = list.filter(u => u.role !== ROLES.SUPERVISOR);

  const reports = Api.listReports();
  const today = todayISO();

  return `
    <div class="section-head">
      <div>
        <h3>Staff Performance & Individual Sales Inspection</h3>
        <p>Monitor individual sales figures, shift reports, and performance metrics for staff under your supervision.</p>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap"><table>
        <thead>
          <tr>
            <th>Staff Member</th>
            <th>Role & Section</th>
            <th>Shift & Punctuality</th>
            <th>Presence Status</th>
            <th>Total Sales</th>
            <th>Today's Sales</th>
            <th>Reports</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(u => {
            const mine = reports.filter(r => r.authorId === u.id || (r.authorUsername && r.authorUsername.toLowerCase() === u.username.toLowerCase()));
            const totalSales = mine.reduce((sum, r) => sum + (r.totalSales || 0), 0);
            const todaysSales = mine.filter(r => r.date && r.date.slice(0, 10) === today).reduce((sum, r) => sum + (r.totalSales || 0), 0);
            const isLate = u.punctualityStatus === 'Late';

            return `<tr>
              <td style="display:flex; align-items:center; gap:10px;">
                <img class="avatar-img" src="${u.photoUrl}" alt="${u.fullName}" />
                <div>
                  <b>${u.fullName}</b>
                  <div style="font-size:11px; color:var(--text-faint);"><code>@${u.username}</code></div>
                </div>
              </td>
              <td>
                <div><span class="badge badge--gold">${u.role}</span></div>
                <div style="margin-top:2px;"><span class="badge badge--neutral">${u.section || 'General'}</span></div>
              </td>
              <td>
                <div style="font-size:12px;">${u.shift}</div>
                <div style="margin-top:2px;">
                  <span class="badge ${isLate ? 'badge--punctual-late' : 'badge--punctual-ontime'}" style="font-size:10px; padding:2px 6px;">
                    ${isLate ? `🔴 ${u.punctualityLabel || 'Late'}` : '🟢 On Time'}
                  </span>
                </div>
              </td>
              <td>
                <span class="status-dot ${u.isOnline ? 'status-dot--online' : 'status-dot--offline'}"></span>
                <span style="font-size:12px;">${u.isOnline ? 'Signed In' : 'Signed Out'}</span>
              </td>
              <td class="num"><b style="color:var(--gold-bright);">${money(totalSales)}</b></td>
              <td class="num"><b>${money(todaysSales)}</b></td>
              <td class="num"><b>${mine.length}</b></td>
              <td>
                <button class="btn btn--sm btn--gold" data-action="inspect-staff" data-id="${u.id}">Inspect Reports</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    </div>
  `;
}

function bindStaffOverviewView(root) {
  $all('[data-action="inspect-staff"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const u = Api.listUsers().find(x => x.id === btn.dataset.id);
      if (!u) return;

      const staffReports = Api.listReports().filter(r => r.authorId === u.id || (r.authorUsername && r.authorUsername.toLowerCase() === u.username.toLowerCase()));
      const totalSales = staffReports.reduce((sum, r) => sum + (r.totalSales || 0), 0);
      const todaysSales = staffReports.filter(r => r.date && r.date.slice(0, 10) === todayISO()).reduce((sum, r) => sum + (r.totalSales || 0), 0);

      openModal(`Sales Performance & Reports — ${u.fullName}`, `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-elev); padding:16px; border-radius:var(--radius-md);">
            <div style="display:flex; align-items:center; gap:14px;">
              <img class="avatar-img avatar-img--lg" src="${u.photoUrl}" alt="${u.fullName}" />
              <div>
                <h3 style="font-size:18px; margin:0;">${u.fullName}</h3>
                <div style="font-size:12px; color:var(--text-faint); margin-top:2px;">
                  ${u.role} · Section: ${u.section} · Shift: ${u.shift}
                </div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px; color:var(--text-faint);">Total Generated Sales</div>
              <div style="font-size:22px; font-weight:bold; color:var(--gold-bright);">${money(totalSales)}</div>
              <div style="font-size:11px; color:var(--text-dim);">Today: ${money(todaysSales)}</div>
            </div>
          </div>

          <div>
            <h4 style="margin-bottom:10px;">Daily Sales Reports Submitted by ${u.fullName} (${staffReports.length})</h4>
            ${reportsTableDetailed(staffReports, true)}
          </div>
        </div>
      `, modalBody => {
        bindReportViewButtons(modalBody);
      });
    });
  });
}

/* ---------- Reports Inbox & All Reports ---------- */
function renderInbox() {
  if (STAFF_ROLES.includes(state.user.role)) return renderMyReports();
  const role = state.user.role;
  let reports = Api.listReports().filter(r => r.recipients.includes(role));
  return `
    <div class="section-head">
      <div><h3>Reports Inbox</h3><p>Daily reports submitted to you for verification.</p></div>
      ${reports.length ? '<button class="btn btn--outline" id="btnExportAllExcel">📊 Export Inbox to Excel (.xlsx)</button>' : ''}
    </div>
    <div class="card">${reportsTableDetailed(reports, true)}</div>
  `;
}

function renderAllReports() {
  if (STAFF_ROLES.includes(state.user.role)) return renderMyReports();
  const reports = Api.listReports();
  return `
    <div class="section-head">
      <div><h3>All Daily Reports Across Sections</h3><p>Every report submitted by staff, managers, and supervisors.</p></div>
      ${reports.length ? '<button class="btn btn--outline" id="btnExportAllExcel">📊 Export All Reports to Excel (.xlsx)</button>' : ''}
    </div>
    <div class="card">${reportsTableDetailed(reports, false)}</div>
  `;
}

function reportsTableDetailed(reports, canVerify) {
  if (!reports.length) return emptyState('No reports available.');
  return `<div class="table-wrap"><table>
    <thead><tr><th>Date</th><th>Submitted By</th><th>Section</th><th>Role</th><th>Total Sales</th><th>Status</th><th>Export Formats</th></tr></thead>
    <tbody>
      ${reports.map(r => `
        <tr>
          <td>${r.date}</td>
          <td><b>${r.authorUsername}</b></td>
          <td><span class="badge badge--gold">${r.section || 'General'}</span></td>
          <td><span class="badge badge--neutral">${r.authorRole}</span></td>
          <td class="num"><b>${money(r.totalSales)}</b></td>
          <td><span class="badge ${r.status==='Verified' ? 'badge--active' : 'badge--inactive'}">${r.status}</span></td>
          <td style="white-space:nowrap; display:flex; gap:6px;">
            <button class="btn btn--sm btn--ghost" data-action="view-report" data-id="${r.id}">View</button>
            ${canVerify && r.status === 'Pending' ? `<button class="btn btn--sm btn--gold" data-action="verify-report" data-id="${r.id}">Verify</button>` : ''}
            <button class="btn btn--sm btn--gold" data-action="gen-excel" data-id="${r.id}" title="Export to Excel Spreadsheet">📊 Excel</button>
            <button class="btn btn--sm btn--outline" data-action="gen-pdf" data-id="${r.id}" title="Export to PDF Document">📄 PDF</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table></div>`;
}

function bindReportViewButtons(root) {
  let reports = Api.listReports();
  if (STAFF_ROLES.includes(state.user.role)) {
    reports = reports.filter(r => r.authorId === state.user.id);
  }

  // Export All to Excel
  $('#btnExportAllExcel', root)?.addEventListener('click', () => {
    if (typeof XLSX === 'undefined') { toast('SheetJS library loading... try again.'); return; }
    
    const excelRows = [];
    reports.forEach(r => {
      if (r.lines && r.lines.length) {
        r.lines.forEach(l => {
          excelRows.push({
            'Report Date': r.date,
            'Section': r.section || 'General',
            'Submitted By': r.authorUsername,
            'Role': r.authorRole,
            'Status': r.status,
            'Item Name': l.name,
            'Quantity Sold': l.qty,
            'Unit Price (Le)': l.price,
            'Item Subtotal (Le)': l.qty * l.price,
            'Report Total Sales (Le)': r.totalSales,
            'Notes': r.notes || ''
          });
        });
      } else {
        excelRows.push({
          'Report Date': r.date,
          'Section': r.section || 'General',
          'Submitted By': r.authorUsername,
          'Role': r.authorRole,
          'Status': r.status,
          'Item Name': 'Section Summary',
          'Quantity Sold': 1,
          'Unit Price (Le)': r.totalSales,
          'Item Subtotal (Le)': r.totalSales,
          'Report Total Sales (Le)': r.totalSales,
          'Notes': r.notes || ''
        });
      }
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelRows);
    XLSX.utils.book_append_sheet(wb, ws, "Daily Reports");
    XLSX.writeFile(wb, `ClubTiktok_DailyReports_Export_${todayISO()}.xlsx`);
    toast('Excel workbook exported successfully.');
  });
  
  $all('[data-action="view-report"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const r = reports.find(x => x.id === btn.dataset.id);
      openModal(`Daily Report — ${r.authorUsername} (${r.date})`, `
        <div id="printArea">
            <div class="chip-row" style="margin-bottom:12px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <span class="badge badge--gold">${r.section || 'General Section'}</span>
              <span class="badge badge--neutral">${r.authorRole}</span>
              <span class="badge ${r.status==='Verified' ? 'badge--active' : 'badge--inactive'}">Status: ${r.status} ${r.verifiedBy ? 'by ' + r.verifiedBy : ''}</span>
            </div>
            ${r.lines.length ? `<div class="table-wrap"><table>
              <thead><tr><th>Item Name</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
              <tbody>${r.lines.map(l => `<tr><td><b>${l.name}</b></td><td class="num">${l.qty}</td><td class="num">${money(l.price)}</td><td class="num"><b>${money(l.qty * l.price)}</b></td></tr>`).join('')}</tbody>
            </table></div>` : ''}
            <div class="report-total" style="margin-top:14px;"><span>Total Report Sales</span><b>${money(r.totalSales)}</b></div>
            ${r.notes ? `<div class="field" style="margin-top:12px;"><span class="field__label">Shift Notes</span><p style="font-size:13.5px; color:var(--text-dim); background:var(--bg-elev); padding:10px; border-radius:var(--radius-sm);">${r.notes}</p></div>` : ''}
            <div style="display:flex; gap:10px; margin-top:16px;">
              <button class="btn btn--gold btn--block" data-modal-action="modal-excel" data-id="${r.id}">📊 Export to Excel (.xlsx)</button>
              <button class="btn btn--outline btn--block" data-modal-action="modal-pdf" data-id="${r.id}">📄 Export to PDF (.pdf)</button>
            </div>
        </div>
      `, body => {
        $('[data-modal-action="modal-excel"]', body)?.addEventListener('click', () => {
          exportSingleReportExcel(r);
        });
        $('[data-modal-action="modal-pdf"]', body)?.addEventListener('click', () => {
          exportSingleReportPDF(r);
        });
      });
    });
  });

  $all('[data-action="verify-report"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      Api.verifyReport(btn.dataset.id);
      toast('Report verified.');
      navigate(state.route);
    });
  });

  // Export Individual Report to Excel (.xlsx)
  $all('[data-action="gen-excel"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const r = reports.find(x => x.id === btn.dataset.id);
      exportSingleReportExcel(r);
    });
  });

  // Export Individual Report to PDF (.pdf)
  $all('[data-action="gen-pdf"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const r = reports.find(x => x.id === btn.dataset.id);
      exportSingleReportPDF(r);
    });
  });
}

function exportSingleReportExcel(r) {
  if (typeof XLSX === 'undefined') { toast('SheetJS library loading... try again.'); return; }

  const excelRows = r.lines.length ? r.lines.map(l => ({
    'Date': r.date,
    'Section': r.section || 'General',
    'Submitted By': r.authorUsername,
    'Role': r.authorRole,
    'Status': r.status,
    'Item Name': l.name,
    'Quantity': l.qty,
    'Unit Price (Le)': l.price,
    'Subtotal (Le)': l.qty * l.price,
    'Total Sales (Le)': r.totalSales,
    'Notes': r.notes || ''
  })) : [{
    'Date': r.date,
    'Section': r.section || 'General',
    'Submitted By': r.authorUsername,
    'Role': r.authorRole,
    'Status': r.status,
    'Item Name': 'Summary Report',
    'Quantity': 1,
    'Unit Price (Le)': r.totalSales,
    'Subtotal (Le)': r.totalSales,
    'Total Sales (Le)': r.totalSales,
    'Notes': r.notes || ''
  }];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelRows);
  XLSX.utils.book_append_sheet(wb, ws, "Report Details");
  XLSX.writeFile(wb, `ClubTiktok_DailyReport_${r.section}_${r.date}.xlsx`);
  toast(`Exported Excel report for ${r.section}.`);
}

function exportSingleReportPDF(r) {
  if (typeof html2pdf === 'undefined') { toast('PDF generator loading... try again.'); return; }

  let content = document.createElement('div');
  content.style.padding = '20px';
  content.style.fontFamily = 'sans-serif';
  content.innerHTML = `
    <div style="text-align:center; border-bottom:2px solid #C9A227; padding-bottom:12px; margin-bottom:20px;">
      <h1 style="color:#0B0B0C; margin:0; font-size:24px;">CLUB TIKTOK</h1>
      <p style="color:#555; margin:4px 0 0; font-size:14px;">Bar · Restaurant · Guest House · Shisha Lounge</p>
      <h3 style="color:#C9A227; margin:8px 0 0;">DAILY SALES & OPERATIONS REPORT</h3>
    </div>

    <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:13px;">
      <tr><td style="padding:6px; font-weight:bold;">Report Date:</td><td>${r.date}</td><td style="padding:6px; font-weight:bold;">Section:</td><td>${r.section || 'General'}</td></tr>
      <tr><td style="padding:6px; font-weight:bold;">Submitted By:</td><td>${r.authorUsername} (${r.authorRole})</td><td style="padding:6px; font-weight:bold;">Status:</td><td>${r.status}</td></tr>
    </table>

    ${r.lines.length ? `
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:13px;" border="1" cellpadding="8">
        <thead style="background:#f4f4f4;">
          <tr><th>Item Name</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          ${r.lines.map(l => `
            <tr>
              <td>${l.name}</td>
              <td style="text-align:center;">${l.qty}</td>
              <td style="text-align:right;">Le ${Number(l.price).toLocaleString()}</td>
              <td style="text-align:right; font-weight:bold;">Le ${Number(l.qty * l.price).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    <div style="background:#f8f9fa; border:1px solid #ddd; padding:14px; border-radius:6px; margin-bottom:20px;">
      <h3 style="margin:0 0 4px; color:#111;">Total Section Revenue: Le ${Number(r.totalSales).toLocaleString()}</h3>
      ${r.notes ? `<p style="margin:8px 0 0; color:#444; font-size:13px;"><b>Shift Notes:</b> ${r.notes}</p>` : ''}
    </div>

    <div style="font-size:11px; color:#888; text-align:center; border-top:1px solid #eee; padding-top:10px;">
      Generated automatically by Club Tiktok Management System v3.0
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `ClubTiktok_DailyReport_${r.section}_${r.date}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(content).save();
  toast(`Exported PDF report for ${r.section}.`);
}

/* ---------- Submit Report ---------- */
function reportContextFor(role) {
  if (role === ROLES.SUPERVISOR) return { type: 'supervisor', recipients: [ROLES.ADMIN], showLines: false, label: 'Daily summary to the System Admin' };
  if (role === ROLES.MANAGER) return { type: 'manager', recipients: [ROLES.SUPERVISOR, ROLES.ADMIN], showLines: false, label: 'Daily summary to the Supervisor and System Admin' };
  return { type: 'staff', recipients: [ROLES.SUPERVISOR, ROLES.MANAGER], showLines: true, label: 'Daily sales & items report to Supervisor and Manager' };
}

let lineCount = 0;
let globalItems = [];

function renderInventoryRows(items) {
  if (!items || !items.length) {
    return `<tr><td colspan="4" style="text-align:center; color:var(--color-text-muted); padding:16px;">No items registered in this section yet.</td></tr>`;
  }
  return items.map(i => `<tr><td>${i.name}</td><td><span class="badge badge--neutral">${i.section || i.category}</span></td><td class="num">${money(i.price)}</td><td class="num ${i.stockQuantity <= 5 ? 'text-danger':''}">${i.stockQuantity}</td></tr>`).join('');
}

function getInitialReportSection() {
  const userSec = state.user?.section;
  const validSections = [SECTIONS.BAR, SECTIONS.RESTAURANT, SECTIONS.GUEST_HOUSE, SECTIONS.SHISHA];
  if (userSec && validSections.includes(userSec)) {
    return userSec;
  }
  return SECTIONS.BAR;
}

function renderSubmit() {
  const ctx = reportContextFor(state.user.role);
  const initialSec = getInitialReportSection();
  globalItems = Api.listItems(initialSec);
  lineCount = 0;

  return `
    <div class="section-head"><div><h3>Send Daily Sales Report</h3><p>${ctx.label}</p></div></div>
    <div class="two-col">
      <div class="card">
        <div class="card__head"><h4>${ctx.showLines ? "Today's Item Sales" : "Today's Section Summary"}</h4></div>
        
        <div class="field"><span class="field__label">Section Reporting For</span>
          <select id="reportSectionSelect">
            <option value="${SECTIONS.BAR}" ${initialSec === SECTIONS.BAR ? 'selected' : ''}>Bar & VIP Lounge</option>
            <option value="${SECTIONS.RESTAURANT}" ${initialSec === SECTIONS.RESTAURANT ? 'selected' : ''}>Fine Restaurant</option>
            <option value="${SECTIONS.GUEST_HOUSE}" ${initialSec === SECTIONS.GUEST_HOUSE ? 'selected' : ''}>Guest House</option>
            <option value="${SECTIONS.SHISHA}" ${initialSec === SECTIONS.SHISHA ? 'selected' : ''}>Shisha Lounge</option>
          </select>
        </div>

        ${ctx.showLines ? `
          <div id="reportLines" class="report-lines"></div>
          <button class="btn btn--ghost btn--sm" id="addLine" type="button">+ Add Item Sold</button>
          <div class="report-total"><span>Total Sales</span><b id="lineTotal">${money(0)}</b></div>
        ` : `
          <div class="field"><span class="field__label">Total Sales Reported (Le)</span><input id="manualTotal" type="number" min="0" placeholder="0" /></div>
        `}
        <div class="field" style="margin-top:14px;">
          <span class="field__label">Notes for ${ctx.recipients.join(' & ')}</span>
          <textarea id="reportNotes" placeholder="Log shift observations, stock refills, or special notes..."></textarea>
        </div>
        <button class="btn btn--gold btn--block" id="submitReportBtn" style="margin-top:16px;">Submit Report</button>
      </div>

      <div class="card">
        <div class="card__head"><h4>Current Price List & Inventory (<span id="inventorySectionLabel">${initialSec}</span>)</h4></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Item</th><th>Section</th><th>Price</th><th>In Stock</th></tr></thead>
          <tbody id="inventoryTableBody">${renderInventoryRows(globalItems)}</tbody>
        </table></div>
      </div>
    </div>
  `;
}

function addReportLine(container, items) {
  lineCount++;
  const rowId = 'line_' + lineCount;
  const row = document.createElement('div');
  row.className = 'report-line';
  row.dataset.rowId = rowId;

  const hasItems = items && items.length > 0;
  const optionsHtml = hasItems
    ? items.map(i => `<option value="${i.id}" data-price="${i.price}" data-stock="${i.stockQuantity}">${i.name} (Stock: ${i.stockQuantity})</option>`).join('')
    : `<option value="" data-price="0" data-stock="0" disabled selected>No items in this section</option>`;

  row.innerHTML = `
    <select class="line-item">${optionsHtml}</select>
    <input class="line-qty" type="number" min="1" value="1" ${hasItems ? '' : 'disabled'} />
    <input class="line-sub num" type="text" disabled value="${money(hasItems ? (items[0]?.price || 0) : 0)}" />
    <button class="report-line__remove" type="button" title="Remove">×</button>
  `;
  container.appendChild(row);

  const select = row.querySelector('.line-item');
  const qty = row.querySelector('.line-qty');
  const sub = row.querySelector('.line-sub');
  const removeBtn = row.querySelector('.report-line__remove');

  function recalcRow() {
    const opt = select.selectedOptions[0];
    if (!opt || opt.disabled || !opt.value) {
      sub.value = money(0);
      recalcTotal();
      return;
    }
    const price = Number(opt.dataset.price || 0);
    const stock = Number(opt.dataset.stock || 0);
    let q = Number(qty.value || 0);
    if (q > stock) {
      toast('Cannot sell more than available in stock!');
      qty.value = stock;
      q = stock;
    }
    sub.value = money(price * q);
    recalcTotal();
  }
  select.addEventListener('change', recalcRow);
  qty.addEventListener('input', recalcRow);
  removeBtn.addEventListener('click', () => { row.remove(); recalcTotal(); });
  recalcRow();
}

function recalcTotal() {
  const totalEl = $('#lineTotal');
  if (!totalEl) return;
  let total = 0;
  $all('.report-line').forEach(row => {
    const select = row.querySelector('.line-item');
    const qty = row.querySelector('.line-qty');
    const opt = select.selectedOptions[0];
    if (opt && !opt.disabled && opt.value) {
      const price = Number(opt.dataset.price || 0);
      total += price * Number(qty.value || 0);
    }
  });
  totalEl.textContent = money(total);
}

function bindSubmitView(root) {
  const ctx = reportContextFor(state.user.role);
  const sectionSelect = $('#reportSectionSelect', root);
  let activeSec = sectionSelect ? sectionSelect.value : getInitialReportSection();
  let sectionItems = Api.listItems(activeSec);

  const updateSectionView = (sec) => {
    activeSec = sec;
    sectionItems = Api.listItems(activeSec);
    const labelEl = $('#inventorySectionLabel', root);
    if (labelEl) labelEl.textContent = activeSec;

    const tbody = $('#inventoryTableBody', root);
    if (tbody) tbody.innerHTML = renderInventoryRows(sectionItems);

    if (ctx.showLines) {
      const container = $('#reportLines', root);
      if (container) {
        container.innerHTML = '';
        lineCount = 0;
        addReportLine(container, sectionItems);
      }
    }
  };

  if (sectionSelect) {
    sectionSelect.addEventListener('change', (e) => {
      updateSectionView(e.target.value);
    });
  }

  if (ctx.showLines) {
    const container = $('#reportLines', root);
    if (container) {
      container.innerHTML = '';
      addReportLine(container, sectionItems);
    }
    const addBtn = $('#addLine', root);
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (container) addReportLine(container, sectionItems);
      });
    }
  }

  $('#submitReportBtn', root).addEventListener('click', () => {
    let lines = [];
    let total = 0;
    const section = $('#reportSectionSelect', root).value;

    if (ctx.showLines) {
      $all('.report-line', root).forEach(row => {
        const select = row.querySelector('.line-item');
        const qty = Number(row.querySelector('.line-qty').value || 0);
        const opt = select.selectedOptions[0];
        if (!opt || opt.disabled || !opt.value || qty <= 0) return;
        const price = Number(opt.dataset.price);
        lines.push({ itemId: opt.value, name: opt.textContent.split(' (Stock:')[0], qty, price });
        total += price * qty;
      });
      if (!lines.length) { toast('Add at least one item sold.'); return; }
    } else {
      total = Number($('#manualTotal', root).value || 0);
      if (!total) { toast('Enter today’s total sales.'); return; }
    }
    const notes = $('#reportNotes', root).value.trim();
    const res = Api.submitReport({
      authorId: state.user.id,
      authorUsername: state.user.username,
      authorRole: state.user.role,
      section,
      type: ctx.type,
      lines, totalSales: total, notes,
      recipients: ctx.recipients,
    });
    if(!res.ok) {
        toast(res.error);
        return;
    }
    navigate(state.user.role === ROLES.SUPERVISOR || state.user.role === ROLES.MANAGER ? 'dashboard' : 'myReports');
  });
}

/* ---------- My Reports ---------- */
function renderMyReports() {
  const reports = Api.listReports().filter(r => r.authorId === state.user.id || (r.authorUsername && r.authorUsername.toLowerCase() === state.user.username.toLowerCase()));
  return `
    <div class="section-head"><div><h3>My Submission History</h3><p>Reports submitted during your shifts.</p></div></div>
    <div class="card">${reportsTableDetailed(reports, false)}</div>
  `;
}

/* ---------- Supplier Stock In & Inward Logs ---------- */
function renderStock() {
  const logs = Api.listStockLogs();
  const items = Api.listItems();
  const reports = Api.listReports();
  const totalInwardValue = logs.reduce((acc, l) => acc + (l.totalCost || 0), 0);
  const isAdmin = state.user?.role === ROLES.ADMIN;

  // Calculate total sold / reduced quantity per item from reports
  const itemReductions = {};
  let totalUnitsReduced = 0;
  reports.forEach(r => {
    if (r.lines && r.lines.length) {
      r.lines.forEach(l => {
        if (l.itemId) {
          const qty = Number(l.qty) || 0;
          itemReductions[l.itemId] = (itemReductions[l.itemId] || 0) + qty;
          totalUnitsReduced += qty;
        }
      });
    }
  });

  return `
    <div class="section-head">
      <div>
        <h3>Supplier Stock In & Inventory Log</h3>
        <p>${isAdmin ? 'View supplier stock in deliveries, section inventory levels, and stock reduction logs.' : 'Record stock received from suppliers, manage section inward inventory, and monitor total supply costs.'}</p>
      </div>
      ${!isAdmin ? `<button class="btn btn--gold" id="btnRecordStockIn">+ Record Stock Received from Supplier</button>` : ''}
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:20px;">
      <div class="card" style="padding:16px;">
        <div style="font-size:12px; color:var(--text-faint);">Total Stock Items</div>
        <div style="font-size:24px; font-weight:bold; color:var(--gold-bright);">${items.length}</div>
        <div style="font-size:11px; color:var(--text-dim);">Across all 4 sections</div>
      </div>
      <div class="card" style="padding:16px;">
        <div style="font-size:12px; color:var(--text-faint);">Total Supplier Stock Inward Cost</div>
        <div style="font-size:24px; font-weight:bold; color:var(--success-bright);">${money(totalInwardValue)}</div>
        <div style="font-size:11px; color:var(--text-dim);">${logs.length} supplier deliveries logged</div>
      </div>
      <div class="card" style="padding:16px;">
        <div style="font-size:12px; color:var(--text-faint);">Total Stock Reduction (Units Sold)</div>
        <div style="font-size:24px; font-weight:bold; color:var(--danger-bright, #ff6b6b);">${totalUnitsReduced} Units</div>
        <div style="font-size:11px; color:var(--text-dim);">Deducted from sales reports</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px;">
      <div class="card__head"><h4>Supplier Stock Inward Delivery Logs (Stock In)</h4></div>
      ${logs.length ? `
        <div class="table-wrap"><table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier / Vendor</th>
              <th>Section</th>
              <th>Item Replenished</th>
              <th>Qty Received</th>
              <th>Unit Cost</th>
              <th>Total Cost</th>
              <th>Received By</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td>${l.date}</td>
                <td><b>${l.supplierName}</b></td>
                <td><span class="badge badge--gold">${l.section}</span></td>
                <td><b>${l.itemName}</b></td>
                <td class="num"><b style="color:var(--success-bright);">+${l.qtyReceived}</b></td>
                <td class="num">${money(l.unitCost)}</td>
                <td class="num"><b>${money(l.totalCost)}</b></td>
                <td><code>@${l.receivedBy}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table></div>
      ` : emptyState('No stock inward logs recorded yet.')}
    </div>

    <div class="card">
      <div class="card__head"><h4>Section Inventory & Stock Reduction Log (Stock Reduction)</h4></div>
      ${items.length ? `
        <div class="table-wrap"><table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Section</th>
              <th>Price</th>
              <th>Units Reduced (Sold)</th>
              <th>Current In-Stock</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(i => {
              const reduced = itemReductions[i.id] || 0;
              const isLow = i.stockQuantity <= 5;
              const isOut = i.stockQuantity <= 0;
              const statusBadge = isOut 
                ? '<span class="badge badge--danger">Out of Stock</span>' 
                : isLow 
                  ? '<span class="badge badge--gold">Low Stock</span>' 
                  : '<span class="badge badge--active">In Stock</span>';
              return `
                <tr>
                  <td><b>${i.name}</b></td>
                  <td><span class="badge badge--neutral">${i.section || i.category}</span></td>
                  <td class="num">${money(i.price)}</td>
                  <td class="num"><b style="color:var(--danger-bright, #ff6b6b);">${reduced > 0 ? '-' + reduced : '0'}</b></td>
                  <td class="num ${isLow ? 'text-danger' : ''}"><b>${i.stockQuantity}</b></td>
                  <td>${statusBadge}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table></div>
      ` : emptyState('No inventory items found.')}
    </div>
  `;
}

function bindStockView(root) {
  $('#btnRecordStockIn', root)?.addEventListener('click', () => {
    const items = Api.listItems();
    if (!items.length) { toast('No items available to replenish.'); return; }

    openModal('Record Stock Received from Supplier', `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div class="field">
          <span class="field__label">Target Section</span>
          <select id="stSection">
            <option value="${SECTIONS.BAR}">Bar & VIP Lounge</option>
            <option value="${SECTIONS.RESTAURANT}">Fine Restaurant</option>
            <option value="${SECTIONS.GUEST_HOUSE}">Guest House</option>
            <option value="${SECTIONS.SHISHA}">Shisha Lounge</option>
          </select>
        </div>

        <div class="field">
          <span class="field__label">Select Item to Replenish</span>
          <select id="stItem">
            ${items.map(i => `<option value="${i.id}" data-price="${i.price}">${i.name} (${i.section || i.category} - Current Stock: ${i.stockQuantity})</option>`).join('')}
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Supplier / Vendor Name</span><input id="stSupplier" placeholder="e.g. Sierra Leone Brewery Ltd" required /></div>
          <div class="field"><span class="field__label">Quantity Received</span><input id="stQty" type="number" min="1" placeholder="e.g. 50" required /></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Unit Purchase Cost (Le)</span><input id="stUnitCost" type="number" min="0" placeholder="e.g. 25" /></div>
          <div class="field"><span class="field__label">Delivery Note / Invoice Ref</span><input id="stNotes" placeholder="e.g. Inv #8890" /></div>
        </div>

        <button class="btn btn--gold btn--block" id="stSubmit" style="margin-top:6px;">Record Stock & Update Inventory</button>
      </div>
    `, body => {
      $('#stSubmit', body)?.addEventListener('click', () => {
        const section = $('#stSection', body).value;
        const itemId = $('#stItem', body).value;
        const supplierName = $('#stSupplier', body).value.trim();
        const qtyReceived = $('#stQty', body).value;
        const unitCost = $('#stUnitCost', body).value;
        const notes = $('#stNotes', body).value.trim();

        if (!supplierName || !qtyReceived || qtyReceived <= 0) {
          toast('Please enter Supplier Name and Quantity Received.');
          return;
        }

        const res = Api.recordStockIn({ section, supplierName, itemId, qtyReceived, unitCost, notes });
        if (!res.ok) { toast(res.error); return; }

        closeModal();
        toast(`Added +${qtyReceived} stock for ${res.item.name}.`);
        navigate('stock');
      });
    });
  });
}

/* ---------- Guest Bookings & Official Receipts ---------- */
function renderBookings() {
  const bookings = Api.listBookings();
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const isAdmin = state.user?.role === ROLES.ADMIN;

  return `
    <div class="section-head">
      <div>
        <h3>Guest Bookings & Official Receipts</h3>
        <p>${isAdmin ? 'View official receipts for Guest House suites and VIP lounge bookings submitted to the System Admin.' : 'Generate official receipts for Guest House suites and VIP lounge bookings, and submit records to the System Admin.'}</p>
      </div>
      ${!isAdmin ? `<button class="btn btn--gold" id="btnCreateBooking">+ Generate New Booking Receipt</button>` : ''}
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:20px;">
      <div class="card" style="padding:16px;">
        <div style="font-size:12px; color:var(--text-faint);">Total Bookings Issued</div>
        <div style="font-size:24px; font-weight:bold; color:var(--gold-bright);">${bookings.length}</div>
        <div style="font-size:11px; color:var(--text-dim);">Submitted to System Admin</div>
      </div>
      <div class="card" style="padding:16px;">
        <div style="font-size:12px; color:var(--text-faint);">Total Booking Revenue</div>
        <div style="font-size:24px; font-weight:bold; color:var(--success-bright);">${money(totalRevenue)}</div>
        <div style="font-size:11px; color:var(--text-dim);">Confirmed bookings</div>
      </div>
    </div>

    <div class="card">
      <div class="card__head"><h4>Guest Booking Receipts Log</h4></div>
      ${bookings.length ? `
        <div class="table-wrap"><table>
          <thead>
            <tr>
              <th>Receipt Ref</th>
              <th>Guest Name</th>
              <th>Section</th>
              <th>Suite / Table</th>
              <th>Check-In Date</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Admin Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map(b => `
              <tr>
                <td><code>${b.bookingRef}</code></td>
                <td><b>${b.guestName}</b><div style="font-size:11px; color:var(--text-faint);">${b.guestPhone}</div></td>
                <td><span class="badge badge--gold">${b.section}</span></td>
                <td><b>${b.roomOrTable}</b></td>
                <td>${fmtDateTime(b.checkInDate)}</td>
                <td class="num"><b style="color:var(--gold-bright);">${money(b.totalAmount)}</b></td>
                <td><span class="badge badge--active">${b.paymentStatus}</span></td>
                <td><span class="badge badge--active">Submitted to Admin</span></td>
                <td style="white-space:nowrap; display:flex; gap:6px;">
                  <button class="btn btn--sm btn--ghost" data-action="view-receipt" data-id="${b.id}">View Receipt</button>
                  <button class="btn btn--sm btn--gold" data-action="excel-receipt" data-id="${b.id}">📊 Excel</button>
                  <button class="btn btn--sm btn--outline" data-action="pdf-receipt" data-id="${b.id}">📄 PDF</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table></div>
      ` : emptyState('No booking receipts generated yet.')}
    </div>
  `;
}

function bindBookingsView(root) {
  $('#btnCreateBooking', root)?.addEventListener('click', () => {
    openModal('Generate Guest Booking Receipt', `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Guest Full Name</span><input id="bkName" placeholder="e.g. Captain Patrick Mansaray" required /></div>
          <div class="field"><span class="field__label">Guest Phone Number</span><input id="bkPhone" placeholder="e.g. +232 78 888 999" /></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field">
            <span class="field__label">Booking Section</span>
            <select id="bkSection">
              <option value="${SECTIONS.GUEST_HOUSE}">Guest House Suites</option>
              <option value="${SECTIONS.BAR}">Bar & VIP Lounge Table</option>
              <option value="${SECTIONS.RESTAURANT}">Fine Restaurant Private Dining</option>
              <option value="${SECTIONS.SHISHA}">Shisha VIP Terrace</option>
            </select>
          </div>
          <div class="field"><span class="field__label">Suite / Table Number</span><input id="bkRoom" placeholder="e.g. Ocean View VIP Suite 201" required /></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Check-In Date & Time</span><input id="bkCheckIn" type="datetime-local" /></div>
          <div class="field"><span class="field__label">Check-Out Date & Time</span><input id="bkCheckOut" type="datetime-local" /></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
          <div class="field"><span class="field__label">Number of Guests</span><input id="bkGuests" type="number" min="1" value="2" /></div>
          <div class="field"><span class="field__label">Total Amount (Le)</span><input id="bkAmount" type="number" min="0" placeholder="e.g. 1900" required /></div>
          <div class="field">
            <span class="field__label">Payment Status</span>
            <select id="bkStatus">
              <option value="Paid">Paid (Full Settlement)</option>
              <option value="Deposit Paid">Deposit Paid</option>
              <option value="Pending">Pending Settlement</option>
            </select>
          </div>
        </div>

        <button class="btn btn--gold btn--block" id="bkSubmit" style="margin-top:6px;">Issue Receipt & Submit to Admin</button>
      </div>
    `, body => {
      $('#bkSubmit', body)?.addEventListener('click', () => {
        const guestName = $('#bkName', body).value.trim();
        const guestPhone = $('#bkPhone', body).value.trim();
        const section = $('#bkSection', body).value;
        const roomOrTable = $('#bkRoom', body).value.trim();
        const checkInDate = $('#bkCheckIn', body).value || todayISO();
        const checkOutDate = $('#bkCheckOut', body).value || todayISO();
        const numGuests = $('#bkGuests', body).value;
        const totalAmount = $('#bkAmount', body).value;
        const paymentStatus = $('#bkStatus', body).value;

        if (!guestName || !roomOrTable || !totalAmount) {
          toast('Please fill in Guest Name, Room/Table Number, and Total Amount.');
          return;
        }

        const res = Api.createBooking({
          guestName, guestPhone, section, roomOrTable, checkInDate, checkOutDate, numGuests, totalAmount, paymentStatus
        });

        if (!res.ok) { toast(res.error); return; }

        closeModal();
        toast(`Booking receipt ${res.booking.bookingRef} generated & submitted to Admin.`);
        navigate('bookings');
      });
    });
  });

  const bookings = Api.listBookings();

  $all('[data-action="view-receipt"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const b = bookings.find(x => x.id === btn.dataset.id);
      if (!b) return;
      openBookingReceiptModal(b);
    });
  });

  $all('[data-action="excel-receipt"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const b = bookings.find(x => x.id === btn.dataset.id);
      if (b) exportBookingExcel(b);
    });
  });

  $all('[data-action="pdf-receipt"]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const b = bookings.find(x => x.id === btn.dataset.id);
      if (b) exportBookingPDF(b);
    });
  });
}

function openBookingReceiptModal(b) {
  openModal(`Official Receipt — ${b.bookingRef}`, `
    <div id="bookingReceiptCard" style="background:var(--surface-2); padding:20px; border-radius:var(--radius-md); border:1px solid var(--border);">
      <div style="text-align:center; border-bottom:2px solid var(--gold); padding-bottom:12px; margin-bottom:16px;">
        <h2 style="font-size:22px; margin:0; color:var(--text);">CLUB TIKTOK</h2>
        <div style="font-size:12px; color:var(--text-faint);">Aberdeen Beach Road, Freetown · Phone: +232 76 100 200</div>
        <div style="font-size:14px; font-weight:bold; color:var(--gold-bright); margin-top:6px;">OFFICIAL GUEST BOOKING RECEIPT</div>
        <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-dim);">Ref: ${b.bookingRef}</div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:13px; margin-bottom:16px;">
        <div><span>Guest Name:</span> <strong>${b.guestName}</strong></div>
        <div><span>Phone Number:</span> <strong>${b.guestPhone}</strong></div>
        <div><span>Booking Section:</span> <strong>${b.section}</strong></div>
        <div><span>Room / Suite / Table:</span> <strong>${b.roomOrTable}</strong></div>
        <div><span>Check-In Date:</span> <strong>${fmtDateTime(b.checkInDate)}</strong></div>
        <div><span>Check-Out Date:</span> <strong>${fmtDateTime(b.checkOutDate)}</strong></div>
        <div><span>Number of Guests:</span> <strong>${b.numGuests} Guest(s)</strong></div>
        <div><span>Payment Status:</span> <strong><span class="badge badge--active">${b.paymentStatus}</span></strong></div>
      </div>

      <div style="background:var(--bg-elev); padding:14px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <div style="font-size:12px; color:var(--text-faint);">Total Booking Amount</div>
          <div style="font-size:22px; font-weight:bold; color:var(--gold-bright);">${money(b.totalAmount)}</div>
        </div>
        <div>
          <span class="badge badge--gold">Submitted to System Admin</span>
        </div>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="btn btn--gold btn--block" id="btnReceiptExcel">📊 Download Excel (.xlsx)</button>
        <button class="btn btn--outline btn--block" id="btnReceiptPdf">📄 Download PDF (.pdf)</button>
      </div>
    </div>
  `, body => {
    $('#btnReceiptExcel', body)?.addEventListener('click', () => exportBookingExcel(b));
    $('#btnReceiptPdf', body)?.addEventListener('click', () => exportBookingPDF(b));
  });
}

function exportBookingExcel(b) {
  if (typeof XLSX === 'undefined') { toast('Excel exporter loading... try again.'); return; }
  const rows = [{
    'Receipt Ref': b.bookingRef,
    'Guest Name': b.guestName,
    'Phone Number': b.guestPhone,
    'Section': b.section,
    'Room / Suite / Table': b.roomOrTable,
    'Check-In': b.checkInDate,
    'Check-Out': b.checkOutDate,
    'Guests': b.numGuests,
    'Total Amount (Le)': b.totalAmount,
    'Payment Status': b.paymentStatus,
    'Issued By': b.receiptGeneratedBy,
    'Admin Submission': 'Submitted to System Admin'
  }];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Booking Receipt");
  XLSX.writeFile(wb, `ClubTiktok_BookingReceipt_${b.bookingRef}.xlsx`);
  toast(`Exported Excel receipt ${b.bookingRef}.`);
}

function exportBookingPDF(b) {
  if (typeof html2pdf === 'undefined') { toast('PDF generator loading... try again.'); return; }
  let content = document.createElement('div');
  content.style.padding = '24px';
  content.style.fontFamily = 'sans-serif';
  content.innerHTML = `
    <div style="text-align:center; border-bottom:2px solid #C9A227; padding-bottom:12px; margin-bottom:20px;">
      <h1 style="color:#0B0B0C; margin:0; font-size:24px;">CLUB TIKTOK</h1>
      <p style="color:#555; margin:4px 0 0; font-size:13px;">Aberdeen Beach Road, Freetown · Phone: +232 76 100 200</p>
      <h3 style="color:#C9A227; margin:8px 0 0;">OFFICIAL GUEST BOOKING RECEIPT</h3>
      <p style="color:#777; margin:4px 0 0; font-size:12px;"><b>Receipt Ref:</b> ${b.bookingRef}</p>
    </div>

    <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:13px;" border="1" cellpadding="8">
      <tr><td style="font-weight:bold; background:#f5f5f5;">Guest Name:</td><td>${b.guestName}</td><td style="font-weight:bold; background:#f5f5f5;">Phone:</td><td>${b.guestPhone}</td></tr>
      <tr><td style="font-weight:bold; background:#f5f5f5;">Section:</td><td>${b.section}</td><td style="font-weight:bold; background:#f5f5f5;">Room / Table:</td><td>${b.roomOrTable}</td></tr>
      <tr><td style="font-weight:bold; background:#f5f5f5;">Check-In:</td><td>${b.checkInDate}</td><td style="font-weight:bold; background:#f5f5f5;">Check-Out:</td><td>${b.checkOutDate}</td></tr>
      <tr><td style="font-weight:bold; background:#f5f5f5;">Guests Count:</td><td>${b.numGuests} Guest(s)</td><td style="font-weight:bold; background:#f5f5f5;">Payment Status:</td><td>${b.paymentStatus}</td></tr>
    </table>

    <div style="background:#f8f9fa; border:1px solid #ddd; padding:16px; border-radius:6px; margin-bottom:20px; text-align:center;">
      <h2 style="margin:0; color:#111;">Total Paid: Le ${Number(b.totalAmount).toLocaleString()}</h2>
      <p style="margin:6px 0 0; color:#555; font-size:12px;">Official Booking Receipt Submitted to System Admin</p>
    </div>

    <div style="font-size:11px; color:#888; text-align:center; border-top:1px solid #eee; padding-top:10px;">
      Issued by ${b.receiptGeneratedBy} · Club Tiktok Management System v3.0
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `ClubTiktok_BookingReceipt_${b.bookingRef}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(content).save();
  toast(`Exported PDF receipt ${b.bookingRef}.`);
}

/* ---------- System Settings (Admin Only) ---------- */
function renderSettings() {
  if (state.user?.role !== ROLES.ADMIN) {
    return `<div class="card" style="padding:24px; text-align:center;"><p style="color:var(--text-dim);">Access restricted to System Admin accounts.</p></div>`;
  }

  const settings = Api.getSettings() || {};
  const shiftTimes = settings.shiftTimes || {
    Morning: { start: '08:00', end: '16:00' },
    Afternoon: { start: '12:00', end: '20:00' },
    Evening: { start: '16:00', end: '00:00' },
    Night: { start: '00:00', end: '08:00' },
  };

  const reports = Api.listReports() || [];
  const bookings = Api.listBookings() || [];
  const reportSales = reports.reduce((s, r) => s + (r.totalSales || 0), 0);
  const bookingSales = bookings.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
  const grandTotalSales = reportSales + bookingSales;

  return `
    <div style="display:flex; flex-direction:column; gap:24px; max-width:960px; margin:0 auto;">
      <!-- Shift Times Settings Card -->
      <div class="card" style="padding:24px; border:1px solid var(--border); border-radius:var(--radius-lg); background:var(--surface);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:12px;">
          <div>
            <h3 style="margin:0; font-size:18px; color:var(--text); font-weight:700;">Operational Shift Schedules</h3>
            <p style="margin:4px 0 0; font-size:13px; color:var(--text-dim);">Set shift start and end times for staff assignments & punctuality tracking.</p>
          </div>
          <span class="badge badge--gold">System Config</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:20px;">
          <div style="background:var(--bg-elev); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-weight:600; color:var(--gold-bright); margin-bottom:10px;">🌅 Morning Shift</div>
            <div class="field" style="margin-bottom:8px;">
              <span class="field__label">Start Time</span>
              <input type="time" id="shiftMorningStart" value="${shiftTimes.Morning?.start || '08:00'}" />
            </div>
            <div class="field">
              <span class="field__label">End Time</span>
              <input type="time" id="shiftMorningEnd" value="${shiftTimes.Morning?.end || '16:00'}" />
            </div>
          </div>

          <div style="background:var(--bg-elev); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-weight:600; color:var(--gold-bright); margin-bottom:10px;">☀️ Afternoon Shift</div>
            <div class="field" style="margin-bottom:8px;">
              <span class="field__label">Start Time</span>
              <input type="time" id="shiftAfternoonStart" value="${shiftTimes.Afternoon?.start || '12:00'}" />
            </div>
            <div class="field">
              <span class="field__label">End Time</span>
              <input type="time" id="shiftAfternoonEnd" value="${shiftTimes.Afternoon?.end || '20:00'}" />
            </div>
          </div>

          <div style="background:var(--bg-elev); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-weight:600; color:var(--gold-bright); margin-bottom:10px;">🌆 Evening Shift</div>
            <div class="field" style="margin-bottom:8px;">
              <span class="field__label">Start Time</span>
              <input type="time" id="shiftEveningStart" value="${shiftTimes.Evening?.start || '16:00'}" />
            </div>
            <div class="field">
              <span class="field__label">End Time</span>
              <input type="time" id="shiftEveningEnd" value="${shiftTimes.Evening?.end || '00:00'}" />
            </div>
          </div>

          <div style="background:var(--bg-elev); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-weight:600; color:var(--gold-bright); margin-bottom:10px;">🌙 Night Shift</div>
            <div class="field" style="margin-bottom:8px;">
              <span class="field__label">Start Time</span>
              <input type="time" id="shiftNightStart" value="${shiftTimes.Night?.start || '00:00'}" />
            </div>
            <div class="field">
              <span class="field__label">End Time</span>
              <input type="time" id="shiftNightEnd" value="${shiftTimes.Night?.end || '08:00'}" />
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end;">
          <button id="btnSaveShiftTimes" class="btn btn--gold">Save Shift Settings</button>
        </div>
      </div>

      <!-- Financial Data Management & Clear Sales Card (Danger Zone) -->
      <div class="card" style="padding:24px; border:1px solid rgba(220, 53, 69, 0.4); border-radius:var(--radius-lg); background:var(--surface);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:12px;">
          <div>
            <h3 style="margin:0; font-size:18px; color:#ff6b6b; font-weight:700;">Sales Data & Financial Reset</h3>
            <p style="margin:4px 0 0; font-size:13px; color:var(--text-dim);">Purge sales reports and reset total sales revenue figures across all sections.</p>
          </div>
          <span class="badge" style="background:rgba(220, 53, 69, 0.2); color:#ff6b6b; border:1px solid rgba(220, 53, 69, 0.4);">Danger Zone</span>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-elev); padding:18px; border-radius:var(--radius-md); gap:16px; flex-wrap:wrap;">
          <div>
            <div style="font-size:12px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.5px;">Current Total Recorded Revenue</div>
            <div style="font-size:26px; font-weight:800; color:var(--gold-bright); margin-top:2px;">${money(grandTotalSales)}</div>
            <div style="font-size:12px; color:var(--text-dim); margin-top:4px;">Includes ${reports.length} daily staff report(s) and ${bookings.length} guest booking receipt(s).</div>
          </div>

          <button id="btnClearTotalSales" class="btn" style="background:#dc3545; color:#ffffff; border:none; padding:10px 20px; font-weight:600; cursor:pointer; border-radius:var(--radius-sm);">
            Clear All Total Sales
          </button>
        </div>
      </div>
    </div>
  `;
}

function bindSettingsView(root) {
  $('#btnSaveShiftTimes', root)?.addEventListener('click', async () => {
    const btn = $('#btnSaveShiftTimes', root);
    btn.disabled = true;
    btn.textContent = 'Saving...';

    const shiftTimes = {
      Morning: { start: $('#shiftMorningStart', root).value, end: $('#shiftMorningEnd', root).value },
      Afternoon: { start: $('#shiftAfternoonStart', root).value, end: $('#shiftAfternoonEnd', root).value },
      Evening: { start: $('#shiftEveningStart', root).value, end: $('#shiftEveningEnd', root).value },
      Night: { start: $('#shiftNightStart', root).value, end: $('#shiftNightEnd', root).value },
    };

    const res = await Api.updateShiftTimes(shiftTimes);
    btn.disabled = false;
    btn.textContent = 'Save Shift Settings';

    if (res.ok) {
      toast('Operational shift times saved successfully!');
    } else {
      toast(res.error || 'Failed to save shift times.');
    }
  });

  $('#btnClearTotalSales', root)?.addEventListener('click', () => {
    openModal('Confirm Clear All Total Sales', `
      <div style="display:flex; flex-direction:column; gap:16px; text-align:center;">
        <div style="font-size:48px;">⚠️</div>
        <h3 style="margin:0; color:#ff6b6b;">Are you sure you want to clear all total sales?</h3>
        <p style="margin:0; font-size:14px; color:var(--text-dim); line-height:1.5;">
          This action will <strong>permanently purge all daily staff sales reports and booking receipts</strong>, resetting total sales revenue figures across all sections to <strong>Le 0</strong>.
        </p>
        <p style="margin:0; font-size:12px; color:var(--text-faint);">
          This action cannot be undone. System Admin activity will be logged in the audit trail.
        </p>
        <div style="display:flex; gap:12px; margin-top:8px;">
          <button class="btn btn--ghost btn--block" id="btnCancelClearSales">Cancel</button>
          <button class="btn btn--block" id="btnConfirmClearSales" style="background:#dc3545; color:#fff; font-weight:bold;">Yes, Clear All Sales Data</button>
        </div>
      </div>
    `, body => {
      $('#btnCancelClearSales', body)?.addEventListener('click', closeModal);
      $('#btnConfirmClearSales', body)?.addEventListener('click', async () => {
        const confirmBtn = $('#btnConfirmClearSales', body);
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Clearing Sales...';

        const res = await Api.clearAllTotalSales();
        closeModal();

        if (res.ok) {
          toast('All total sales data has been cleared successfully.');
          navigate('settings');
        } else {
          toast(res.error || 'Failed to clear total sales data.');
        }
      });
    });
  });
}

/* ---------------- view binder dispatcher ---------------- */
function bindView(routeId, root) {
  if (routeId === 'users') bindUsersView(root);
  if (routeId === 'items') bindItemsView(root);
  if (routeId === 'submit') bindSubmitView(root);
  if (routeId === 'stock') bindStockView(root);
  if (routeId === 'bookings') bindBookingsView(root);
  if (routeId === 'settings') bindSettingsView(root);
  if (routeId === 'staff' || routeId === 'dashboard') bindStaffOverviewView(root);
  if (routeId === 'inbox' || routeId === 'allReports' || routeId === 'dashboard' || routeId === 'myReports' || routeId === 'staff' || routeId === 'stock' || routeId === 'bookings') bindReportViewButtons(root);
}

/* ---------------- boot ---------------- */
(async function boot() {
  try {
    if (!localStorage.getItem('ctb_theme')) applyTheme('dark');

    const restoredUser = await Api.restoreSession();
    if (restoredUser) {
      state.user = restoredUser;
      enterApp();
    } else {
      showScreen('landing');
    }
  } catch (err) {
    console.error('Boot initialization error:', err);
    showScreen('landing');
  }
})();
