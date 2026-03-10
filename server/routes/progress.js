import { Router } from 'express';
import { calculateSM2 } from '../utils/sm2.js';
const router = Router();

// Rate a card (1-4) and update SM-2 progress
router.post('/rate', (req, res) => {
  const { card_id, rating } = req.body;

  if (!card_id || !rating || rating < 1 || rating > 4) {
    return res.status(400).json({ error: 'card_id and rating (1-4) required' });
  }

  const current = req.db.prepare('SELECT * FROM progress WHERE card_id = ?').get(card_id);
  if (!current) {
    return res.status(404).json({ error: 'Progress record not found' });
  }

  const updated = calculateSM2(
    rating,
    current.easiness_factor,
    current.interval,
    current.repetitions
  );

  req.db.prepare(`
    UPDATE progress
    SET easiness_factor = ?, interval = ?, repetitions = ?, next_review = ?,
        last_review = date('now'), last_rating = ?
    WHERE card_id = ?
  `).run(
    updated.easiness_factor,
    updated.interval,
    updated.repetitions,
    updated.next_review,
    rating,
    card_id
  );

  // Update today's streak
  req.db.prepare(`
    INSERT INTO streaks (date, cards_studied, time_spent_seconds)
    VALUES (date('now'), 1, 0)
    ON CONFLICT(date) DO UPDATE SET cards_studied = cards_studied + 1
  `).run();

  // Update lesson mastery
  const card = req.db.prepare('SELECT lesson_id FROM cards WHERE id = ?').get(card_id);
  if (card) {
    const stats = req.db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN p.repetitions >= 1 AND p.last_rating >= 3 THEN 1 ELSE 0 END) as mastered
      FROM cards c
      JOIN progress p ON c.id = p.card_id
      WHERE c.lesson_id = ?
    `).get(card.lesson_id);

    const mastery = stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0;
    req.db.prepare('UPDATE lessons SET mastery_percent = ? WHERE id = ?')
      .run(Math.round(mastery * 10) / 10, card.lesson_id);

    // Unlock next lesson if mastery >= 80%
    if (mastery >= 80) {
      req.db.prepare('UPDATE lessons SET unlocked = 1 WHERE id = ?')
        .run(card.lesson_id + 1);
    }
  }

  res.json({ card_id, rating, ...updated });
});

// Get overall progress summary
router.get('/summary', (req, res) => {
  const total = req.db.prepare('SELECT COUNT(*) as count FROM cards').get();
  const learned = req.db.prepare(`
    SELECT COUNT(*) as count FROM progress
    WHERE repetitions >= 1 AND last_rating >= 3
  `).get();
  const due = req.db.prepare(`
    SELECT COUNT(*) as count FROM progress
    WHERE next_review <= date('now')
  `).get();

  res.json({
    total_cards: total.count,
    learned: learned.count,
    remaining: total.count - learned.count,
    due_today: due.count,
  });
});

export default router;
