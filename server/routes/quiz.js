import { Router } from 'express';
import enrichments from '../data/enrichments.js';
const router = Router();

// Get quiz questions (multiple choice with distractors + enrichment data)
router.get('/multiple-choice', (req, res) => {
  const { lesson_id, count = 10, mode } = req.query;

  let targetCards;

  if (mode === 'image') {
    // For image mode, get cards that have emojis
    const emojiWords = Object.entries(enrichments)
      .filter(([, v]) => v.emoji)
      .map(([k]) => k);

    let allCards;
    if (lesson_id) {
      allCards = req.db.prepare(`
        SELECT c.*, p.next_review FROM cards c
        LEFT JOIN progress p ON c.id = p.card_id
        WHERE c.lesson_id = ?
        ORDER BY RANDOM()
      `).all(lesson_id);
    } else {
      allCards = req.db.prepare(`
        SELECT c.*, p.next_review FROM cards c
        LEFT JOIN progress p ON c.id = p.card_id
        ORDER BY RANDOM()
      `).all();
    }

    targetCards = allCards
      .filter(c => emojiWords.includes(c.spanish))
      .slice(0, Number(count));
  } else if (lesson_id) {
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

  // If not enough due cards, get random ones
  if (targetCards.length < Number(count) && !lesson_id && mode !== 'image') {
    const existing = new Set(targetCards.map(c => c.id));
    const more = req.db.prepare(`
      SELECT c.*, p.next_review FROM cards c
      LEFT JOIN progress p ON c.id = p.card_id
      ORDER BY RANDOM()
      LIMIT ?
    `).all(Number(count) - targetCards.length + 10);
    for (const card of more) {
      if (!existing.has(card.id)) {
        targetCards.push(card);
        existing.add(card.id);
        if (targetCards.length >= Number(count)) break;
      }
    }
  }

  // Build questions with distractors and enrichment data
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

    const extra = enrichments[card.spanish] || {};

    return {
      card_id: card.id,
      question_spanish: card.spanish,
      question_english: card.english,
      gender: card.gender,
      options,
      emoji: extra.emoji || null,
      definition_es: extra.definition_es || null,
      cloze_es: extra.cloze_es || null,
      cloze_answer: extra.cloze_answer || card.spanish,
    };
  });

  res.json(questions);
});

export default router;
