// backend/controllers/thinkingReplayController.js
const ThinkingReplayService = require('../services/thinkingReplayService');

// --- (Existing helper functions for getReplay and saveSnapshot - waisa hi rahega) ---

// 🔥 ISSUE #2283: Editor event helper moved here
async function saveEditorEvent(data) {
  // Replace this with actual DB query in the future
  console.log('Saving event:', data);
}

// 🔥 ISSUE #2283: Editor event logging logic moved here
exports.logEditorEvent = async (req, res) => {
  try {
    const { problemId, type } = req.body;
    const userId = req.user?.id || 'anonymous';

    await saveEditorEvent({ userId, problemId, type });

    res.json({ success: true });
  } catch (error) {
    console.error('Event logging error:', error);
    res.status(500).json({ error: 'Failed to log event' });
  }
};