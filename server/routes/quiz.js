import { Router } from 'express';
const router = Router();

// Get quiz questions (multiple choice with distractors)
router.get('/multiple-choice', (req, res) => {
  const { lesson_id, count = 10 } = req.query;

  // Get cards due for review, or random cards from lesson
  let targetCards;
  if (lesson_id) {
    targetCards = req.db.prepare(`
      SELECT c.*, p.next_review FROM cards c
      LEFT JOIN progress p ON c.id = p.card_id
      WHERE c.lesson_id = ?
      ORDER BY p.next_review ASC
      LIMIT ?
    `).all(lesson_id, Number(count));
  } else {
    targetCards = req.db.prepare(`
      SELECT c.*, p.next_review FROM cards c
      LEFT JOIN progress p ON c.id = p.card_id
      WHERE p.next_review <= date('now')
      ORDER BY p.next_review ASC
      LIMIT ?
    `).all(Number(count));
  }

  // Build questions with distractors
  const questions = targetCards.map(card => {
    // Get 3 random distractors from same lesson (or all cards)
    const distractors = req.db.prepare(`
      SELECT spanish, english FROM cards
      WHERE id != ? AND lesson_id = ?
      ORDER BY RANDOM()
      LIMIT 3
    `).all(card.id, card.lesson_id);

    // If not enough from same lesson, fill from other cards
    if (distractors.length < 3) {
      const more = req.db.prepare(`
        SELECT spanish, english FROM cards
        WHERE id != ? AND id NOT IN (${distractors.map(() => '?').join(',') || '0'})
        ORDER BY RANDOM()
        LIMIT ?
      `).all(card.id, ...distractors.map(d => d.spanish), 3 - distractors.length);
      distractors.push(...more);
    }

    const options = [
      { spanish: card.spanish, english: card.english, correct: true },
      ...distractors.map(d => ({ spanish: d.spanish, english: d.english, correct: false })),
    ].sort(() => Math.random() - 0.5);

    return {
      card_id: card.id,
      question_spanish: card.spanish,
      question_english: card.english,
      gender: card.gender,
      options,
    };
  });

  res.json(questions);
});

export default router;
