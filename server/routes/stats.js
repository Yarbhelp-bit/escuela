import { Router } from 'express';
const router = Router();

// Get overall stats
router.get('/', (req, res) => {
  // Streak count (consecutive days)
  const streakDays = req.db.prepare(`
    SELECT date FROM streaks
    WHERE cards_studied > 0
    ORDER BY date DESC
  `).all();

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (streakDays.length > 0) {
    const lastStudy = streakDays[0].date;
    if (lastStudy === today || lastStudy === yesterday) {
      streak = 1;
      for (let i = 1; i < streakDays.length; i++) {
        const expected = new Date(streakDays[i - 1].date);
        expected.setDate(expected.getDate() - 1);
        const expectedStr = expected.toISOString().split('T')[0];
        if (streakDays[i].date === expectedStr) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  // Words learned vs remaining
  const total = req.db.prepare('SELECT COUNT(*) as c FROM cards').get().c;
  const learned = req.db.prepare(
    'SELECT COUNT(*) as c FROM progress WHERE repetitions >= 1 AND last_rating >= 3'
  ).get().c;

  // Today's session stats
  const todayStats = req.db.prepare(`
    SELECT
      COALESCE(SUM(cards_studied), 0) as cards,
      COALESCE(SUM(correct), 0) as correct,
      COALESCE(SUM(incorrect), 0) as incorrect
    FROM sessions
    WHERE date(started_at) = date('now')
  `).get();

  const todayAccuracy = (todayStats.correct + todayStats.incorrect) > 0
    ? Math.round((todayStats.correct / (todayStats.correct + todayStats.incorrect)) * 100)
    : 0;

  // Total time spent (from streaks table)
  const totalTime = req.db.prepare(
    'SELECT COALESCE(SUM(time_spent_seconds), 0) as total FROM streaks'
  ).get().total;

  // Today's cards studied
  const todayCards = req.db.prepare(
    'SELECT COALESCE(cards_studied, 0) as c FROM streaks WHERE date = date(\'now\')'
  ).get();

  // Daily goal
  const dailyGoal = req.db.prepare(
    'SELECT value FROM settings WHERE key = \'daily_goal\''
  ).get();

  res.json({
    streak,
    words_learned: learned,
    words_remaining: total - learned,
    total_cards: total,
    today_cards: todayCards ? todayCards.c : 0,
    today_accuracy: todayAccuracy,
    total_time_seconds: totalTime,
    daily_goal: dailyGoal ? Number(dailyGoal.value) : 20,
  });
});

// Get weekly heatmap data (last 12 weeks)
router.get('/heatmap', (req, res) => {
  const data = req.db.prepare(`
    SELECT date, cards_studied, time_spent_seconds
    FROM streaks
    WHERE date >= date('now', '-84 days')
    ORDER BY date ASC
  `).all();
  res.json(data);
});

// Record a session
router.post('/session', (req, res) => {
  const { cards_studied, correct, incorrect, mode, time_spent } = req.body;

  const result = req.db.prepare(`
    INSERT INTO sessions (cards_studied, correct, incorrect, mode, ended_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run(cards_studied || 0, correct || 0, incorrect || 0, mode || 'flashcard');

  // Update time spent today
  if (time_spent) {
    req.db.prepare(`
      INSERT INTO streaks (date, cards_studied, time_spent_seconds)
      VALUES (date('now'), 0, ?)
      ON CONFLICT(date) DO UPDATE SET time_spent_seconds = time_spent_seconds + ?
    `).run(time_spent, time_spent);
  }

  res.json({ id: result.lastInsertRowid });
});

export default router;
