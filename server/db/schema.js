// Database schema — creates all tables if they don't exist
export function initializeDatabase(db) {
  db.exec(`
    -- Vocabulary cards: the 200-word deck
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spanish TEXT NOT NULL,
      english TEXT NOT NULL,
      gender TEXT CHECK(gender IN ('masculine', 'feminine', 'both', 'none')),
      lesson_id INTEGER NOT NULL,
      example_sentence_es TEXT,
      example_sentence_en TEXT
    );

    -- SM-2 spaced repetition progress per card
    CREATE TABLE IF NOT EXISTS progress (
      card_id INTEGER PRIMARY KEY REFERENCES cards(id),
      easiness_factor REAL DEFAULT 2.5,
      interval INTEGER DEFAULT 0,
      repetitions INTEGER DEFAULT 0,
      next_review TEXT DEFAULT (date('now')),
      last_review TEXT,
      last_rating INTEGER
    );

    -- Lesson tracking (10 lessons, 20 words each)
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      unlocked INTEGER DEFAULT 1,
      mastery_percent REAL DEFAULT 0
    );

    -- Study sessions for stats
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at TEXT DEFAULT (datetime('now')),
      ended_at TEXT,
      cards_studied INTEGER DEFAULT 0,
      correct INTEGER DEFAULT 0,
      incorrect INTEGER DEFAULT 0,
      mode TEXT
    );

    -- Daily streak tracking
    CREATE TABLE IF NOT EXISTS streaks (
      date TEXT PRIMARY KEY,
      cards_studied INTEGER DEFAULT 0,
      time_spent_seconds INTEGER DEFAULT 0
    );

    -- User settings
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Grammar tips shown
    CREATE TABLE IF NOT EXISTS grammar_tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS tips_shown (
      tip_id INTEGER REFERENCES grammar_tips(id),
      shown_at TEXT DEFAULT (datetime('now')),
      dismissed INTEGER DEFAULT 0
    );
  `);

  // Default settings
  const insertSetting = db.prepare(
    'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)'
  );
  insertSetting.run('direction', 'en_to_es');
  insertSetting.run('quiz_mode', 'flashcard');
  insertSetting.run('daily_goal', '20');
  insertSetting.run('reminder_time', '09:00');

  // Unlock all lessons by default
  db.prepare('UPDATE lessons SET unlocked = 1 WHERE unlocked = 0').run();
}
