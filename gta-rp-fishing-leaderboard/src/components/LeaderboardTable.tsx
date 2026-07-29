import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant } from '../types';
import { Search, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../lib/store';

interface LeaderboardTableProps {
  participants: Participant[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ participants }) => {
  const { logs } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'catches'>('points');
  const [expandedCid, setExpandedCid] = useState<string | null>(null);

  // Sort logic (Tie-breakers included)
  const sortedParticipants = [...participants].sort((a, b) => {
    if (sortBy === 'points') {
      if (b.total_points !== a.total_points) return b.total_points - a.total_points;
      if (b.legendary_count !== a.legendary_count) return b.legendary_count - a.legendary_count;
      if (b.rare_count !== a.rare_count) return b.rare_count - a.rare_count;
      return b.total_fish_count - a.total_fish_count;
    } else {
      if (b.total_fish_count !== a.total_fish_count) return b.total_fish_count - a.total_fish_count;
      return b.total_points - a.total_points;
    }
  });

  const filteredParticipants = sortedParticipants.filter(
    (p) =>
      p.character_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl overflow-hidden flex flex-col backdrop-blur-sm shadow-2xl">
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700/50 rounded-lg leading-5 bg-slate-950/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="Cari Nama Karakter atau CID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSortBy('points')}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors border uppercase tracking-wider",
              sortBy === 'points' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-indigo-500" : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-slate-200"
            )}
          >
            <ArrowUpDown className="w-4 h-4" /> Poin
          </button>
          <button
            onClick={() => setSortBy('catches')}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors border uppercase tracking-wider",
              sortBy === 'catches' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-indigo-500" : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-slate-200"
            )}
          >
            <ArrowUpDown className="w-4 h-4" /> Tangkapan
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800/50">
          <thead className="bg-slate-900/50 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Rank</th>
              <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">CID</th>
              <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Contender</th>
              <th scope="col" className="px-6 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Catches</th>
              <th scope="col" className="px-6 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Status</th>
              <th scope="col" className="px-6 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Points</th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-slate-800/40 relative">
            <AnimatePresence>
              {filteredParticipants.map((p, index) => {
                const rank = sortedParticipants.findIndex(sp => sp.cid === p.cid) + 1;
                const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
                return (
                  <React.Fragment key={p.cid}>
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setExpandedCid(expandedCid === p.cid ? null : p.cid)}
                      className={cn(
                        "hover:bg-indigo-500/5 transition-all group cursor-pointer",
                        rank <= 3 ? "bg-indigo-500/10 border-y border-indigo-500/20 shadow-inner" : "bg-slate-800/5"
                      )}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <span className={cn(
                          "font-mono font-bold text-sm",
                          rank <= 3 ? "text-indigo-400 font-black" : "text-slate-500"
                        )}>
                          {rank.toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                        {p.cid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border",
                            rank === 1 ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : 
                            rank === 2 ? "bg-slate-400/20 text-slate-300 border-slate-400/30" : 
                            rank === 3 ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : 
                            "bg-slate-800/50 text-slate-400 border-slate-700/50"
                          )}>
                            {getInitials(p.character_name)}
                          </div>
                          <span className="font-bold text-slate-200 tracking-tight">{p.character_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-300 font-mono">
                        {p.total_fish_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={cn(
                          "px-3 py-1 inline-flex text-[10px] font-bold rounded-full uppercase tracking-widest",
                          p.highest_rarity === 'Legendary' ? "bg-purple-500/20 text-purple-400" :
                          p.highest_rarity === 'Rare' ? "bg-indigo-500/20 text-indigo-400" :
                          p.highest_rarity === 'Uncommon' ? "bg-emerald-500/20 text-emerald-400" :
                          "bg-slate-800 text-slate-400"
                        )}>
                          {p.highest_rarity || 'Fisher'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-indigo-400 font-bold tracking-wider flex justify-end items-center gap-4">
                        {p.total_points.toLocaleString()}
                        {expandedCid === p.cid ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </td>
                    </motion.tr>
                    {expandedCid === p.cid && (
                      <tr className="bg-slate-900/40">
                        <td colSpan={6} className="px-6 py-4 border-b border-slate-800/50">
                          <div className="text-sm">
                            <h4 className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-[10px]">Detail Tangkapan</h4>
                            <div className="flex flex-wrap gap-4">
                              {(() => {
                                const userLogs = logs.filter(l => l.cid === p.cid);
                                // Group by category
                                const grouped = userLogs.reduce((acc, log) => {
                                  if (!acc[log.fish_category]) {
                                    acc[log.fish_category] = [];
                                  }
                                  acc[log.fish_category].push(log);
                                  return acc;
                                }, {} as Record<string, typeof userLogs>);
                                
                                return Object.entries(grouped).map(([category, items]) => {
                                  // Aggregate by name
                                  const nameCounts = items.reduce((acc, item) => {
                                    const name = item.fish_name || `${category} Fish`;
                                    acc[name] = (acc[name] || 0) + (item.quantity || 1);
                                    return acc;
                                  }, {} as Record<string, number>);

                                  return (
                                    <div key={category} className="bg-slate-950/50 border border-slate-800 p-3 rounded-lg flex-1 min-w-[200px]">
                                      <div className={cn(
                                        "text-xs font-bold mb-2 uppercase tracking-wider",
                                        category === 'Legendary' ? "text-purple-400" :
                                        category === 'Rare' ? "text-indigo-400" :
                                        category === 'Uncommon' ? "text-emerald-400" :
                                        "text-slate-400"
                                      )}>{category}</div>
                                      <ul className="space-y-1">
                                        {Object.entries(nameCounts).map(([name, count]) => (
                                          <li key={name} className="flex justify-between items-center text-slate-300 text-xs">
                                            <span>{name}</span>
                                            <span className="font-mono text-slate-500 font-bold">{count}x</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  );
                                });
                              })()}
                              {logs.filter(l => l.cid === p.cid).length === 0 && (
                                <div className="text-slate-500 text-xs italic">Belum ada detail tangkapan tersimpan.</div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
            {filteredParticipants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  Tidak ada data peserta yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};
