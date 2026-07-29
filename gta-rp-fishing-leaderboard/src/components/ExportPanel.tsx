import React, { useState, useRef } from 'react';
import { useAppContext } from '../lib/store';
import { FileSpreadsheet, Image as ImageIcon, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { cn } from '../lib/utils';

export const ExportPanel = () => {
  const { participants, logs } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Sort logic (Tie-breakers included)
  const sortedParticipants = [...participants].sort((a, b) => {
    if (b.total_points !== a.total_points) return b.total_points - a.total_points;
    if (b.legendary_count !== a.legendary_count) return b.legendary_count - a.legendary_count;
    if (b.rare_count !== a.rare_count) return b.rare_count - a.rare_count;
    return b.total_fish_count - a.total_fish_count;
  });

  const getDetailString = (cid: string) => {
    const userLogs = logs.filter(l => l.cid === cid);
    const counts = userLogs.reduce((acc, log) => {
      const name = log.fish_name || `${log.fish_category} Fish`;
      const key = `${name} (${log.fish_category})`;
      acc[key] = (acc[key] || 0) + (log.quantity || 1);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, count]) => `${count}x ${name}`)
      .join(' | ');
  };

  const exportToCSV = () => {
    const headers = ['Rank', 'CID', 'Nama Karakter', 'Total Tangkapan', 'Rarity Tertinggi', 'Total Poin', 'Detail Tangkapan'];
    const rows = sortedParticipants.map((p, index) => [
      index + 1,
      p.cid,
      `"${p.character_name}"`,
      p.total_fish_count,
      p.highest_rarity || 'Tidak Ada',
      p.total_points,
      `"${getDetailString(p.cid)}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leaderboard_mancing_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToImage = async () => {
    if (!tableRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Replace any elements with oklch computed styles or unsupported features
          const el = clonedDoc.querySelector('[ref-export-table]') as HTMLElement;
          if (el) {
            el.style.fontFamily = 'sans-serif';
          }
        }
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `leaderboard_mancing_${new Date().toISOString().split('T')[0]}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Export Data Leaderboard</h2>
          <p className="text-sm text-slate-400">Unduh data klasemen lengkap beserta detail tangkapan untuk dibagikan.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={exportToImage}
            disabled={isExporting}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors border",
              isExporting ? "opacity-50 cursor-not-allowed border-indigo-500/50 bg-indigo-500/10 text-indigo-400" : "border-indigo-500/50 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
            )}
          >
            <ImageIcon className="w-4 h-4" /> {isExporting ? 'Proses...' : 'Export Gambar'}
          </button>
        </div>
      </div>

      {/* Hidden container for image export */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div ref={tableRef} style={{ backgroundColor: '#020617', color: '#e2e8f0', width: '1200px', padding: '32px', fontFamily: 'sans-serif' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginBottom: '8px' }}>🏆 LEADERBOARD MANCING 🏆</h1>
            <p style={{ color: '#94a3b8', fontSize: '18px' }}>Hasil Akhir Pertandingan</p>
          </div>
          
          <div style={{ borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden', backgroundColor: '#0f172a' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
                <tr>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', width: '64px' }}>Rank</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', width: '180px' }}>Contender</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', width: '100px' }}>Catches</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Detail Tangkapan</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', width: '120px' }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {sortedParticipants.map((p, index) => (
                  <tr key={p.cid} style={{ borderBottom: '1px solid #1e293b', backgroundColor: index < 3 ? 'rgba(99, 102, 241, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '16px 24px', textAlign: 'left' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#d97706' : '#64748b'
                      }}>
                        #{index + 1}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '18px' }}>{p.character_name}</div>
                      <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '14px' }}>CID: {p.cid}</div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'left' }}>
                      <span style={{ fontFamily: 'monospace', color: '#cbd5e1', fontSize: '18px' }}>{p.total_fish_count}</span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(() => {
                          const userLogs = logs.filter(l => l.cid === p.cid);
                          const counts = userLogs.reduce((acc, log) => {
                            const name = log.fish_name || `${log.fish_category} Fish`;
                            const key = `${name}|${log.fish_category}`;
                            acc[key] = (acc[key] || 0) + (log.quantity || 1);
                            return acc;
                          }, {} as Record<string, number>);
                          
                          const entries = Object.entries(counts);
                          if (entries.length === 0) return <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: '14px' }}>-</span>;
                          
                          return entries.map(([key, count], idx) => {
                            const [name, cat] = key.split('|');
                            const bg = cat === 'Legendary' ? '#3b0764' : cat === 'Rare' ? '#1e1b4b' : cat === 'Uncommon' ? '#064e3b' : '#1e293b';
                            const text = cat === 'Legendary' ? '#d8b4fe' : cat === 'Rare' ? '#a5b4fc' : cat === 'Uncommon' ? '#6ee7b7' : '#cbd5e1';
                            const border = cat === 'Legendary' ? '#581c87' : cat === 'Rare' ? '#312e81' : cat === 'Uncommon' ? '#065f46' : '#334155';
                            return (
                              <span key={idx} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: bg,
                                color: text,
                                border: `1px solid ${border}`
                              }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 'bold', opacity: 0.8 }}>{count}x</span>
                                {name}
                              </span>
                            );
                          });
                        })()}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ fontFamily: 'monospace', color: '#818cf8', fontWeight: 'bold', fontSize: '20px' }}>{p.total_points}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Pts</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px', fontFamily: 'monospace' }}>
            Generated on {new Date().toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
};
