import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './lib/store';
import { HomePage } from './pages/Home';
import { LeaderboardPage } from './pages/Leaderboard';
import { AdminPage } from './pages/Admin';
import { SubmitPage } from './pages/Submit';
import { RulesPage } from './pages/Rules';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}


