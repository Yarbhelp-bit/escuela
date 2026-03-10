import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';

const ACCENT_CHARS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

export default function Quiz({ settings }) {
  const [mode, setMode] = useState(settings?.quiz_mode || 'flashcard');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [sessionStart] = useState(Date.now());
  const inputRef = useRef(null);
  const direction = settings?.direction || 'en_to_es';

  useEffect(() => {
    api.getQuizQuestions(null, 10).then(setQuestions).catch(() => {});
  }, []);

  const current = questions[currentIndex];

  const questionText = direction === 'en_to_es' ? current?.question_english : current?.question_spanish;
  const answerText = direction === 'en_to_es' ? current?.question_spanish : current?.question_english;

  const advance = (wasCorrect) => {
    const newTotal = total + 1;
    const newCorrect = correct + (wasCorrect ? 1 : 0);
    setTotal(newTotal);
    if (wasCorrect) setCorrect(newCorrect);

    // Rate the card in SM-2
    api.rateCard(current.card_id, wasCorrect ? 3 : 1).catch(() => {});

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setTypedAnswer('');
        setShowResult(false);
      } else {
        setQuizDone(true);
        const timeSpent = Math.round((Date.now() - sessionStart) / 1000);
        api.recordSession({
          cards_studied: newTotal,
          correct: newCorrect,
          incorrect: newTotal - newCorrect,
          mode,
          time_spent: timeSpent,
        }).catch(() => {});
      }
    }, 1200);
  };

  // Multiple choice handler
  const handleOptionClick = (option, index) => {
    if (selected !== null) return;
    setSelected(index);
    setShowResult(true);
    advance(option.correct);
  };

  // Type answer handler
  const handleSubmitTyped = (e) => {
    e.preventDefault();
    if (showResult) return;
    setShowResult(true);
    const isCorrect = typedAnswer.trim().toLowerCase() === answerText.toLowerCase();
    advance(isCorrect);
  };

  // Listening mode — speak the word
  const speakWord = () => {
    if (!current) return;
    const utterance = new SpeechSynthesisUtterance(current.question_spanish);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  // Auto-speak in listening mode
  useEffect(() => {
    if (mode === 'listening' && current && !showResult) {
      const timer = setTimeout(speakWord, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mode, current, showResult]);

  const insertAccent = (char) => {
    setTypedAnswer(prev => prev + char);
    inputRef.current?.focus();
  };

  const restart = () => {
    setQuizDone(false);
    setCurrentIndex(0);
    setCorrect(0);
    setTotal(0);
    setSelected(null);
    setTypedAnswer('');
    setShowResult(false);
    api.getQuizQuestions(null, 10).then(setQuestions).catch(() => {});
  };

  if (questions.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Quiz</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">&#10070;</div>
          <div className="empty-state-text">No quiz questions available</div>
          <div className="empty-state-sub">Study some flashcards first!</div>
        </div>
      </div>
    );
  }

  if (quizDone) {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="page animate-in" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {pct >= 80 ? '&#127881;' : pct >= 50 ? '&#128170;' : '&#128218;'}
        </div>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Quiz Complete!</h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-dim)', marginBottom: '24px' }}>
          {correct}/{total} correct — {pct}%
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--green)' }}>{correct}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--pink)' }}>{total - correct}</div>
            <div className="stat-label">Incorrect</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={restart}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1 className="page-title">Quiz</h1>
        <div className="page-subtitle">
          {mode === 'flashcard' && 'Flashcard Mode'}
          {mode === 'multiple_choice' && 'Multiple Choice'}
          {mode === 'type_answer' && 'Type the Answer'}
          {mode === 'listening' && 'Listening Mode'}
        </div>
      </div>

      {/* Mode selector */}
      <div className="toggle-group" style={{ marginBottom: '20px' }}>
        {['flashcard', 'multiple_choice', 'type_answer', 'listening'].map(m => (
          <button
            key={m}
            className={`toggle-option ${mode === m ? 'active' : ''}`}
            onClick={() => { setMode(m); restart(); }}
            style={{ fontSize: '10px', padding: '6px 8px' }}
          >
            {m === 'flashcard' ? 'Flip' : m === 'multiple_choice' ? 'Choice' : m === 'type_answer' ? 'Type' : 'Listen'}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="session-progress">
        <div className="progress-bar" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="session-counter">{currentIndex + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="card" style={{ textAlign: 'center', padding: '32px 20px', marginBottom: '20px' }}>
        {mode === 'listening' ? (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              LISTEN & TYPE WHAT YOU HEAR
            </div>
            <button
              onClick={speakWord}
              style={{
                fontSize: '48px', padding: '16px', background: 'var(--accent-dim)',
                borderRadius: '50%', width: '80px', height: '80px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto', border: '2px solid var(--accent)'
              }}
            >
              &#128266;
            </button>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {direction === 'en_to_es' ? 'TRANSLATE TO SPANISH' : 'TRANSLATE TO ENGLISH'}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{questionText}</div>
            {current?.gender && current.gender !== 'none' && (
              <span className={`flashcard-gender gender-${current.gender}`} style={{ marginTop: '8px', display: 'inline-block' }}>
                {current.gender}
              </span>
            )}
          </>
        )}
      </div>

      {/* Multiple choice options */}
      {mode === 'multiple_choice' && (
        <div>
          {current?.options?.map((option, i) => {
            const optionLabel = direction === 'en_to_es' ? option.spanish : option.english;
            let className = 'quiz-option';
            if (showResult && selected === i) {
              className += option.correct ? ' correct' : ' incorrect';
            }
            if (showResult && option.correct && selected !== i) {
              className += ' correct';
            }
            return (
              <button key={i} className={className} onClick={() => handleOptionClick(option, i)}>
                {optionLabel}
              </button>
            );
          })}
        </div>
      )}

      {/* Type answer */}
      {(mode === 'type_answer' || mode === 'listening') && (
        <form onSubmit={handleSubmitTyped}>
          <input
            ref={inputRef}
            className="input"
            type="text"
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder={mode === 'listening' ? 'Type what you hear...' : `Type the ${direction === 'en_to_es' ? 'Spanish' : 'English'}...`}
            disabled={showResult}
            autoFocus
          />
          <div className="accent-keyboard">
            {ACCENT_CHARS.map(char => (
              <button
                key={char}
                type="button"
                className="accent-key"
                onClick={() => insertAccent(char)}
              >
                {char}
              </button>
            ))}
          </div>
          {!showResult && (
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              Check
            </button>
          )}
          {showResult && (
            <div style={{
              marginTop: '12px', padding: '16px', borderRadius: 'var(--radius-sm)',
              background: typedAnswer.trim().toLowerCase() === answerText.toLowerCase()
                ? 'var(--green-dim)' : 'var(--red-dim)',
              border: `1px solid ${typedAnswer.trim().toLowerCase() === answerText.toLowerCase() ? 'var(--green)' : 'var(--red)'}`,
              textAlign: 'center'
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '4px', color: 'var(--text-muted)' }}>
                {typedAnswer.trim().toLowerCase() === answerText.toLowerCase() ? 'CORRECT!' : 'ANSWER:'}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{answerText}</div>
            </div>
          )}
        </form>
      )}

      {/* Flashcard mode in quiz — simple flip */}
      {mode === 'flashcard' && (
        <div style={{ textAlign: 'center' }}>
          {!showResult ? (
            <button className="btn btn-primary" onClick={() => setShowResult(true)}>
              Reveal Answer
            </button>
          ) : (
            <div className="slide-up">
              <div style={{
                fontSize: '24px', fontWeight: 'bold', marginBottom: '20px',
                color: 'var(--green)'
              }}>
                {answerText}
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button className="btn" style={{ border: '1px solid var(--red)', color: 'var(--red)' }} onClick={() => { setShowResult(false); advance(false); }}>
                  Got it wrong
                </button>
                <button className="btn" style={{ border: '1px solid var(--green)', color: 'var(--green)' }} onClick={() => { setShowResult(false); advance(true); }}>
                  Got it right
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
