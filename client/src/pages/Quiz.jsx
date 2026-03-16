import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';

const ACCENT_CHARS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

function slugify(word) {
  return (word || '')
    .toLowerCase()
    .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/[¿¡?!,]/g, '').replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function ImageDisplay({ word, emoji }) {
  const [useEmoji, setUseEmoji] = useState(false);
  const slug = slugify(word);

  return useEmoji || !slug ? (
    <div style={{ fontSize: '80px', marginBottom: '8px', lineHeight: 1 }}>
      {emoji || '?'}
    </div>
  ) : (
    <img
      src={`/images/${slug}.jpg`}
      alt=""
      onError={() => setUseEmoji(true)}
      style={{
        width: '200px', height: '200px', objectFit: 'cover',
        borderRadius: '12px', marginBottom: '8px',
        border: '2px solid var(--border)'
      }}
    />
  );
}

const MODES = [
  { key: 'flashcard', label: 'Flip' },
  { key: 'multiple_choice', label: 'Choice' },
  { key: 'type_answer', label: 'Type' },
  { key: 'listening', label: 'Listen' },
  { key: 'image', label: 'Image' },
  { key: 'definition', label: 'Define' },
  { key: 'cloze', label: 'Cloze' },
];

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

  const loadQuestions = (quizMode) => {
    const enrichedModes = ['image', 'definition', 'cloze'];
    const modeParam = enrichedModes.includes(quizMode) ? quizMode : undefined;
    api.getQuizQuestions(null, 10, modeParam).then(setQuestions).catch(() => {});
  };

  useEffect(() => {
    loadQuestions(mode);
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

  // Type answer handler (used by type_answer, image, definition, cloze)
  const handleSubmitTyped = (e) => {
    e.preventDefault();
    if (showResult) return;
    setShowResult(true);

    let correctAnswer;
    if (mode === 'image' || mode === 'definition') {
      correctAnswer = current.question_spanish;
    } else if (mode === 'cloze') {
      correctAnswer = current.cloze_answer || current.question_spanish;
    } else {
      correctAnswer = answerText;
    }

    const isCorrect = typedAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
    advance(isCorrect);
  };

  // Get the correct answer for display in feedback
  const getCorrectAnswer = () => {
    if (mode === 'image' || mode === 'definition') {
      return current.question_spanish;
    } else if (mode === 'cloze') {
      return current.cloze_answer || current.question_spanish;
    }
    return answerText;
  };

  // Check if typed answer is correct
  const isTypedCorrect = () => {
    const correctAnswer = getCorrectAnswer();
    return typedAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
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

  const restart = (newMode) => {
    const m = newMode || mode;
    setQuizDone(false);
    setCurrentIndex(0);
    setCorrect(0);
    setTotal(0);
    setSelected(null);
    setTypedAnswer('');
    setShowResult(false);
    loadQuestions(m);
  };

  const switchMode = (m) => {
    setMode(m);
    restart(m);
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
        <button className="btn btn-primary" onClick={() => restart()}>Try Again</button>
      </div>
    );
  }

  // Determine if current mode uses type-answer input
  const isTypeMode = ['type_answer', 'listening', 'image', 'definition', 'cloze'].includes(mode);

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1 className="page-title">Quiz</h1>
        <div className="page-subtitle">
          {mode === 'flashcard' && 'Flashcard Mode'}
          {mode === 'multiple_choice' && 'Multiple Choice'}
          {mode === 'type_answer' && 'Type the Answer'}
          {mode === 'listening' && 'Listening Mode'}
          {mode === 'image' && 'Image Mode'}
          {mode === 'definition' && 'Spanish Definition'}
          {mode === 'cloze' && 'Sentence Cloze'}
        </div>
      </div>

      {/* Mode selector */}
      <div className="toggle-group" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '4px' }}>
        {MODES.map(m => (
          <button
            key={m.key}
            className={`toggle-option ${mode === m.key ? 'active' : ''}`}
            onClick={() => switchMode(m.key)}
            style={{ fontSize: '10px', padding: '6px 8px' }}
          >
            {m.label}
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

      {/* Question card */}
      <div className="card" style={{ textAlign: 'center', padding: '32px 20px', marginBottom: '20px' }}>
        {mode === 'listening' && (
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
        )}

        {mode === 'image' && (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              ¿QUÉ ES ESTO EN ESPAÑOL?
            </div>
            <ImageDisplay word={current?.question_spanish} emoji={current?.emoji} />
            {current?.gender && current.gender !== 'none' && (
              <span className={`flashcard-gender gender-${current.gender}`} style={{ marginTop: '8px', display: 'inline-block' }}>
                {current.gender}
              </span>
            )}
          </>
        )}

        {mode === 'definition' && (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              ¿QUÉ PALABRA ES?
            </div>
            <div style={{ fontSize: '18px', lineHeight: '1.5', fontStyle: 'italic', color: 'var(--text)' }}>
              {current?.definition_es || 'Sin definición'}
            </div>
            {current?.gender && current.gender !== 'none' && (
              <span className={`flashcard-gender gender-${current.gender}`} style={{ marginTop: '12px', display: 'inline-block' }}>
                {current.gender}
              </span>
            )}
          </>
        )}

        {mode === 'cloze' && (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              COMPLETA LA FRASE
            </div>
            <div style={{ fontSize: '22px', lineHeight: '1.5' }}>
              {current?.cloze_es?.replace('___', '______') || 'Sin frase'}
            </div>
          </>
        )}

        {!['listening', 'image', 'definition', 'cloze'].includes(mode) && (
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

      {/* Type answer input (shared by type_answer, listening, image, definition, cloze) */}
      {isTypeMode && (
        <form onSubmit={handleSubmitTyped}>
          <input
            ref={inputRef}
            className="input"
            type="text"
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder={
              mode === 'listening' ? 'Type what you hear...' :
              mode === 'image' ? 'Escribe la palabra...' :
              mode === 'definition' ? 'Escribe la palabra...' :
              mode === 'cloze' ? 'Escribe la palabra que falta...' :
              `Type the ${direction === 'en_to_es' ? 'Spanish' : 'English'}...`
            }
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
              background: isTypedCorrect() ? 'var(--green-dim)' : 'var(--red-dim)',
              border: `1px solid ${isTypedCorrect() ? 'var(--green)' : 'var(--red)'}`,
              textAlign: 'center'
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '4px', color: 'var(--text-muted)' }}>
                {isTypedCorrect() ? 'CORRECT!' : 'ANSWER:'}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{getCorrectAnswer()}</div>
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
