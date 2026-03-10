import { Router } from 'express';
const router = Router();

// Get all cards (with optional lesson filter)
router.get('/', (req, res) => {
  const { lesson_id } = req.query;
  let cards;
  if (lesson_id) {
    cards = req.db.prepare(`
      SELECT c.*, p.easiness_factor, p.interval, p.repetitions, p.next_review, p.last_rating
      FROM cards c
      LEFT JOIN progress p ON c.id = p.card_id
      WHERE c.lesson_id = ?
      ORDER BY c.id
    `).all(lesson_id);
  } else {
    cards = req.db.prepare(`
      SELECT c.*, p.easiness_factor, p.interval, p.repetitions, p.next_review, p.last_rating
      FROM cards c
      LEFT JOIN progress p ON c.id = p.card_id
      ORDER BY c.id
    `).all();
  }
  res.json(cards);
});

// Get cards due for review (spaced repetition)
router.get('/due', (req, res) => {
  const { limit = 20, lesson_id } = req.query;
  let query = `
    SELECT c.*, p.easiness_factor, p.interval, p.repetitions, p.next_review, p.last_rating
    FROM cards c
    LEFT JOIN progress p ON c.id = p.card_id
    WHERE p.next_review <= date('now')
  `;
  const params = [];
  if (lesson_id) {
    query += ' AND c.lesson_id = ?';
    params.push(lesson_id);
  }
  query += ' ORDER BY p.next_review ASC, p.easiness_factor ASC LIMIT ?';
  params.push(Number(limit));

  const cards = req.db.prepare(query).all(...params);
  res.json(cards);
});

// Get a single card
router.get('/:id', (req, res) => {
  const card = req.db.prepare(`
    SELECT c.*, p.easiness_factor, p.interval, p.repetitions, p.next_review, p.last_rating
    FROM cards c
    LEFT JOIN progress p ON c.id = p.card_id
    WHERE c.id = ?
  `).get(req.params.id);

  if (!card) return res.status(404).json({ error: 'Card not found' });
  res.json(card);
});

export default router;
