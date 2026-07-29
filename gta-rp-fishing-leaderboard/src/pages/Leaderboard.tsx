import React from 'react';
import { useAppContext } from '../lib/store';
import { Podium } from '../components/Podium';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { LiveBadge } from '../components/LiveBadge';
import { Trophy, Send, ChevronDown, Fish, Users, Sparkles, Anchor, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LeaderboardPage = () => {
  const { participants } = useAppContext();

  // Sort participants
  const sortedParticipants = [...participants].sort((a, b) => {
    if (b.total_points !== a.total_points) return b.total_points - a.total_points;
    if (b.legendary_count !== a.legendary_count) return b.legendary_count - a.legendary_count;
    if (b.rare_count !== a.rare_count) return b.rare_count - a.rare_count;
    return b.total_fish_count - a.total_fish_count;
  });

  const topParticipants = sortedParticipants.slice(0, 3);
  const totalCatches = participants.reduce((acc, p) => acc + p.total_fish_count, 0);
  const topScore = topParticipants[0]?.total_points || 0;

  const scrollToLeaderboard = () => {
    const el = document.getElementById('leaderboard-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-indigo-900/20 via-blue-900/10 to-transparent pointer-events-none blur-3xl" />

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
              <Link to="/leaderboard" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-8">
        {/* Compact Header & CTA Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Tournament Mancing Resmi
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              KING OF THE SEA <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">FISHING CHAMPIONSHIP</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Tangkap ikan langka, kumpulkan poin sebanyak-banyaknya, dan raih posisi puncak di klasemen turnamen!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:translate-y-0"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              Lapor Tangkapan
            </Link>

            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5">
              <div className="text-center px-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Peserta</div>
                <div className="text-base font-black text-white font-mono">{participants.length}</div>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div className="text-center px-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Tangkapan</div>
                <div className="text-base font-black text-cyan-400 font-mono">{totalCatches}</div>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div className="text-center px-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Top Poin</div>
                <div className="text-base font-black text-amber-400 font-mono">{topScore}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Podium & Leaderboard */}
        <main className="space-y-6">
          <Podium topParticipants={topParticipants} />
          <LeaderboardTable participants={sortedParticipants} />
        </main>
      </div>
    </div>
  );
};
