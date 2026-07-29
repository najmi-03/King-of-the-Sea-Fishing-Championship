import React from 'react';
import { LiveBadge } from '../components/LiveBadge';
import { Anchor, ShieldCheck, CheckCircle2, AlertTriangle, Send, FileText, Fish, Users, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RulesPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden flex flex-col justify-between">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-900/20 via-blue-900/10 to-transparent pointer-events-none blur-3xl" />

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
              <Link to="/rules" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-10 flex-1">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Petunjuk Resmi Peserta
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            RULES & TATA CARA <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-indigo-400 to-cyan-400">
              VERIFIKASI TANGKAPAN
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Harap baca dengan teliti seluruh aturan turnamen dan langkah pendaftaran laporan agar hasil tangkapanmu dapat terverifikasi dengan sah oleh panitia.
          </p>
        </div>

        {/* IMPORTANT MANDATORY BANNER */}
        <div className="bg-gradient-to-r from-amber-950/60 via-red-950/40 to-slate-900/80 border-2 border-amber-500/50 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldAlert className="w-48 h-48 text-amber-400" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl shrink-0">
              <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider">
                SYARAT MUTLAK VERIFIKASI
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                WAJIB MENYERAHKAN FISIK IKAN KE PANITIA!
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed">
                Setiap laporan tangkapan yang diisi di website <span className="text-amber-400 font-bold underline">BELUM DIANGGAP SAH</span> sebelum peserta <span className="text-white font-black underline">memberikan/menyerahkan ikan hasil tangkapan fisik langsung kepada Panitia Event</span> di lokasi untuk diperiksa.
              </p>
            </div>
          </div>
        </div>

        {/* 3 STEP TUTORIAL */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-indigo-400" /> Tata Cara Mendaftarkan Tangkapan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/40 transition-colors relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono font-black text-lg flex items-center justify-center">
                  01
                </div>
                <Fish className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-black text-white uppercase">Mancing & Tangkap Ikan</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pancing dan dapatkan ikan di zona perairan resmi event selama periode pertandingan berlangsung. Simpan ikan di inventarismu.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-cyan-500/40 transition-colors relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-black text-lg flex items-center justify-center">
                  02
                </div>
                <Send className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-black text-white uppercase">Isi Form Lapor Tangkapan</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Buka halaman <Link to="/submit" className="text-cyan-400 underline font-bold">Lapor Tangkapan</Link>, masukkan nama karakter, CID, jenis ikan, serta unggah screenshot bukti foto tangkapan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-colors relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-lg flex items-center justify-center">
                  03
                </div>
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-white uppercase">Serahkan Fisik Ikan ke Panitia</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Datangi panitia di stan lokasi turnamen dan <span className="text-emerald-400 font-bold">berikan ikan secara fisik</span>. Panitia akan mencocokkan form web dan meluluskan status verifikasi.
              </p>
            </div>
          </div>
        </div>

        {/* VERIFICATION PROCESS EXPLANATION */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Alur Status Verifikasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950/80 border border-amber-500/30 rounded-xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold uppercase">
                Status: Pending
              </div>
              <p className="text-xs text-slate-400">
                Laporan web baru saja dikirim oleh peserta. Menunggu peserta menyerahkan ikan fisik ke panitia.
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold uppercase">
                Status: Approved
              </div>
              <p className="text-xs text-slate-400">
                Ikan fisik telah diterima dan disesuaikan oleh panitia. Poin & data otomatis masuk secara real-time ke Leaderboard.
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-red-500/30 rounded-xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-mono text-xs font-bold uppercase">
                Status: Rejected
              </div>
              <p className="text-xs text-slate-400">
                Laporan ditolak jika foto bukti tidak valid, ikan fisik tidak diserahkan, atau terjadi kecurangan.
              </p>
            </div>
          </div>
        </div>

        {/* ACTION CALLOUT */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
          <div>
            <h3 className="text-lg font-black text-white uppercase mb-1">Sudah Siap Melaporkan Hasil Tangkapan?</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Pastikan kamu sudah memegang ikan fisik sebelum atau sesudah mengisi form ini.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              Form Lapor Tangkapan <ArrowRight className="w-4 h-4" />
            </Link>
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
