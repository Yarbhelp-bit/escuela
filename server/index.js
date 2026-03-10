import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeDatabase } from './db/schema.js';
import cardsRouter from './routes/cards.js';
import progressRouter from './routes/progress.js';
import lessonsRouter from './routes/lessons.js';
import quizRouter from './routes/quiz.js';
import statsRouter from './routes/stats.js';
import settingsRouter from './routes/settings.js';
import tipsRouter from './routes/tips.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const db = new Database(join(__dirname, 'escuela.db'));
db.pragma('journal_mode = WAL');
initializeDatabase(db);

// Middleware
app.use(cors());
app.use(express.json());

// Attach db to request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/cards', cardsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/stats', statsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/tips', tipsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React build in production
const clientDist = join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Escuela server running on http://localhost:${PORT}`);
});
