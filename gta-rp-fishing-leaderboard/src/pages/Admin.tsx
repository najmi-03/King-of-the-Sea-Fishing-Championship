import React, { useState } from 'react';
import { AdminInputForm } from '../components/AdminInputForm';
import { ReviewSubmissions } from '../components/ReviewSubmissions';
import { ExportPanel } from '../components/ExportPanel';
import { LiveBadge } from '../components/LiveBadge';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, Unlock, Anchor, ShieldCheck } from 'lucide-react';

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'minmin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password salah.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 flex items-center justify-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-900/50 rounded-full flex items-center justify-center mb-4 border border-indigo-500/50">
              <Lock className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Login</h1>
            <p className="text-slate-400 text-sm mt-1">Masukkan password untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-600 text-center text-lg tracking-widest"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 uppercase tracking-wider"
            >
              <Unlock className="w-5 h-5" /> Akses Panel
            </button>
          </form>

          <div className="mt-6 text-center">
             <Link to="/" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
              &larr; Kembali ke Leaderboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-transparent pointer-events-none blur-3xl" />

      {/* Top Navbar */}
      <div className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
              <Anchor className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-black text-lg tracking-wider text-white uppercase">KING OF THE SEA</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link to="/" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent">
                Beranda
              </Link>
              <Link to="/leaderboard" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent">
                Leaderboard
              </Link>
              <Link to="/submit" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent">
                Lapor Tangkapan
              </Link>
            </nav>

            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

            <LiveBadge />

            <div className="px-3.5 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Admin
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <h1 className="text-3xl font-black text-white mb-1 uppercase tracking-tight">Panel Panitia Event</h1>
            <p className="text-slate-400 text-sm">Verifikasi laporan peserta, unduh data laporan, atau catat tangkapan secara manual.</p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-red-950/30 border border-red-900/50 rounded-full text-red-400 text-xs font-bold tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-4 h-4" /> ADMIN AREA
          </div>
        </div>

        <ExportPanel />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ReviewSubmissions />
          <AdminInputForm />
        </div>
      </div>
    </div>
  );
};
