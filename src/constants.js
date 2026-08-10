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

const SHIFT_START_HOURS = {
  Morning: 8,
  Afternoon: 12,
  Evening: 16,
  Night: 0,
  All: null,
};

const MANAGEMENT_ROLES = [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGER];

function calculatePunctuality(shiftName, dateObj = new Date()) {
  const startHour = SHIFT_START_HOURS[shiftName];
  if (startHour === undefined || startHour === null) {
    return { status: 'On Time', label: 'On Time', minutesLate: 0, badge: '🟢 On Time' };
  }
  const shiftStart = new Date(dateObj);
  shiftStart.setHours(startHour, 0, 0, 0);
  const diffMinutes = Math.round((dateObj.getTime() - shiftStart.getTime()) / (1000 * 60));
  if (diffMinutes <= 15) {
    return { status: 'On Time', label: 'On Time', minutesLate: Math.max(0, diffMinutes), badge: '🟢 On Time' };
  }
  return {
    status: 'Late',
    label: `Late by ${diffMinutes}m`,
    minutesLate: diffMinutes,
    badge: `🔴 Late (${diffMinutes}m late)`,
  };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

module.exports = { ROLES, SECTIONS, SHIFT_START_HOURS, MANAGEMENT_ROLES, calculatePunctuality, todayISO, uid };
