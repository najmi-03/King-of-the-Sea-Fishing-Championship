import React from 'react';

export const LiveBadge = () => {
  return (
    <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.2)]">
      <div className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
      </div>
      <span className="text-red-500 text-xs font-bold tracking-widest">LIVE</span>
    </div>
  );
};
