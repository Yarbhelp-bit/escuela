import { Router } from 'express';
const router = Router();

// Get all settings
router.get('/', (req, res) => {
  const rows = req.db.prepare('SELECT key, value FROM settings').all();
  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

// Update a setting
router.put('/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  const validKeys = ['direction', 'quiz_mode', 'daily_goal', 'reminder_time'];
  if (!validKeys.includes(key)) {
    return res.status(400).json({ error: `Invalid setting key. Valid: ${validKeys.join(', ')}` });
  }

  req.db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
  ).run(key, String(value), String(value));

  res.json({ key, value: String(value) });
});

export default router;
