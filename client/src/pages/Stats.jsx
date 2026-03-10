import { useState, useEffect } from 'react';
import { api } from '../utils/api';

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
    api.getHeatmap().then(setHeatmap).catch(() => {});
  }, []);

  // Build 84-day (12 weeks) heatmap grid
  const heatmapGrid = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayData = heatmap.find(h => h.date === dateStr);
    const count = dayData?.cards_studied || 0;
    let level = 0;
    if (count > 0) level = 1;
    if (count >= 10) level = 2;
    if (count >= 20) level = 3;
    if (count >= 40) level = 4;
    heatmapGrid.push({ date: dateStr, count, level });
  }

  if (!stats) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading stats...</div>
      </div>
    );
  }

  const learnedPct = stats.total_cards > 0
    ? Math.round((stats.words_learned / stats.total_cards) * 100)
    : 0;

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1 className="page-title">Statistics</h1>
        <div className="page-subtitle">Your learning journey</div>
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--yellow)' }}>{stats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats.today_accuracy}%</div>
          <div className="stat-label">Today's Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.words_learned}</div>
          <div className="stat-label">Words Learned</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--pink)' }}>{formatTime(stats.total_time_seconds)}</div>
          <div className="stat-label">Time Studied</div>
        </div>
      </div>

      {/* Progress overview */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
            VOCABULARY MASTERY
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--green)' }}>
            {learnedPct}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: '10px', marginBottom: '12px' }}>
          <div className="progress-fill green" style={{ width: `${learnedPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>{stats.words_learned} learned</span>
          <span>{stats.words_remaining} remaining</span>
        </div>
      </div>

      {/* Daily goal */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
            TODAY'S GOAL
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)' }}>
            {stats.today_cards}/{stats.daily_goal}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${Math.min(100, (stats.today_cards / stats.daily_goal) * 100)}%`
          }} />
        </div>
      </div>

      {/* Weekly heatmap */}
      <div className="card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
          REVIEW ACTIVITY (12 WEEKS)
        </div>
        <div className="heatmap">
          {heatmapGrid.map((cell, i) => (
            <div
              key={i}
              className={`heatmap-cell level-${cell.level}`}
              title={`${cell.date}: ${cell.count} cards`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          <span>Less</span>
          <div style={{ display: 'flex', gap: '3px' }}>
            <div className="heatmap-cell" style={{ width: '12px', height: '12px' }} />
            <div className="heatmap-cell level-1" style={{ width: '12px', height: '12px' }} />
            <div className="heatmap-cell level-2" style={{ width: '12px', height: '12px' }} />
            <div className="heatmap-cell level-3" style={{ width: '12px', height: '12px' }} />
            <div className="heatmap-cell level-4" style={{ width: '12px', height: '12px' }} />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
