import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
    api.getProgressSummary().then(setSummary).catch(() => {});
  }, []);

  const goalProgress = stats
    ? Math.min(100, Math.round((stats.today_cards / stats.daily_goal) * 100))
    : 0;

  return (
    <div className="page animate-in">
      <div className="page-header" style={{ textAlign: 'center', padding: '40px 0 24px' }}>
        <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Welcome to
        </div>
        <h1 style={{ fontSize: '42px', fontFamily: 'var(--font-display)', letterSpacing: '-1px' }}>
          Escuela
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px' }}>
          Your Spanish learning companion
        </div>
      </div>

      {/* Streak & daily goal */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--yellow)' }}>
              {stats.streak}
            </div>
            <div className="stat-label">Day streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--green)' }}>
              {stats.today_cards}/{stats.daily_goal}
            </div>
            <div className="stat-label">Today's goal</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {stats && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>
              DAILY PROGRESS
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)' }}>
              {goalProgress}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill green" style={{ width: `${goalProgress}%` }} />
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <Link to="/flashcards" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ fontSize: '28px' }}>&#9878;</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Study Flashcards</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                {summary ? `${summary.due_today} cards due for review` : 'Loading...'}
              </div>
            </div>
          </div>
        </Link>

        <Link to="/quiz" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ fontSize: '28px' }}>&#10070;</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Take a Quiz</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                Test your knowledge
              </div>
            </div>
          </div>
        </Link>

        <Link to="/lessons" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ fontSize: '28px' }}>&#9733;</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Lesson Tracks</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                {summary ? `${summary.learned}/${summary.total_cards} words learned` : 'Loading...'}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Word count */}
      {summary && (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>
            VOCABULARY PROGRESS
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
                {summary.learned}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LEARNED</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {summary.remaining}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REMAINING</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
