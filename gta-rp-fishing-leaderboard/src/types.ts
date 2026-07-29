export type FishCategory = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';

export const FISH_POINTS: Record<FishCategory, number> = {
  Common: 10,
  Uncommon: 30,
  Rare: 40,
  Legendary: 50,
};

export const FISH_RARITY_WEIGHT: Record<FishCategory, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Legendary: 4,
};

export interface Participant {
  cid: string;
  character_name: string;
  total_points: number;
  total_fish_count: number;
  highest_rarity: FishCategory | null;
  highest_rarity_weight: number; // for sorting
  legendary_count: number;
  rare_count: number;
  updated_at: number;
}

export interface SubmissionItem {
  category: FishCategory;
  name: string;
  quantity: number;
}

export interface CatchSubmission {
  id: string;
  cid: string;
  character_name: string;
  items: SubmissionItem[];
  status: 'Pending' | 'Verified' | 'Rejected';
  created_at: number;
  image_data?: string;
}

export interface CatchLog {
  id: string;
  cid: string;
  fish_category: FishCategory;
  fish_name?: string;
  quantity?: number;
  points_earned: number;
  created_at: number;
}
