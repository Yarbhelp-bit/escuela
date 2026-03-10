# Escuela — Learn Spanish

A full-stack Spanish learning app with spaced repetition, flashcards, quizzes, and lesson tracks.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Express + SQLite (better-sqlite3)
- **Algorithm:** SM-2 spaced repetition

## Setup

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Seed the database (200 vocabulary cards, 10 lessons, 20 grammar tips)
cd ../server && npm run seed

# Start the backend (port 3001)
npm run dev

# In another terminal, start the frontend (port 5173)
cd client && npm run dev
```

Open http://localhost:5173

## Features

- **Flashcard Deck** — 200 words with SM-2 spaced repetition
- **Lesson Tracks** — 10 beginner lessons, progressive unlocking at 80% mastery
- **Quiz Modes** — Flashcard flip, multiple choice, type answer, listening (Web Speech API)
- **Stats Dashboard** — Streak counter, accuracy, heatmap, time tracking
- **Grammar Tips** — 20 tips shown every 10 cards
- **Settings** — Card direction, quiz mode, daily goal, notifications

## Deployment

- **Frontend (Vercel):** `cd client && npm run build` → deploy `dist/`
- **Backend (Railway):** deploy `server/` with `npm start`

Set `VITE_API_URL` in the client build for production API URL.
