// backend/controllers/thinkingReplayController.js
const ThinkingReplayService = require('../services/thinkingReplayService');

// --- (Existing helper functions for getReplay - waisa hi rahega) ---

// 🔥 ISSUE #2282: Snapshot helper moved here
async function saveSnapshot(data) {
  // Replace this with actual DB query in the future
  console.log('Saving snapshot:', data);
}

// 🔥 ISSUE #2282: Snapshot creation logic moved here
exports.saveSnapshot = async (req, res) => {
  try {
    const { problemId, code, status, executionTime, errors } = req.body;
    const userId = req.user?.id || 'anonymous';

    await saveSnapshot({ userId, problemId, code, status, executionTime, errors });

    res.json({ success: true, message: 'Snapshot saved' });
  } catch (error) {
    console.error('Snapshot error:', error);
    res.status(500).json({ error: 'Failed to save snapshot' });
  }
};