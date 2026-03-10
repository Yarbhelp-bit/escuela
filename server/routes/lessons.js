import { Router } from 'express';
const router = Router();

// Get all lessons with progress
router.get('/', (req, res) => {
  const lessons = req.db.prepare(`
    SELECT l.*,
      (SELECT COUNT(*) FROM cards WHERE lesson_id = l.id) as card_count
    FROM lessons l
    ORDER BY l.id
  `).all();
  res.json(lessons);
});

// Get a specific lesson
router.get('/:id', (req, res) => {
  const lesson = req.db.prepare(`
    SELECT l.*,
      (SELECT COUNT(*) FROM cards WHERE lesson_id = l.id) as card_count
    FROM lessons l
    WHERE l.id = ?
  `).get(req.params.id);

  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const cards = req.db.prepare(`
    SELECT c.*, p.easiness_factor, p.interval, p.repetitions, p.next_review, p.last_rating
    FROM cards c
    LEFT JOIN progress p ON c.id = p.card_id
    WHERE c.lesson_id = ?
    ORDER BY c.id
  `).all(req.params.id);

  res.json({ ...lesson, cards });
});

export default router;
