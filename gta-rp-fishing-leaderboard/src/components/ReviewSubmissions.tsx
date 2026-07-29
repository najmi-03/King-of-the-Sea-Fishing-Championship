import React, { useState } from 'react';
import { useAppContext } from '../lib/store';
import { FISH_POINTS, FishCategory, SubmissionItem, CatchSubmission } from '../types';
import { CheckCircle, XCircle, Clock, Edit3, Save, Trash2, Plus } from 'lucide-react';

const SubmissionEditor: React.FC<{
  submission: CatchSubmission;
  onCancel: () => void;
  onSave: (items: SubmissionItem[]) => void;
}> = ({ submission, onCancel, onSave }) => {
  const [items, setItems] = useState<SubmissionItem[]>(submission.items);
  const [manualName, setManualName] = useState('');
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualCategory, setManualCategory] = useState<FishCategory>('Common');

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (!manualName.trim()) return;
    const uppercaseName = manualName.trim().toUpperCase();
    
    const existingIndex = items.findIndex(item => item.name.toUpperCase() === uppercaseName);
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += manualQuantity;
      setItems(newItems);
    } else {
      setItems([...items, { name: uppercaseName, quantity: manualQuantity, category: manualCategory }]);
    }
    
    setManualName('');
    setManualQuantity(1);
  };

  const totalPoints = items.reduce((acc, item) => acc + FISH_POINTS[item.category], 0);

  return (
    <div className="w-full">
      <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Koreksi Tangkapan</div>
      <div className="space-y-2 mb-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-900 border border-slate-700 p-2 rounded">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                setItems(newItems);
              }}
              className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-indigo-400 font-mono font-bold focus:outline-none focus:border-indigo-500 text-sm text-center"
            />
            <span className="text-indigo-400 font-mono font-bold text-sm">x</span>
            <input
              type="text"
              value={item.name}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx].name = e.target.value.toUpperCase();
                setItems(newItems);
              }}
              className="flex-1 min-w-[100px] bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white uppercase focus:outline-none focus:border-indigo-500 text-sm"
            />
            <select
              value={item.category}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx].category = e.target.value as FishCategory;
                setItems(newItems);
              }}
              className="w-28 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Legendary">Legendary</option>
            </select>
            <button onClick={() => handleRemove(idx)} className="text-red-400 hover:text-red-300 p-1 flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-slate-500 italic">Tidak ada ikan. Tambahkan ikan di bawah.</div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg mb-4 space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase">Tambah / Koreksi Ikan</div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            placeholder="Nama Ikan..."
            className="sm:col-span-5 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
          />
          <select
            className="sm:col-span-4 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
            value={manualCategory}
            onChange={(e) => setManualCategory(e.target.value as FishCategory)}
          >
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Legendary">Legendary</option>
          </select>
          <div className="sm:col-span-3 flex gap-2">
            <input
              type="number"
              min="1"
              className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
              value={manualQuantity}
              onChange={(e) => setManualQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button
              onClick={handleAdd}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-bold text-indigo-400 bg-indigo-900/20 px-2 py-1 rounded inline-block">
          Total Estimasi Baru: +{totalPoints} Pts
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSave(items)}
          className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          <Save className="w-4 h-4" /> Simpan Perubahan
        </button>
        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export const ReviewSubmissions = () => {
  const { submissions, verifySubmission, updateSubmissionItems } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);

  const pendingSubmissions = (submissions || []).filter(s => s.status === 'Pending');

  if (pendingSubmissions.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-xl text-center">
        <div className="text-slate-500 mb-2">
          <Clock className="w-8 h-8 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-bold text-slate-300">Tidak ada pengajuan baru</h3>
        <p className="text-sm text-slate-500">Semua tangkapan telah diverifikasi.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
        <Clock className="text-indigo-400" /> 
        Menunggu Verifikasi ({pendingSubmissions.length})
      </h2>
      <div className="space-y-4">
        {pendingSubmissions.map(sub => {
          const totalPoints = sub.items.reduce((acc, item) => acc + FISH_POINTS[item.category], 0);
          
          return (
            <div key={sub.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-white text-lg">{sub.character_name}</span>
                    <span className="text-xs font-mono text-slate-500">CID: {sub.cid}</span>
                  </div>
                  
                  {editingId === sub.id ? (
                    <SubmissionEditor 
                      submission={sub} 
                      onCancel={() => setEditingId(null)}
                      onSave={(newItems) => {
                        updateSubmissionItems(sub.id, newItems);
                        setEditingId(null);
                      }}
                    />
                  ) : (
                    <>
                      <div className="space-y-1 mb-2">
                        {sub.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-slate-400 flex items-center gap-2">
                            <span className="w-6 font-mono text-indigo-400 font-bold">{item.quantity}x</span>
                            <span>{item.name} <span className="text-xs opacity-70">({item.category})</span></span>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm font-bold text-indigo-400 bg-indigo-900/20 px-2 py-1 rounded inline-block mb-3">
                        Total Estimasi: +{totalPoints} Pts
                      </div>
                    </>
                  )}

                  {sub.image_data && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1">Bukti Foto:</p>
                      <img src={sub.image_data} alt="Bukti Tangkapan" className="w-full max-w-[200px] h-auto rounded-lg border border-slate-700" />
                    </div>
                  )}
                </div>

                {editingId !== sub.id && (
                  <div className="flex flex-row sm:flex-col gap-2 justify-center sm:justify-start min-w-[120px]">
                    <button
                      onClick={() => setEditingId(sub.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-indigo-900/40 hover:bg-indigo-600/80 text-indigo-400 hover:text-white px-4 py-2 rounded-lg transition-colors border border-indigo-800"
                    >
                      <Edit3 className="w-4 h-4" /> Koreksi
                    </button>
                    <button
                      onClick={() => verifySubmission(sub.id, 'Verified')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-green-900/40 hover:bg-green-600/80 text-green-400 hover:text-white px-4 py-2 rounded-lg transition-colors border border-green-800"
                    >
                      <CheckCircle className="w-4 h-4" /> Terima
                    </button>
                    <button
                      onClick={() => verifySubmission(sub.id, 'Rejected')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-900/40 hover:bg-red-600/80 text-red-400 hover:text-white px-4 py-2 rounded-lg transition-colors border border-red-800"
                    >
                      <XCircle className="w-4 h-4" /> Tolak
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
