import type { SkinScanRecord, UserSkinProfile, DailyRoutineTrackerState } from '../types/skin';

const STORAGE_KEY = 'lekha_skin_passport_v1';
const PROFILE_STORAGE_KEY = 'lekha_user_profile_v1';
const ROUTINE_TRACKER_KEY = 'lekha_routine_tracker_v1';

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
