import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import GrammarTip from '../components/GrammarTip';

export default function Flashcards({ settings }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [tip, setTip] = useState(null);
  const [sessionStart] = useState(Date.now());

  const direction = settings?.direction || 'en_to_es';

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const limit = Number(settings?.daily_goal) || 20;
      let data = await api.getDueCards(limit);
      // If no due cards, get all cards for practice
      if (data.length === 0) {
        data = await api.getCards();
        data = data.sort(() => Math.random() - 0.5).slice(0, limit);
      }
      setCards(data);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (err) {
      console.error('Failed to load cards:', err);
    }
    setLoading(false);
  }, [settings?.daily_goal]);

  useEffect(() => { loadCards(); }, [loadCards]);

  // Check if grammar tip is due (every 10 cards)
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

    try {
      await api.rateCard(currentCard.id, rating);
    } catch (err) {
      console.error('Failed to rate card:', err);
    }

    setSessionTotal(prev => prev + 1);
    if (rating >= 3) setSessionCorrect(prev => prev + 1);

    // Move to next card — hide first to avoid showing answer during unflip
    if (currentIndex < cards.length - 1) {
      setTransitioning(true);
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setTransitioning(false);
      }, 50);
    } else {
      // Session complete — record it
      const timeSpent = Math.round((Date.now() - sessionStart) / 1000);
      api.recordSession({
        cards_studied: sessionTotal + 1,
        correct: sessionCorrect + (rating >= 3 ? 1 : 0),
        incorrect: (sessionTotal + 1) - (sessionCorrect + (rating >= 3 ? 1 : 0)),
        mode: 'flashcard',
        time_spent: timeSpent,
      }).catch(() => {});
      // Reload
      loadCards();
      setSessionCorrect(0);
      setSessionTotal(0);
    }
  };

  const dismissTip = () => {
    if (tip) api.dismissTip(tip.id).catch(() => {});
    setShowTip(false);
  };

  const frontText = direction === 'en_to_es' ? currentCard?.english : currentCard?.spanish;
  const backText = direction === 'en_to_es' ? currentCard?.spanish : currentCard?.english;
  const frontLabel = direction === 'en_to_es' ? 'ENGLISH' : 'SPANISH';
  const backLabel = direction === 'en_to_es' ? 'SPANISH' : 'ENGLISH';

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          Loading cards...
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">&#9878;</div>
          <div className="empty-state-text">No cards to review!</div>
          <div className="empty-state-sub">All caught up. Check back later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1 className="page-title">Flashcards</h1>
        <div className="page-subtitle">
          {direction === 'en_to_es' ? 'English → Spanish' : 'Spanish → English'}
        </div>
      </div>

      {/* Session progress */}
      <div className="session-progress">
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
        </div>
        <span className="session-counter">{currentIndex + 1}/{cards.length}</span>
      </div>

      {/* Grammar tip overlay */}
      {showTip && tip && <GrammarTip tip={tip} onDismiss={dismissTip} />}

      {/* Flashcard */}
      <div className="flashcard-container" onClick={() => !transitioning && setFlipped(!flipped)}
        style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.15s ease' }}>
        <div className={`flashcard ${flipped ? 'flipped' : ''}`}
          style={transitioning ? { transition: 'none' } : undefined}>
          <div className="flashcard-face">
            <div className="flashcard-hint">{frontLabel}</div>
            <div className="flashcard-word">{frontText}</div>
            {currentCard?.gender && currentCard.gender !== 'none' && (
              <span className={`flashcard-gender gender-${currentCard.gender}`}>
                {currentCard.gender}
              </span>
            )}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px' }}>
              Tap to flip
            </div>
          </div>
          <div className="flashcard-face flashcard-back">
            <div className="flashcard-hint">{backLabel}</div>
            <div className="flashcard-word">{backText}</div>
            {currentCard?.gender && currentCard.gender !== 'none' && (
              <span className={`flashcard-gender gender-${currentCard.gender}`}>
                {currentCard.gender}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rating buttons — only show when flipped */}
      {flipped && (
        <div className="rating-buttons slide-up">
          <button className="rating-btn again" onClick={() => handleRate(1)}>
            <span className="rating-label">1</span>
            Again
            <span className="rating-interval">&lt;1m</span>
          </button>
          <button className="rating-btn hard" onClick={() => handleRate(2)}>
            <span className="rating-label">2</span>
            Hard
            <span className="rating-interval">1d</span>
          </button>
          <button className="rating-btn good" onClick={() => handleRate(3)}>
            <span className="rating-label">3</span>
            Good
            <span className="rating-interval">3d</span>
          </button>
          <button className="rating-btn easy" onClick={() => handleRate(4)}>
            <span className="rating-label">4</span>
            Easy
            <span className="rating-interval">7d</span>
          </button>
        </div>
      )}

      {/* Session stats */}
      {sessionTotal > 0 && (
        <div style={{ textAlign: 'center', marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
          Session: {sessionCorrect}/{sessionTotal} correct ({sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0}%)
        </div>
      )}
    </div>
  );
}
