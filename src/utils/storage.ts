import type { SkinScanRecord, UserSkinProfile, DailyRoutineTrackerState } from '../types/skin';
import type { UserRoutine, SkinDiaryEntry, UserGoalProgress } from '../types/skinLab';
import { DEFAULT_USER_ROUTINE } from './skinLabData';

const STORAGE_KEY = 'lekha_skin_passport_v1';
const PROFILE_STORAGE_KEY = 'lekha_user_profile_v1';
const ROUTINE_TRACKER_KEY = 'lekha_routine_tracker_v1';
const ROUTINE_BUILDER_KEY = 'lekha_user_routine_v1';
const SKIN_DIARY_KEY = 'lekha_skin_diary_v1';
const SKIN_GOALS_KEY = 'lekha_skin_goals_v1';

export function loadPassportRecords(): SkinScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return [];
  } catch (err) {
    console.error('Failed to load Skin Passport from localStorage:', err);
    return [];
  }
}

export function savePassportRecord(record: SkinScanRecord): boolean {
  try {
    const existing = loadPassportRecords();
    const updated = [record, ...existing.filter((item) => item.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err: any) {
    console.warn('Storage write failed (possibly quota limit). Attempting to optimize thumbnail sizes...', err);
    try {
      const existing = loadPassportRecords();
      const lightweightRecord = {
        ...record,
        thumbnailUrl: '',
      };
      const updated = [lightweightRecord, ...existing.filter((item) => item.id !== record.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (fallbackErr) {
      console.error('Failed to save to Skin Passport even with lightweight record:', fallbackErr);
      return false;
    }
  }
}

export function deletePassportRecord(id: string): void {
  try {
    const existing = loadPassportRecords();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete passport entry:', err);
  }
}

export function clearAllPassportRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear Skin Passport records:', err);
  }
}

export function getPassportRecordById(id: string): SkinScanRecord | undefined {
  const records = loadPassportRecords();
  return records.find((r) => r.id === id);
}

// User Profile Storage
export function loadUserProfile(): UserSkinProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSkinProfile;
  } catch (err) {
    console.error('Failed to load user profile from localStorage:', err);
    return null;
  }
}

export function saveUserProfile(profile: UserSkinProfile): boolean {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error('Failed to save user profile to localStorage:', err);
    return false;
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear user profile:', err);
  }
}

// Routine Tracker Storage
export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function loadDailyRoutineState(): DailyRoutineTrackerState {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(ROUTINE_TRACKER_KEY);
    if (!raw) {
      return { date: today, completedStepIds: [] };
    }
    const parsed = JSON.parse(raw) as DailyRoutineTrackerState;
    // Auto-reset if new day
    if (parsed.date !== today) {
      return { date: today, completedStepIds: [] };
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load routine tracker state:', err);
    return { date: today, completedStepIds: [] };
  }
}

export function toggleRoutineStepCompletion(stepId: string): DailyRoutineTrackerState {
  const current = loadDailyRoutineState();
  const exists = current.completedStepIds.includes(stepId);
  const updatedIds = exists
    ? current.completedStepIds.filter((id) => id !== stepId)
    : [...current.completedStepIds, stepId];
  
  const newState: DailyRoutineTrackerState = {
    date: current.date,
    completedStepIds: updatedIds,
  };

  try {
    localStorage.setItem(ROUTINE_TRACKER_KEY, JSON.stringify(newState));
  } catch (err) {
    console.error('Failed to save routine tracker state:', err);
  }

  return newState;
}

export function clearDailyRoutineState(): void {
  try {
    localStorage.removeItem(ROUTINE_TRACKER_KEY);
  } catch (err) {
    console.error('Failed to clear daily routine state:', err);
  }
}

// ============================================================================
// SKIN LAB: ROUTINE BUILDER STORAGE
// ============================================================================
export function loadUserRoutine(): UserRoutine {
  try {
    const raw = localStorage.getItem(ROUTINE_BUILDER_KEY);
    if (!raw) return DEFAULT_USER_ROUTINE;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.amProducts) && Array.isArray(parsed.pmProducts)) {
      return parsed as UserRoutine;
    }
    return DEFAULT_USER_ROUTINE;
  } catch (err) {
    console.error('Failed to load user routine:', err);
    return DEFAULT_USER_ROUTINE;
  }
}

