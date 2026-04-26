import { useSyncExternalStore } from 'react';

export const STUDY_PREFERENCES_STORAGE_KEY = 'japanese-os.study-preferences.v1';

const STUDY_PREFERENCES_UPDATED_EVENT = 'japanese-os:study-preferences-updated';
const STUDY_PREFERENCES_VERSION = 1;

export type StudyFocusMode =
  | 'balanced'
  | 'more-listening'
  | 'more-output'
  | 'light-day'
  | 'class-prep'
  | 'weak-points-first';

export type StudyFocusModeOption = {
  id: StudyFocusMode;
  label: string;
  summary: string;
};

export interface StudyPreferencesRecord {
  version: number;
  focusMode: StudyFocusMode;
  updatedAt: string | null;
}

export const STUDY_FOCUS_MODE_OPTIONS: StudyFocusModeOption[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    summary: 'Keep grammar, listening, output, and reading in normal rotation.',
  },
  {
    id: 'more-listening',
    label: 'More listening',
    summary: 'Prefer extra ear-first practice when the daily loop has room.',
  },
  {
    id: 'more-output',
    label: 'More output',
    summary: 'Prefer more typing and sentence-building support practice.',
  },
  {
    id: 'light-day',
    label: 'Light day',
    summary: 'Favor shorter optional follow-up work after the core plan.',
  },
  {
    id: 'class-prep',
    label: 'Class prep',
    summary: 'Prefer practical beginner patterns that make lessons feel familiar.',
  },
  {
    id: 'weak-points-first',
    label: 'Weak points first',
    summary: 'Prefer extra support for misses once required Review stays protected.',
  },
];

const STUDY_FOCUS_MODE_IDS = new Set<StudyFocusMode>(
  STUDY_FOCUS_MODE_OPTIONS.map((option) => option.id),
);

const DEFAULT_STUDY_PREFERENCES: StudyPreferencesRecord = {
  version: STUDY_PREFERENCES_VERSION,
  focusMode: 'balanced',
  updatedAt: null,
};

let cachedRawStudyPreferences: string | null | undefined;
let cachedStudyPreferences: StudyPreferencesRecord = DEFAULT_STUDY_PREFERENCES;

export function getDefaultStudyPreferences() {
  return DEFAULT_STUDY_PREFERENCES;
}

export function useStudyPreferences() {
  return useSyncExternalStore(
    subscribeToStudyPreferences,
    readStudyPreferences,
    getDefaultStudyPreferences,
  );
}

export function readStudyPreferences(): StudyPreferencesRecord {
  if (typeof window === 'undefined') {
    return DEFAULT_STUDY_PREFERENCES;
  }

  try {
    const rawPreferences = window.localStorage.getItem(STUDY_PREFERENCES_STORAGE_KEY);

    if (rawPreferences === cachedRawStudyPreferences) {
      return cachedStudyPreferences;
    }

    if (!rawPreferences) {
      cachedRawStudyPreferences = rawPreferences;
      cachedStudyPreferences = DEFAULT_STUDY_PREFERENCES;
      return cachedStudyPreferences;
    }

    cachedRawStudyPreferences = rawPreferences;
    cachedStudyPreferences = parseStudyPreferences(JSON.parse(rawPreferences));
    return cachedStudyPreferences;
  } catch {
    cachedRawStudyPreferences = undefined;
    cachedStudyPreferences = DEFAULT_STUDY_PREFERENCES;
    return cachedStudyPreferences;
  }
}

export function setStudyFocusMode(focusMode: StudyFocusMode, updatedAt = new Date()) {
  const currentPreferences = readStudyPreferences();
  const nextPreferences = parseStudyPreferences({
    ...currentPreferences,
    focusMode,
    updatedAt: updatedAt.toISOString(),
  });

  writeStudyPreferences(nextPreferences);
  return nextPreferences;
}

export function resetStudyPreferences() {
  writeStudyPreferences(DEFAULT_STUDY_PREFERENCES);
  return DEFAULT_STUDY_PREFERENCES;
}

function subscribeToStudyPreferences(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handlePreferencesUpdate = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STUDY_PREFERENCES_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(
    STUDY_PREFERENCES_UPDATED_EVENT,
    handlePreferencesUpdate as EventListener,
  );
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(
      STUDY_PREFERENCES_UPDATED_EVENT,
      handlePreferencesUpdate as EventListener,
    );
    window.removeEventListener('storage', handleStorage);
  };
}

function writeStudyPreferences(preferences: StudyPreferencesRecord) {
  if (typeof window === 'undefined') {
    return;
  }

  const serializedPreferences = JSON.stringify(preferences);
  cachedRawStudyPreferences = serializedPreferences;
  cachedStudyPreferences = preferences;

  window.localStorage.setItem(STUDY_PREFERENCES_STORAGE_KEY, serializedPreferences);
  window.dispatchEvent(new Event(STUDY_PREFERENCES_UPDATED_EVENT));
}

function parseStudyPreferences(rawValue: unknown): StudyPreferencesRecord {
  if (!isRecord(rawValue)) {
    return DEFAULT_STUDY_PREFERENCES;
  }

  return {
    version: STUDY_PREFERENCES_VERSION,
    focusMode: sanitizeFocusMode(rawValue.focusMode),
    updatedAt: sanitizeTimestamp(rawValue.updatedAt),
  };
}

function sanitizeFocusMode(value: unknown): StudyFocusMode {
  return typeof value === 'string' && STUDY_FOCUS_MODE_IDS.has(value as StudyFocusMode)
    ? (value as StudyFocusMode)
    : DEFAULT_STUDY_PREFERENCES.focusMode;
}

function sanitizeTimestamp(value: unknown) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
