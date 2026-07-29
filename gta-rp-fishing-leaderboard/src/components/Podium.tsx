import React from 'react';
import { motion } from 'motion/react';
import { Participant } from '../types';
import { Trophy, Medal } from 'lucide-react';
import { cn } from '../lib/utils';

interface PodiumProps {
  topParticipants: Participant[];
}

export const Podium: React.FC<PodiumProps> = ({ topParticipants }) => {
  if (topParticipants.length === 0) return null;

  // Ensure we have exactly 3 slots, pad with null if necessary
  const podium = [
    topParticipants[1] || null, // 2nd Place
    topParticipants[0] || null, // 1st Place
    topParticipants[2] || null, // 3rd Place
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-10 min-h-[260px]">
      {podium.map((p, index) => {
        // index 0 is 2nd, index 1 is 1st, index 2 is 3rd
        const position = index === 0 ? 2 : index === 1 ? 1 : 3;

        if (!p) {
          return <div key={position} className="hidden sm:block"></div>;
        }

        const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

        return (
          <motion.div
            key={position}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5, type: 'spring' }}
            className={cn("flex flex-col", position !== 1 && "justify-end")}
          >
            {position === 1 ? (
              <div className="bg-indigo-600/10 border-2 border-indigo-500/50 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden h-full backdrop-blur-md shadow-2xl shadow-indigo-500/20">
                <div className="absolute -top-4 -right-4 opacity-10 font-black text-[12rem] italic leading-none text-indigo-400">1</div>
                <div className="w-24 h-24 rounded-full bg-indigo-500 mb-4 border-4 border-indigo-400 flex items-center justify-center text-white text-3xl font-black shadow-[0_0_40px_rgba(99,102,241,0.5)] z-10">
                  {getInitials(p.character_name)}
                </div>
                <h3 className="font-black text-2xl text-white mb-1 tracking-tight z-10">{p.character_name}</h3>
                <p className="text-indigo-300 font-mono text-xl font-black tracking-widest z-10">{p.total_points} PTS</p>
                <div className="mt-5 px-4 py-1.5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40 text-[10px] text-white font-black uppercase tracking-[0.2em] z-10">
                  {p.highest_rarity || 'Fisher'}
                </div>
              </div>
            ) : position === 2 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden h-[85%] backdrop-blur-sm shadow-xl">
                <div className="absolute -top-4 -right-4 opacity-5 font-black text-9xl italic leading-none text-white">2</div>
                <div className="w-16 h-16 rounded-full bg-slate-400/20 mb-3 border-2 border-slate-400 flex items-center justify-center text-slate-200 text-xl font-bold shadow-[0_0_20px_rgba(148,163,184,0.3)] z-10">
                  {getInitials(p.character_name)}
                </div>
                <h3 className="font-bold text-lg mb-1 z-10">{p.character_name}</h3>
                <p className="text-indigo-400 font-mono text-sm font-bold tracking-tight z-10">{p.total_points} PTS</p>
                <div className="mt-3 px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-widest z-10">
                  {p.highest_rarity || 'Fisher'}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden h-[75%] backdrop-blur-sm shadow-xl mt-4 sm:mt-0">
                <div className="absolute -top-4 -right-4 opacity-5 font-black text-9xl italic leading-none text-white">3</div>
                <div className="w-16 h-16 rounded-full bg-amber-700/20 mb-3 border-2 border-amber-600/50 flex items-center justify-center text-amber-500 text-xl font-bold shadow-[0_0_20px_rgba(217,119,6,0.3)] z-10">
                  {getInitials(p.character_name)}
                </div>
                <h3 className="font-bold text-lg mb-1 z-10">{p.character_name}</h3>
                <p className="text-indigo-400 font-mono text-sm font-bold tracking-tight z-10">{p.total_points} PTS</p>
                <div className="mt-3 px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-widest z-10">
                  {p.highest_rarity || 'Fisher'}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
