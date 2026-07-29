import React from 'react';
import { SubmitForm } from '../components/SubmitForm';
import { LiveBadge } from '../components/LiveBadge';
import { Anchor, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SubmitPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-900/20 via-blue-900/10 to-transparent pointer-events-none blur-3xl" />

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
              <Link to="/submit" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <SubmitForm />
      </main>
    </div>
  );
};
