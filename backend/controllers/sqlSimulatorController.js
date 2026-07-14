// backend/controllers/sqlSimulatorController.js
import { initDB, getDb } from '../services/sqlSimulatorService.js';

export const resetDatabase = (req, res) => {
  try {
    const db = getDb();
    db.exec(`DROP TABLE IF EXISTS employees;`);
    initDB();
    return res.json({ success: true, message: 'Database reset successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};