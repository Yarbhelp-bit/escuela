// API helper — all requests go through here
const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Cards
  getCards: (lessonId) => request(lessonId ? `/cards?lesson_id=${lessonId}` : '/cards'),
  getDueCards: (limit = 20, lessonId) => {
    let url = `/cards/due?limit=${limit}`;
    if (lessonId) url += `&lesson_id=${lessonId}`;
    return request(url);
  },
  getCard: (id) => request(`/cards/${id}`),

  // Progress
  rateCard: (cardId, rating) => request('/progress/rate', {
    method: 'POST',
    body: JSON.stringify({ card_id: cardId, rating }),
  }),
  getProgressSummary: () => request('/progress/summary'),

  // Lessons
  getLessons: () => request('/lessons'),
  getLesson: (id) => request(`/lessons/${id}`),

  // Quiz
  getQuizQuestions: (lessonId, count = 10, mode) => {
    let url = `/quiz/multiple-choice?count=${count}`;
    if (lessonId) url += `&lesson_id=${lessonId}`;
    if (mode) url += `&mode=${mode}`;
    return request(url);
  },

  // Stats
  getStats: () => request('/stats'),
  getHeatmap: () => request('/stats/heatmap'),
  recordSession: (data) => request('/stats/session', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Settings
  getSettings: () => request('/settings'),
  updateSetting: (key, value) => request(`/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  }),

  // Tips
  getRandomTip: () => request('/tips/random'),
  dismissTip: (id) => request(`/tips/${id}/dismiss`, { method: 'POST' }),
};
