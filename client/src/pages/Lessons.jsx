import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function Lessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    api.getLessons().then(setLessons).catch(() => {});
  }, []);

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1 className="page-title">Lessons</h1>
        <div className="page-subtitle">Beginner track — 10 lessons, 20 words each</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={lesson.unlocked ? `/lessons/${lesson.id}` : '#'}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className={`lesson-card ${!lesson.unlocked ? 'locked' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="lesson-number">
                  {lesson.unlocked ? `Day ${lesson.id}` : 'Locked'}
                </span>
                {!lesson.unlocked && (
                  <span style={{ fontSize: '16px', opacity: 0.5 }}>&#128274;</span>
                )}
                {lesson.unlocked && lesson.mastery_percent >= 80 && (
                  <span className="badge badge-green">Complete</span>
                )}
              </div>
              <div className="lesson-title">{lesson.name}</div>
              <div className="lesson-desc">{lesson.description}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div
                    className={`progress-fill ${lesson.mastery_percent >= 80 ? 'green' : ''}`}
                    style={{ width: `${lesson.mastery_percent}%` }}
                  />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', minWidth: '36px', textAlign: 'right' }}>
                  {Math.round(lesson.mastery_percent)}%
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                {lesson.card_count} words
                {lesson.mastery_percent < 80 && lesson.unlocked && ' — 80% to unlock next'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
