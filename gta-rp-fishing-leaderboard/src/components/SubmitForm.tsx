import React, { useState, useRef } from 'react';
import { useAppContext } from '../lib/store';
import { FishCategory, FISH_POINTS } from '../types';
import { PlusCircle, Info, RefreshCw, ImagePlus, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

export const SubmitForm = () => {
  const { submitCatch } = useAppContext();
  const [cid, setCid] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FishCategory>('Common');
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualFishName, setManualFishName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<string>('');
  const [scannedText, setScannedText] = useState('');
  const [items, setItems] = useState<{ category: FishCategory, name: string, quantity: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [ktpFile, setKtpFile] = useState<File | null>(null);

  const FISH_DICTIONARY: Record<string, FishCategory> = {
    'SEA TURTLE': 'Legendary',
    'WHITE SHARK': 'Legendary',
    'RED LIONFISH': 'Rare',
    'SWORDFISH': 'Rare',
    'SHARK': 'Rare',
    'MAHI-MAHI': 'Uncommon',
    'BULL TROUT': 'Uncommon',
    'SALMON': 'Uncommon',
    'TUNA': 'Uncommon',
    'BLUE CRAB': 'Common',
    'KING CRAB': 'Common',
    'CARP': 'Common',
    'CATFISH': 'Common',
    'BASS': 'Common',
  };

  const handleImageScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBuktiFile(file);
    setIsScanning(true);
    setScanProgress('Memulai Tesseract...');
    setScannedText('');
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(`Membaca teks... ${Math.round(m.progress * 100)}%`);
          } else {
            setScanProgress(m.status);
          }
        }
      });
      
      const text = result.data.text.toUpperCase();
      setScannedText(text);
      
      // Auto-extract logic for CID if found
      const cidMatch = text.match(/(?:CID|ID|ID-)[^\w]*(\d{1,5})/i);
      if (cidMatch && cidMatch[1]) {
        setCid(cidMatch[1]);
      }

      // Auto-extract fish
      const extractedItems: { category: FishCategory, name: string, quantity: number }[] = [];
      const fishNames = Object.keys(FISH_DICTIONARY);
      
      fishNames.forEach(fishName => {
        // Find all occurrences of the fish name in the OCR text
        const matches = [...text.matchAll(new RegExp(fishName.replace('-', '\\-'), 'gi'))];
        
        matches.forEach(match => {
          const index = match.index;
          if (index === undefined) return;
          
          // Grab the text before the fish name to look for the quantity (e.g. "7x")
          const textBefore = text.substring(0, index);
          
          // Match all numbers followed by x (e.g. "1x", "7x", " 3 x")
          const qtyMatches = [...textBefore.matchAll(/(\d+)\s*[xX]/g)];
          
          let quantity = 1; // Default to 1
          
          if (qtyMatches.length > 0) {
            // Get the last matched quantity before this fish name
            const lastQtyMatch = qtyMatches[qtyMatches.length - 1];
            
            // Ensure the quantity is reasonably close to the fish name (within 150 chars)
            // OCR from grids can place the quantity on a previous line, but usually not too far away
            if (index - lastQtyMatch.index < 150) {
              quantity = parseInt(lastQtyMatch[1], 10);
            }
          }
          
          extractedItems.push({
            name: fishName.toUpperCase(),
            category: FISH_DICTIONARY[fishName],
            quantity
          });
        });
      });
      
      // Deduplicate if we found the same fish multiple times
      const uniqueItems = extractedItems.reduce((acc, current) => {
        const existing = acc.find(item => item.name === current.name);
        if (!existing) {
          return acc.concat([current]);
        } else {
          // Keep the max quantity found or sum them up? Let's just keep max for now to avoid false double-counts
          existing.quantity = Math.max(existing.quantity, current.quantity);
          return acc;
        }
      }, [] as typeof extractedItems);

      if (uniqueItems.length > 0) {
        setItems(prev => [...prev, ...uniqueItems]);
        setSuccessMsg(`Berhasil mengekstrak ${uniqueItems.length} jenis ikan dari gambar.`);
      } else if (cidMatch && cidMatch[1]) {
        setSuccessMsg(`Berhasil mengekstrak CID dari gambar: ${cidMatch[1]}`);
      }
      
      setTimeout(() => setSuccessMsg(''), 4000);

    } catch (error) {
      console.error(error);
      setScannedText('Gagal memindai gambar.');
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddItem = () => {
    if (!manualFishName) return;
    
    const uppercaseName = manualFishName.toUpperCase();
    
    const existingIndex = items.findIndex(item => item.name.toUpperCase() === uppercaseName);
    if (existingIndex >= 0) {
      setItems(prev => {
        const newItems = [...prev];
        newItems[existingIndex].quantity += manualQuantity;
        return newItems;
      });
    } else {
      setItems(prev => [...prev, { category, name: uppercaseName, quantity: manualQuantity }]);
    }

    setManualFishName('');
    setManualQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cid || !name || items.length === 0) {
      if (items.length === 0) setSuccessMsg('Silakan tambahkan minimal 1 ikan!');
      return;
    }
    
    if (!buktiFile || !ktpFile) {
      setSuccessMsg('Silakan upload Foto Bukti dan Foto KTP terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
      let base64Image: string | undefined;

      try {
        const reader = new FileReader();
        base64Image = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(buktiFile);
        });
      } catch (e) {
        console.error("Failed to read image", e);
      }
      
      if (webhookUrl) {
        const formData = new FormData();
        formData.append('file1', buktiFile, 'bukti.jpg');
        formData.append('file2', ktpFile, 'ktp.jpg');
        
        const embed = {
          title: "🎣 Laporan Tangkapan Baru",
          color: 0x5865F2,
          fields: [
            { name: "Character ID (CID)", value: cid, inline: true },
            { name: "Nama Karakter", value: name, inline: true },
            { 
              name: "Hasil Tangkapan", 
              value: items.map(i => `\`${i.quantity}x\` **${i.name}** (${i.category})`).join("\n") 
            }
          ],
          image: { url: "attachment://bukti.jpg" },
          thumbnail: { url: "attachment://ktp.jpg" }
        };
        
        formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
        
        await fetch(webhookUrl, {
          method: 'POST',
          body: formData
        });
      }

      submitCatch(cid, name, items, base64Image);
      setSuccessMsg(`Berhasil mengirim laporan tangkapan untuk CID: ${cid}.`);
      setItems([]);
      setCid('');
      setName('');
      setManualFishName('');
      setManualQuantity(1);
      setBuktiFile(null);
      setKtpFile(null);
    } catch (err) {
      console.error(err);
      setSuccessMsg('Terjadi kesalahan saat mengirim data.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-xl max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <PlusCircle className="text-indigo-400" /> Form Laporan Tangkapan
        </h2>
      </div>

      {/* Mandatory Notice Banner */}
      <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <div className="p-1 bg-amber-500/20 rounded shrink-0 text-amber-400 font-bold">⚠️ WAJIB</div>
        <p className="leading-relaxed">
          Setelah mengisi form laporan ini, <strong className="text-amber-300 underline">serahkan/berikan ikan fisik hasil tangkapan</strong> langsung kepada Panitia di lokasi event untuk diverifikasi!
        </p>
      </div>

      {isScanning && (
        <div className="mb-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg flex items-center gap-3 text-sm text-indigo-300">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> {scanProgress || 'Sedang memindai teks pada gambar...'}
        </div>
      )}

      {scannedText && !isScanning && (
        <div className="mb-4 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono max-h-24 overflow-y-auto">
          <span className="text-indigo-400 mb-1 block">Hasil Ekstrak Teks:</span>
          {scannedText}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Upload Bukti Foto *</label>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all ${
                buktiFile 
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                  : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-indigo-400'
              }`}
            >
              {isScanning ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <ImagePlus className="w-6 h-6" />
              )}
              <span className="text-xs font-semibold text-center px-2">
                {buktiFile ? buktiFile.name : 'Pilih Foto Bukti'}
              </span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageScan} 
              accept="image/*" 
              className="hidden" 
              required={!buktiFile}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Upload Foto KTP *</label>
            <button 
              type="button"
              onClick={() => ktpInputRef.current?.click()}
              className={`w-full h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all ${
                ktpFile 
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                  : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-indigo-400'
              }`}
            >
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs font-semibold text-center px-2">
                {ktpFile ? ktpFile.name : 'Pilih Foto KTP'}
              </span>
            </button>
            <input 
              type="file" 
              ref={ktpInputRef} 
              onChange={(e) => {
                if (e.target.files?.[0]) setKtpFile(e.target.files[0]);
              }} 
              accept="image/*" 
              className="hidden" 
              required={!ktpFile}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Character ID (CID)</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-mono placeholder-slate-600"
            placeholder="Contoh: 1042"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Nama Karakter</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-600"
            placeholder="Contoh: Budi Santoso"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="pt-2 border-t border-slate-800">
          <label className="block text-sm font-medium text-slate-400 mb-2">Daftar Tangkapan</label>
          {items.length > 0 && (
            <div className="mb-4 space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-lg group">
                  <div>
                    <div className="font-bold text-indigo-300">{item.name}</div>
                    <div className="text-xs text-indigo-400/70">{item.category} (+{FISH_POINTS[item.category]} pts)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-lg font-black text-indigo-400">
                      {item.quantity}x
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeItem(idx)}
                      className="text-red-400 opacity-50 hover:opacity-100 transition-opacity p-1"
                      title="Hapus Ikan"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-sm text-slate-400 mt-2 text-right">
                Total Estimasi: <span className="font-bold text-indigo-400">{items.reduce((acc, item) => acc + FISH_POINTS[item.category], 0)} pts</span>
              </div>
            </div>
          )}
          
          <div className="space-y-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tambah Manual</h4>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Kategori Ikan</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Common', 'Uncommon', 'Rare', 'Legendary'] as FishCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center justify-center ${
                      category === cat 
                        ? 'bg-indigo-900/40 border-indigo-500 text-indigo-400 ring-1 ring-indigo-500/50' 
                        : 'bg-slate-950/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-900'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Ikan</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-600 text-sm"
                  placeholder="Contoh: Hiu Putih"
                  value={manualFishName}
                  onChange={(e) => setManualFishName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Jumlah</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-600 font-mono text-sm"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleAddItem}
              disabled={!manualFishName}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-sm border border-slate-700"
            >
              + Tambah ke Daftar
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !cid || !name}
          className="w-full mt-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:shadow-none uppercase tracking-wider"
        >
          {isSubmitting ? (
            <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
          ) : (
            'Catat Tangkapan'
          )}
        </button>
        
        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Info className="w-4 h-4" /> {successMsg}
          </div>
        )}
      </form>
    </div>
  );
};
