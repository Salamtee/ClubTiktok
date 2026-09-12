const Activity = require('./models/Activity');
const { uid } = require('./constants');

async function logActivity(username, action, role = '', section = '') {
  try {
    await Activity.create({
      id: uid('a'),
      username: username || 'user',
      role: role || '',
      section: section || '',
      action: action || '',
      at: new Date().toISOString(),
    });
    // Keep the log from growing without bound.
    const count = await Activity.countDocuments();
    if (count > 300) {
      const stale = await Activity.find().sort({ at: 1 }).limit(count - 300).select('_id');
      await Activity.deleteMany({ _id: { $in: stale.map((s) => s._id) } });
    }
  } catch (err) {
    console.error('[activity] failed to log:', err.message);
  }
}

module.exports = logActivity;
