import type { SkinScanRecord } from '../types/skin';

const STORAGE_KEY = 'lekha_skin_passport_v1';

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
