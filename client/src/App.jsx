import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Flashcards from './pages/Flashcards';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Quiz from './pages/Quiz';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import { api } from './utils/api';

export default function App() {
  const [settings, setSettings] = useState({
    direction: 'en_to_es',
    quiz_mode: 'flashcard',
    daily_goal: '20',
    reminder_time: '09:00',
  });

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flashcards" element={<Flashcards settings={settings} setSettings={setSettings} />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonDetail settings={settings} />} />
          <Route path="/quiz" element={<Quiz settings={settings} />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
        </Routes>
      </div>
      <nav className="nav-bar">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <span className="nav-icon">&#9751;</span>
          Home
        </NavLink>
        <NavLink to="/flashcards" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">&#9878;</span>
          Cards
        </NavLink>
        <NavLink to="/lessons" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">&#9733;</span>
          Lessons
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">&#10070;</span>
          Quiz
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">&#9632;</span>
          Stats
        </NavLink>
      </nav>
    </BrowserRouter>
  );
}