export function saveUserRoutine(routine: UserRoutine): boolean {
  try {
    const updated = {
      ...routine,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(ROUTINE_BUILDER_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save user routine:', err);
    return false;
  }
}

export function resetUserRoutine(): UserRoutine {
  try {
    localStorage.setItem(ROUTINE_BUILDER_KEY, JSON.stringify(DEFAULT_USER_ROUTINE));
  } catch (err) {
    console.error('Failed to reset user routine:', err);
  }
  return DEFAULT_USER_ROUTINE;
}

// ============================================================================
// SKIN LAB: SKIN DIARY STORAGE
// ============================================================================
export function loadSkinDiaryEntries(): SkinDiaryEntry[] {
  try {
    const raw = localStorage.getItem(SKIN_DIARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
  } catch (err) {
    console.error('Failed to load skin diary entries:', err);
    return [];
  }
}

export function saveSkinDiaryEntry(entry: SkinDiaryEntry): boolean {
  try {
    const existing = loadSkinDiaryEntries();
    // Replace if same date exists, or prepend
    const filtered = existing.filter((e) => e.date !== entry.date && e.id !== entry.id);
    const updated = [entry, ...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    localStorage.setItem(SKIN_DIARY_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save skin diary entry:', err);
    return false;
  }
}

export function deleteSkinDiaryEntry(id: string): void {
  try {
    const existing = loadSkinDiaryEntries();
    const updated = existing.filter((e) => e.id !== id);
    localStorage.setItem(SKIN_DIARY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete skin diary entry:', err);
  }
}

export function exportSkinDiaryAsCsv(): string {
  const entries = loadSkinDiaryEntries();
  const headers = ['Date', 'Dryness (1-5)', 'Oiliness (1-5)', 'Redness (1-5)', 'Breakouts (1-5)', 'Irritation (1-5)', 'Tags', 'Notes'];
  const rows = entries.map((e) => [
    e.date,
    e.dryness,
    e.oiliness,
    e.redness,
    e.breakouts,
    e.irritation,
    `"${e.tags.join('; ')}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportSkinDiaryAsJson(): string {
  const entries = loadSkinDiaryEntries();
  return JSON.stringify(entries, null, 2);
}

// ============================================================================
// SKIN LAB: 28-DAY SKIN GOALS STORAGE
// ============================================================================
export function loadGoalProgress(): UserGoalProgress {
  const defaultProgress: UserGoalProgress = {
    goalId: 'barrier-repair',
    startDate: getTodayDateString(),
    completedDates: [],
    dailyHabitCompletions: {},
  };

  try {
    const raw = localStorage.getItem(SKIN_GOALS_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.goalId) {
      return {
        ...defaultProgress,
        ...parsed,
      };
    }
    return defaultProgress;
  } catch (err) {
    console.error('Failed to load goal progress:', err);
    return defaultProgress;
  }
}

export function saveGoalProgress(progress: UserGoalProgress): boolean {
  try {
    localStorage.setItem(SKIN_GOALS_KEY, JSON.stringify(progress));
    return true;
  } catch (err) {
    console.error('Failed to save goal progress:', err);
    return false;
  }
}

export function toggleDailyGoalHabit(
  goalId: string,
  habitId: string,
  date: string = getTodayDateString()
): UserGoalProgress {
  const current = loadGoalProgress();
  const habitsForDate = current.dailyHabitCompletions[date] || [];
  const isCompleted = habitsForDate.includes(habitId);

  const updatedHabits = isCompleted
    ? habitsForDate.filter((h) => h !== habitId)
    : [...habitsForDate, habitId];

  const updatedCompletions = {
    ...current.dailyHabitCompletions,
    [date]: updatedHabits,
  };

  // If at least 2 habits completed on this date, mark date as completed
  const hasSubstantialCompletion = updatedHabits.length >= 2;
  const dates = current.completedDates || [];
  let updatedDates = dates;

  if (hasSubstantialCompletion && !dates.includes(date)) {
    updatedDates = [...dates, date].sort();
  } else if (!hasSubstantialCompletion && dates.includes(date)) {
    updatedDates = dates.filter((d) => d !== date);
  }

  const updated: UserGoalProgress = {
    goalId: goalId || current.goalId,
    startDate: current.startDate || date,
    completedDates: updatedDates,
    dailyHabitCompletions: updatedCompletions,
  };

  saveGoalProgress(updated);
  return updated;
}

