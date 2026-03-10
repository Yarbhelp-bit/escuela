import { Router } from 'express';
const router = Router();

// Get a random grammar tip that hasn't been dismissed recently
router.get('/random', (req, res) => {
  const tip = req.db.prepare(`
    SELECT g.* FROM grammar_tips g
    WHERE g.id NOT IN (
      SELECT tip_id FROM tips_shown WHERE dismissed = 1
    )
    ORDER BY RANDOM()
    LIMIT 1
  `).get();

  if (!tip) {
    // All tips dismissed — reset and pick one
    req.db.prepare('DELETE FROM tips_shown').run();
    const anyTip = req.db.prepare('SELECT * FROM grammar_tips ORDER BY RANDOM() LIMIT 1').get();
    return res.json(anyTip || null);
  }

  res.json(tip);
});

// Mark a tip as shown/dismissed
router.post('/:id/dismiss', (req, res) => {
  req.db.prepare(
    'INSERT INTO tips_shown (tip_id, dismissed) VALUES (?, 1)'
  ).run(req.params.id);
  res.json({ ok: true });
});

// Get all tips
router.get('/', (req, res) => {
  const tips = req.db.prepare('SELECT * FROM grammar_tips ORDER BY id').all();
  res.json(tips);
});

export default router;
