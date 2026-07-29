import React from 'react';
import { useAppContext } from '../lib/store';
import { LiveBadge } from '../components/LiveBadge';
import { Trophy, Send, Fish, Users, Sparkles, Anchor, ShieldCheck, ChevronRight, BookOpen, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { participants } = useAppContext();

  const totalCatches = participants.reduce((acc, p) => acc + p.total_fish_count, 0);
  const topScore = [...participants].sort((a, b) => b.total_points - a.total_points)[0]?.total_points || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden flex flex-col justify-between">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-900/30 via-blue-900/15 to-transparent pointer-events-none blur-3xl" />

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
              <Link to="/" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                Beranda
              </Link>
              <Link to="/leaderboard" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent">
                Leaderboard
              </Link>
              <Link to="/rules" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent">
                Rules & Panduan
              </Link>
              <Link to="/submit" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent">
                Lapor Tangkapan
              </Link>
            </nav>

            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

            <LiveBadge />

            <Link to="/admin" className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* HERO COVER SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10 text-center max-w-4xl mx-auto">
        {/* Event status pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Tournament Mancing Resmi
          </div>
          <Link to="/rules" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Wajib Serah Fisik Ikan ke Panitia
          </Link>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase mb-6 leading-none">
          KING OF THE SEA <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
            FISHING CHAMPIONSHIP
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl text-slate-300 text-base sm:text-lg mb-8 leading-relaxed font-medium">
          Selamat datang di turnamen King of the Sea: Fishing Championship! Kumpulkan ikan langka, laporkan hasil tangkapanmu, dan pantau posisi klasemen secara langsung.
        </p>

        {/* CTA BUTTONS SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12">
          {/* CTA Button 1: Lapor Tangkapan */}
          <Link
            to="/submit"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-xl shadow-emerald-500/20 active:translate-y-0"
          >
            <Send className="w-5 h-5 stroke-[2.5]" />
            Lapor Tangkapan
          </Link>

          {/* CTA Button 2: Lihat Ranking Saat Ini */}
          <Link
            to="/leaderboard"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500/60 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-xl shadow-slate-950/50 active:translate-y-0 group"
          >
            <Trophy className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            Lihat Ranking Saat Ini
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-2xl bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
              <Users className="w-4 h-4 text-indigo-400" /> Peserta
            </div>
            <div className="text-2xl sm:text-4xl font-black text-white font-mono">{participants.length}</div>
          </div>
          <div className="flex flex-col items-center border-x border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
              <Fish className="w-4 h-4 text-cyan-400" /> Tangkapan
            </div>
            <div className="text-2xl sm:text-4xl font-black text-cyan-400 font-mono">{totalCatches}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-amber-400" /> Top Poin
            </div>
            <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">{topScore}</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 relative z-10 font-mono">
        King of the Sea: Fishing Championship © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

