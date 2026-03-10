import { useState } from 'react';
import { api } from '../utils/api';

export default function Settings({ settings, setSettings }) {
  const [notifGranted, setNotifGranted] = useState(Notification?.permission === 'granted');

  const updateSetting = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    try {
      await api.updateSetting(key, value);
    } catch (err) {
      console.error('Failed to update setting:', err);
    }
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifGranted(perm === 'granted');
    if (perm === 'granted') {
      new Notification('Escuela', { body: 'Notifications enabled! Time to study Spanish.' });
    }
  };

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <div className="page-subtitle">Customize your experience</div>
      </div>

      {/* Card direction */}
      <div className="setting-row">
        <div>
          <div className="setting-label">Card Direction</div>
          <div className="setting-sublabel">Which side shows first</div>
        </div>
        <div className="toggle-group">
          <button
            className={`toggle-option ${settings.direction === 'en_to_es' ? 'active' : ''}`}
            onClick={() => updateSetting('direction', 'en_to_es')}
          >
            EN→ES
          </button>
          <button
            className={`toggle-option ${settings.direction === 'es_to_en' ? 'active' : ''}`}
            onClick={() => updateSetting('direction', 'es_to_en')}
          >
            ES→EN
          </button>
        </div>
      </div>

      {/* Quiz mode */}
      <div className="setting-row">
        <div>
          <div className="setting-label">Default Quiz Mode</div>
          <div className="setting-sublabel">Starting mode when opening quiz</div>
        </div>
        <div className="toggle-group" style={{ flexWrap: 'wrap' }}>
          {[
            { key: 'flashcard', label: 'Flip' },
            { key: 'multiple_choice', label: 'Choice' },
            { key: 'type_answer', label: 'Type' },
            { key: 'listening', label: 'Listen' },
          ].map(m => (
            <button
              key={m.key}
              className={`toggle-option ${settings.quiz_mode === m.key ? 'active' : ''}`}
              onClick={() => updateSetting('quiz_mode', m.key)}
              style={{ fontSize: '11px', padding: '6px 10px' }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily goal */}
      <div className="setting-row">
        <div>
          <div className="setting-label">Daily Goal</div>
          <div className="setting-sublabel">Cards per day</div>
        </div>
        <div className="toggle-group">
          {['10', '20', '50'].map(g => (
            <button
              key={g}
              className={`toggle-option ${settings.daily_goal === g ? 'active' : ''}`}
              onClick={() => updateSetting('daily_goal', g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Reminder time */}
      <div className="setting-row">
        <div>
          <div className="setting-label">Reminder Time</div>
          <div className="setting-sublabel">Daily study notification</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="time"
            value={settings.reminder_time || '09:00'}
            onChange={(e) => updateSetting('reminder_time', e.target.value)}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              color: 'var(--text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="setting-row" style={{ borderBottom: 'none' }}>
        <div>
          <div className="setting-label">Browser Notifications</div>
          <div className="setting-sublabel">
            {notifGranted ? 'Enabled' : 'Click to enable'}
          </div>
        </div>
        <button
          className={`btn ${notifGranted ? 'btn-outline' : 'btn-primary'}`}
          onClick={requestNotifications}
          style={{ fontSize: '12px', padding: '8px 16px' }}
          disabled={notifGranted}
        >
          {notifGranted ? 'Enabled' : 'Enable'}
        </button>
      </div>

      {/* App info */}
      <div style={{
        marginTop: '32px', padding: '20px', textAlign: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)'
      }}>
        <div style={{ fontSize: '18px', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'var(--text-dim)' }}>
          Escuela v1.0
        </div>
        <div>200 vocabulary cards across 10 lessons</div>
        <div>Spaced repetition powered by SM-2</div>
      </div>
    </div>
  );
}
