export type RealmCategory = 
  | 'apaya'          // အပါယ် ၄ ဘုံ
  | 'human'          // လူ့ဘုံ
  | 'deva'           // နတ် ၆ ဘုံ
  | 'rupa_brahma'    // ရူပဗြဟ္မာ ၁၆ ဘုံ
  | 'arupa_brahma';  // အရူပဗြဟ္မာ ၄ ဘုံ

export interface RealmItem {
  id: number;
  name: string;
  paliName: string;
  category: RealmCategory;
  categoryName: string;
  dedication: string;
  description: string;
}

export interface VerseLine {
  pali: string;
  pronunciation: string;
}

export interface MettaVerse {
  stanza: number;
  pali: string;
  lines: VerseLine[];
  meaning: string;
  english: string;
}

export type AdhitthanaStatus = 
  | 'not_started' 
  | 'active' 
  | 'completed_today' 
  | 'missed_day' 
  | 'completed_journey';

export interface FailedJourneyRecord {
  id: string;
  startDate: string;
  failedDate: string;
  daysCompleted: number;
  targetDays: number;
  reason: string;
}

export interface AdhitthanaState {
  status: AdhitthanaStatus;
  devoteeName: string;
  targetDays: number;
  startDate: string; // YYYY-MM-DD
  currentDay: number;
  streakCount: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  completedDates: string[]; // ['2026-10-01', ...]
  failedJourneys: FailedJourneyRecord[];
}
