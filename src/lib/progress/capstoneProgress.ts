import { useSyncExternalStore } from 'react';

export const CAPSTONE_PROGRESS_STORAGE_KEY = 'japanese-os.capstone-progress.v1';

const CAPSTONE_PROGRESS_UPDATED_EVENT = 'japanese-os:capstone-progress-updated';
const CAPSTONE_PROGRESS_VERSION = 1;

export interface CapstoneProgressRecord {
  version: number;
  completedStoryIds: string[];
  completionCountsByStoryId: Record<string, number>;
  lastCompletedAtByStoryId: Record<string, string>;
}

export type CapstoneProgressEntry = {
  isCompleted: boolean;
  completionCount: number;
  lastCompletedAt: string | null;
};

const EMPTY_CAPSTONE_PROGRESS: CapstoneProgressRecord = {
  version: CAPSTONE_PROGRESS_VERSION,
  completedStoryIds: [],
  completionCountsByStoryId: {},
  lastCompletedAtByStoryId: {},
};

let cachedRawCapstoneProgress: string | null | undefined;
let cachedCapstoneProgress: CapstoneProgressRecord = EMPTY_CAPSTONE_PROGRESS;

export function getEmptyCapstoneProgress() {
  return EMPTY_CAPSTONE_PROGRESS;
}

export function useCapstoneProgress() {
  return useSyncExternalStore(
    subscribeToCapstoneProgress,
    readCapstoneProgress,
    getEmptyCapstoneProgress,
  );
}

export function readCapstoneProgress(): CapstoneProgressRecord {
  if (typeof window === 'undefined') {
    return EMPTY_CAPSTONE_PROGRESS;
  }

  try {
    const rawProgress = window.localStorage.getItem(CAPSTONE_PROGRESS_STORAGE_KEY);

    if (rawProgress === cachedRawCapstoneProgress) {
      return cachedCapstoneProgress;
    }

    if (!rawProgress) {
      cachedRawCapstoneProgress = rawProgress;
      cachedCapstoneProgress = EMPTY_CAPSTONE_PROGRESS;
      return cachedCapstoneProgress;
    }

    cachedRawCapstoneProgress = rawProgress;
    cachedCapstoneProgress = parseCapstoneProgress(JSON.parse(rawProgress));
    return cachedCapstoneProgress;
  } catch {
    cachedRawCapstoneProgress = undefined;
    cachedCapstoneProgress = EMPTY_CAPSTONE_PROGRESS;
    return cachedCapstoneProgress;
  }
}

export function markCapstoneComplete(storyId: string, completedAt = new Date()) {
  if (!storyId.trim()) {
    return getEmptyCapstoneProgress();
  }

  const currentProgress = readCapstoneProgress();
  const nextProgress = parseCapstoneProgress({
    ...currentProgress,
    completedStoryIds: Array.from(new Set([...currentProgress.completedStoryIds, storyId])),
    completionCountsByStoryId: {
      ...currentProgress.completionCountsByStoryId,
      [storyId]: (currentProgress.completionCountsByStoryId[storyId] ?? 0) + 1,
    },
    lastCompletedAtByStoryId: {
      ...currentProgress.lastCompletedAtByStoryId,
      [storyId]: completedAt.toISOString(),
    },
  });

  writeCapstoneProgress(nextProgress);
  return nextProgress;
}

export function resetCapstoneProgress() {
  writeCapstoneProgress(EMPTY_CAPSTONE_PROGRESS);
  return EMPTY_CAPSTONE_PROGRESS;
}

export function getCapstoneProgressEntry(
  progress: CapstoneProgressRecord,
  storyId: string,
): CapstoneProgressEntry {
  const completionCount = progress.completionCountsByStoryId[storyId] ?? 0;
  const lastCompletedAt = progress.lastCompletedAtByStoryId[storyId] ?? null;
  const isCompleted =
    progress.completedStoryIds.includes(storyId) || completionCount > 0;

  return {
    isCompleted,
    completionCount,
    lastCompletedAt,
  };
}

function subscribeToCapstoneProgress(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleProgressUpdate = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CAPSTONE_PROGRESS_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(
    CAPSTONE_PROGRESS_UPDATED_EVENT,
    handleProgressUpdate as EventListener,
  );
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(
      CAPSTONE_PROGRESS_UPDATED_EVENT,
      handleProgressUpdate as EventListener,
    );
    window.removeEventListener('storage', handleStorage);
  };
}

function writeCapstoneProgress(progress: CapstoneProgressRecord) {
  if (typeof window === 'undefined') {
    return;
  }

  const serializedProgress = JSON.stringify(progress);
  cachedRawCapstoneProgress = serializedProgress;
  cachedCapstoneProgress = progress;

  window.localStorage.setItem(CAPSTONE_PROGRESS_STORAGE_KEY, serializedProgress);
  window.dispatchEvent(new Event(CAPSTONE_PROGRESS_UPDATED_EVENT));
}

function parseCapstoneProgress(rawValue: unknown): CapstoneProgressRecord {
  if (!isRecord(rawValue)) {
    return EMPTY_CAPSTONE_PROGRESS;
  }

  return {
    version: CAPSTONE_PROGRESS_VERSION,
    completedStoryIds: sanitizeStringIds(rawValue.completedStoryIds),
    completionCountsByStoryId: sanitizeCompletionCounts(
      rawValue.completionCountsByStoryId,
    ),
    lastCompletedAtByStoryId: sanitizeLastCompletedAt(
      rawValue.lastCompletedAtByStoryId,
    ),
  };
}

function sanitizeStringIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)),
  );
}

function sanitizeCompletionCounts(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, number>>((record, [key, count]) => {
    if (typeof key !== 'string' || typeof count !== 'number') {
      return record;
    }

    if (!Number.isInteger(count) || count < 0) {
      return record;
    }

    record[key] = count;
    return record;
  }, {});
}

function sanitizeLastCompletedAt(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, string>>((record, [key, timestamp]) => {
    if (typeof key !== 'string' || typeof timestamp !== 'string') {
      return record;
    }

    if (Number.isNaN(Date.parse(timestamp))) {
      return record;
    }

    record[key] = timestamp;
    return record;
  }, {});
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
