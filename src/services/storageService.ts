import { AdhitthanaState, FailedJourneyRecord } from '../types';

const STORAGE_KEY = 'metta_sutta_31_adhitthana';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

const DEFAULT_STATE: AdhitthanaState = {
  status: 'not_started',
  devoteeName: '',
  targetDays: 31,
  startDate: getTodayDateString(),
  currentDay: 1,
  streakCount: 0,
  lastCompletedDate: null,
  completedDates: [],
  failedJourneys: []
};

export class StorageService {
  public static loadState(): AdhitthanaState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_STATE;
      const state: AdhitthanaState = JSON.parse(data);
      return this.evaluateMissedDay(state);
    } catch {
      return DEFAULT_STATE;
    }
  }

  public static saveState(state: AdhitthanaState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save state:', err);
    }
  }

  // Strict KoeNaWin-Style Date Check
  // If calendar days passed without recitation > 1, journey is missed/broken!
  public static evaluateMissedDay(state: AdhitthanaState): AdhitthanaState {
    if (state.status === 'not_started' || state.status === 'completed_journey') {
      return state;
    }

    const today = getTodayDateString();

    // Already completed today
    if (state.lastCompletedDate === today) {
      return {
        ...state,
        status: state.currentDay >= state.targetDays ? 'completed_journey' : 'completed_today'
      };
    }

    // Has completed previously
    if (state.lastCompletedDate) {
      const daysPassed = parseDaysDifference(state.lastCompletedDate, today);
      if (daysPassed > 1) {
        // Missed at least 1 day! Strict Reset Trigger
        return {
          ...state,
          status: 'missed_day'
        };
      } else {
        return {
          ...state,
          status: 'active'
        };
      }
    } else {
      // Never completed day 1 yet
      const daysSinceStart = parseDaysDifference(state.startDate, today);
      if (daysSinceStart > 1) {
        return {
          ...state,
          status: 'missed_day'
        };
      }
      return {
        ...state,
        status: 'active'
      };
    }
  }

  // Start a new Adhitthana Journey
  public static startJourney(targetDays: number, devoteeName: string): AdhitthanaState {
    const today = getTodayDateString();
    const currentState = this.loadState();
    const newState: AdhitthanaState = {
      ...currentState,
      status: 'active',
      devoteeName: devoteeName.trim(),
      targetDays,
      startDate: today,
      currentDay: 1,
      streakCount: 0,
      lastCompletedDate: null,
      completedDates: []
    };
    this.saveState(newState);
    return newState;
  }

  // Record daily completion (after reciting all 31 realms)
  public static recordDailyCompletion(): AdhitthanaState {
    const state = this.loadState();
    const today = getTodayDateString();

    if (state.lastCompletedDate === today) {
      return state; // Already recorded today
    }

    const newCompletedDates = [...state.completedDates, today];
    const newStreak = state.streakCount + 1;
    const isFinished = state.currentDay >= state.targetDays;

    const updatedState: AdhitthanaState = {
      ...state,
      status: isFinished ? 'completed_journey' : 'completed_today',
      streakCount: newStreak,
      lastCompletedDate: today,
      completedDates: newCompletedDates,
      currentDay: isFinished ? state.targetDays : state.currentDay + 1
    };

    this.saveState(updatedState);
    return updatedState;
  }

  // Reset after missed day (Strict discipline)
  public static resetMissedJourney(reason: string = 'ရက်ပျက်သဖြင့် အဓိဋ္ဌာန် ပြတ်သွားပါသည်'): AdhitthanaState {
    const state = this.loadState();
    const today = getTodayDateString();

    const failedRecord: FailedJourneyRecord = {
      id: Date.now().toString(),
      startDate: state.startDate,
      failedDate: today,
      daysCompleted: state.completedDates.length,
      targetDays: state.targetDays,
      reason
    };

    const newState: AdhitthanaState = {
      ...state,
      status: 'not_started',
      currentDay: 1,
      streakCount: 0,
      lastCompletedDate: null,
      completedDates: [],
      failedJourneys: [failedRecord, ...state.failedJourneys]
    };

    this.saveState(newState);
    return newState;
  }

  // Manual reset from settings
  public static resetAll(): AdhitthanaState {
    this.saveState(DEFAULT_STATE);
    return DEFAULT_STATE;
  }
}
