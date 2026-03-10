import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import GrammarTip from '../components/GrammarTip';

export default function LessonDetail({ settings }) {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [studying, setStudying] = useState(false);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [tip, setTip] = useState(null);

  const direction = settings?.direction || 'en_to_es';

  const loadLesson = useCallback(async () => {
    try {
      const data = await api.getLesson(id);
      setLesson(data);
      setCards(data.cards || []);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => { loadLesson(); }, [loadLesson]);

  useEffect(() => {
    if (sessionTotal > 0 && sessionTotal % 10 === 0) {
      api.getRandomTip().then(t => {
        if (t) { setTip(t); setShowTip(true); }
      }).catch(() => {});
    }
  }, [sessionTotal]);

  const currentCard = cards[currentIndex];

  const handleRate = async (rating) => {
    if (!currentCard) return;
    try { await api.rateCard(currentCard.id, rating); } catch (e) { console.error(e); }
    setSessionTotal(prev => prev + 1);

    if (currentIndex < cards.length - 1) {
      setTransitioning(true);
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setTransitioning(false);
      }, 50);
    } else {
      setStudying(false);
      setCurrentIndex(0);
      setFlipped(false);
      loadLesson();
    }
  };

  if (!lesson) {
    return <div className="page" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  const frontText = direction === 'en_to_es' ? currentCard?.english : currentCard?.spanish;
  const backText = direction === 'en_to_es' ? currentCard?.spanish : currentCard?.english;

  if (!studying) {
    return (
      <div className="page animate-in">
        <div className="page-header">
          <Link to="/lessons" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            &#8592; Back to Lessons
          </Link>
          <h1 className="page-title" style={{ marginTop: '8px' }}>Day {lesson.id}: {lesson.name}</h1>
          <div className="page-subtitle">{lesson.description}</div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}>MASTERY</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--green)' }}>
              {Math.round(lesson.mastery_percent)}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill green" style={{ width: `${lesson.mastery_percent}%` }} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '24px' }} onClick={() => setStudying(true)}>
          Study {cards.length} Words
        </button>

        {/* Word list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {cards.map(card => (
            <div key={card.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)'
            }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>{card.spanish}</span>
                <span style={{ color: 'var(--text-dim)', margin: '0 8px' }}>—</span>
                <span style={{ color: 'var(--text-dim)' }}>{card.english}</span>
              </div>
              {card.gender && card.gender !== 'none' && (
                <span className={`flashcard-gender gender-${card.gender}`} style={{ fontSize: '10px' }}>
                  {card.gender === 'masculine' ? 'M' : card.gender === 'feminine' ? 'F' : 'M/F'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Study mode
  return (
    <div className="page animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="page-title" style={{ fontSize: '20px' }}>Day {lesson.id}: {lesson.name}</h1>
          <button className="btn btn-ghost" onClick={() => { setStudying(false); loadLesson(); }}>
            Exit
          </button>
        </div>
      </div>

      <div className="session-progress">
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
        </div>
        <span className="session-counter">{currentIndex + 1}/{cards.length}</span>
      </div>

      {showTip && tip && <GrammarTip tip={tip} onDismiss={() => { if (tip) api.dismissTip(tip.id).catch(() => {}); setShowTip(false); }} />}

      <div className="flashcard-container" onClick={() => !transitioning && setFlipped(!flipped)}
        style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.15s ease' }}>
        <div className={`flashcard ${flipped ? 'flipped' : ''}`}
          style={transitioning ? { transition: 'none' } : undefined}>
          <div className="flashcard-face">
            <div className="flashcard-hint">{direction === 'en_to_es' ? 'ENGLISH' : 'SPANISH'}</div>
            <div className="flashcard-word">{frontText}</div>
            {currentCard?.gender && currentCard.gender !== 'none' && (
              <span className={`flashcard-gender gender-${currentCard.gender}`}>{currentCard.gender}</span>
            )}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px' }}>Tap to flip</div>
          </div>
          <div className="flashcard-face flashcard-back">
            <div className="flashcard-hint">{direction === 'en_to_es' ? 'SPANISH' : 'ENGLISH'}</div>
            <div className="flashcard-word">{backText}</div>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="rating-buttons slide-up">
          <button className="rating-btn again" onClick={() => handleRate(1)}>
            <span className="rating-label">1</span>Again
          </button>
          <button className="rating-btn hard" onClick={() => handleRate(2)}>
            <span className="rating-label">2</span>Hard
          </button>
          <button className="rating-btn good" onClick={() => handleRate(3)}>
            <span className="rating-label">3</span>Good
          </button>
          <button className="rating-btn easy" onClick={() => handleRate(4)}>
            <span className="rating-label">4</span>Easy
          </button>
        </div>
      )}
    </div>
  );
}
