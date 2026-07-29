import React, { createContext, useContext, useState, useEffect } from 'react';
import { Participant, CatchLog, FishCategory, FISH_POINTS, FISH_RARITY_WEIGHT, CatchSubmission, SubmissionItem } from '../types';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, getDocs, writeBatch } from 'firebase/firestore';

interface AppState {
  participants: Participant[];
  logs: CatchLog[];
  submissions: CatchSubmission[];
}

interface AppContextType extends AppState {
  addCatch: (cid: string, name: string, category: FishCategory, quantity?: number, fishName?: string) => Promise<void>;
  submitCatch: (cid: string, name: string, items: SubmissionItem[], imageData?: string) => Promise<void>;
  verifySubmission: (submissionId: string, status: 'Verified' | 'Rejected') => Promise<void>;
  updateSubmissionItems: (submissionId: string, newItems: SubmissionItem[]) => Promise<void>;
  resetData: () => Promise<void>;
}

const defaultParticipants: Participant[] = [
  { cid: '101', character_name: 'Budi Santoso', total_points: 320, total_fish_count: 5, highest_rarity: 'Legendary', highest_rarity_weight: 4, legendary_count: 1, rare_count: 2, updated_at: Date.now() - 10000 },
  { cid: '102', character_name: 'Joko Anwar', total_points: 250, total_fish_count: 8, highest_rarity: 'Rare', highest_rarity_weight: 3, legendary_count: 0, rare_count: 3, updated_at: Date.now() - 20000 },
  { cid: '103', character_name: 'Siti Aminah', total_points: 250, total_fish_count: 6, highest_rarity: 'Rare', highest_rarity_weight: 3, legendary_count: 0, rare_count: 2, updated_at: Date.now() - 30000 },
  { cid: '104', character_name: 'Asep Saepudin', total_points: 150, total_fish_count: 15, highest_rarity: 'Uncommon', highest_rarity_weight: 2, legendary_count: 0, rare_count: 0, updated_at: Date.now() - 40000 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [participants, setParticipants] = useState<Participant[]>(defaultParticipants);
  const [logs, setLogs] = useState<CatchLog[]>([]);
  const [submissions, setSubmissions] = useState<CatchSubmission[]>([]);

  // Real-time synchronization with Firestore
  useEffect(() => {
    // 1. Listen to participants collection
    const unsubParticipants = onSnapshot(collection(db, 'participants'), (snapshot) => {
      if (snapshot.empty) {
        // Seed default participants to Firestore if empty
        defaultParticipants.forEach((p) => {
          setDoc(doc(db, 'participants', p.cid), p).catch(console.error);
        });
      } else {
        const data: Participant[] = [];
        snapshot.forEach((docSnap) => {
          data.push(docSnap.data() as Participant);
        });
        setParticipants(data);
      }
    }, (err) => console.error('Firestore participants sync error:', err));

    // 2. Listen to logs collection
    const unsubLogs = onSnapshot(collection(db, 'logs'), (snapshot) => {
      const data: CatchLog[] = [];
      snapshot.forEach((docSnap) => {
        data.push(docSnap.data() as CatchLog);
      });
      data.sort((a, b) => b.created_at - a.created_at);
      setLogs(data);
    }, (err) => console.error('Firestore logs sync error:', err));

    // 3. Listen to submissions collection
    const unsubSubmissions = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      const data: CatchSubmission[] = [];
      snapshot.forEach((docSnap) => {
        data.push(docSnap.data() as CatchSubmission);
      });
      data.sort((a, b) => b.created_at - a.created_at);
      setSubmissions(data);
    }, (err) => console.error('Firestore submissions sync error:', err));

    return () => {
      unsubParticipants();
      unsubLogs();
      unsubSubmissions();
    };
  }, []);

  const addCatch = async (cid: string, name: string, category: FishCategory, quantity: number = 1, fishName?: string) => {
    try {
      const alreadyCaught = fishName 
        ? logs.some(l => l.cid === cid && l.fish_name?.toLowerCase() === fishName.toLowerCase())
        : false;

      const points = alreadyCaught ? 0 : FISH_POINTS[category];
      const weight = FISH_RARITY_WEIGHT[category];
      const now = Date.now();

      const newLogId = Math.random().toString(36).substr(2, 9);
      const newLog: CatchLog = {
        id: newLogId,
        cid,
        fish_category: category,
        fish_name: fishName,
        quantity: quantity,
        points_earned: points,
        created_at: now,
      };

      await setDoc(doc(db, 'logs', newLogId), newLog);

      const existingParticipant = participants.find((p) => p.cid === cid);
      if (existingParticipant) {
        const updatedPart: Participant = {
          ...existingParticipant,
          character_name: name,
          total_points: existingParticipant.total_points + points,
          total_fish_count: existingParticipant.total_fish_count + quantity,
          highest_rarity: existingParticipant.highest_rarity_weight < weight ? category : existingParticipant.highest_rarity,
          highest_rarity_weight: Math.max(existingParticipant.highest_rarity_weight, weight),
          legendary_count: existingParticipant.legendary_count + (category === 'Legendary' ? quantity : 0),
          rare_count: existingParticipant.rare_count + (category === 'Rare' ? quantity : 0),
          updated_at: now,
        };
        await setDoc(doc(db, 'participants', cid), updatedPart);
      } else {
        const newPart: Participant = {
          cid,
          character_name: name,
          total_points: points,
          total_fish_count: quantity,
          highest_rarity: category,
          highest_rarity_weight: weight,
          legendary_count: category === 'Legendary' ? quantity : 0,
          rare_count: category === 'Rare' ? quantity : 0,
          updated_at: now,
        };
        await setDoc(doc(db, 'participants', cid), newPart);
      }
    } catch (e) {
      console.error('Failed to add catch to Firestore:', e);
    }
  };

  const submitCatch = async (cid: string, name: string, items: SubmissionItem[], imageData?: string) => {
    try {
      const newSubId = Math.random().toString(36).substr(2, 9);
      const newSubmission: CatchSubmission = {
        id: newSubId,
        cid,
        character_name: name,
        items,
        status: 'Pending',
        created_at: Date.now(),
        image_data: imageData,
      };

      await setDoc(doc(db, 'submissions', newSubId), newSubmission);
    } catch (e) {
      console.error('Failed to submit catch to Firestore:', e);
    }
  };

  const updateSubmissionItems = async (submissionId: string, newItems: SubmissionItem[]) => {
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        items: newItems,
      });
    } catch (e) {
      console.error('Failed to update submission items:', e);
    }
  };

  const verifySubmission = async (submissionId: string, status: 'Verified' | 'Rejected') => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission || submission.status !== 'Pending') return;

      // Update submission status in Firestore
      await updateDoc(doc(db, 'submissions', submissionId), { status });

      if (status === 'Verified') {
        let currentLogs = [...logs];
        let currentParticipants = [...participants];

        for (const item of submission.items) {
          const alreadyCaught = item.name 
            ? currentLogs.some(l => l.cid === submission.cid && l.fish_name?.toLowerCase() === item.name.toLowerCase())
            : false;

          const points = alreadyCaught ? 0 : FISH_POINTS[item.category];
          const weight = FISH_RARITY_WEIGHT[item.category];
          const now = Date.now();

          const logId = Math.random().toString(36).substr(2, 9);
          const newLog: CatchLog = {
            id: logId,
            cid: submission.cid,
            fish_category: item.category,
            fish_name: item.name,
            quantity: item.quantity,
            points_earned: points,
            created_at: now,
          };

          await setDoc(doc(db, 'logs', logId), newLog);
          currentLogs.unshift(newLog);

          const existingParticipant = currentParticipants.find((p) => p.cid === submission.cid);
          if (existingParticipant) {
            const updatedParticipant: Participant = {
              ...existingParticipant,
              character_name: submission.character_name,
              total_points: existingParticipant.total_points + points,
              total_fish_count: existingParticipant.total_fish_count + item.quantity,
              highest_rarity: existingParticipant.highest_rarity_weight < weight ? item.category : existingParticipant.highest_rarity,
              highest_rarity_weight: Math.max(existingParticipant.highest_rarity_weight, weight),
              legendary_count: existingParticipant.legendary_count + (item.category === 'Legendary' ? item.quantity : 0),
              rare_count: existingParticipant.rare_count + (item.category === 'Rare' ? item.quantity : 0),
              updated_at: now,
            };
            await setDoc(doc(db, 'participants', submission.cid), updatedParticipant);
            currentParticipants = currentParticipants.map(p => p.cid === submission.cid ? updatedParticipant : p);
          } else {
            const newParticipant: Participant = {
              cid: submission.cid,
              character_name: submission.character_name,
              total_points: points,
              total_fish_count: item.quantity,
              highest_rarity: item.category,
              highest_rarity_weight: weight,
              legendary_count: item.category === 'Legendary' ? item.quantity : 0,
              rare_count: item.category === 'Rare' ? item.quantity : 0,
              updated_at: now,
            };
            await setDoc(doc(db, 'participants', submission.cid), newParticipant);
            currentParticipants.push(newParticipant);
          }
        }
      }
    } catch (e) {
      console.error('Failed to verify submission in Firestore:', e);
    }
  };

  const resetData = async () => {
    try {
      const partDocs = await getDocs(collection(db, 'participants'));
      const subDocs = await getDocs(collection(db, 'submissions'));
      const logDocs = await getDocs(collection(db, 'logs'));

      const batch = writeBatch(db);
      partDocs.forEach(d => batch.delete(d.ref));
      subDocs.forEach(d => batch.delete(d.ref));
      logDocs.forEach(d => batch.delete(d.ref));

      await batch.commit();
    } catch (e) {
      console.error('Failed to reset data:', e);
    }
  };

  return (
    <AppContext.Provider value={{ participants, logs, submissions, addCatch, submitCatch, verifySubmission, updateSubmissionItems, resetData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
