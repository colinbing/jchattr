import { useSyncExternalStore } from 'react';

export const MISSION_PROGRESS_STORAGE_KEY = 'japanese-os.mission-progress.v1';

const MISSION_PROGRESS_UPDATED_EVENT = 'japanese-os:mission-progress-updated';
const MISSION_PROGRESS_VERSION = 1;
const EMPTY_MISSION_PROGRESS: MissionProgressRecord = {
  version: MISSION_PROGRESS_VERSION,
  completedMissionIds: [],
  completionCountsByMissionId: {},
  lastCompletedAtByMissionId: {},
};

let cachedRawMissionProgress: string | null | undefined;
let cachedMissionProgress: MissionProgressRecord = EMPTY_MISSION_PROGRESS;

export interface MissionProgressRecord {
  version: number;
  completedMissionIds: string[];
  completionCountsByMissionId: Record<string, number>;
  lastCompletedAtByMissionId: Record<string, string>;
}

export type MissionProgressEntry = {
  isCompleted: boolean;
  completionCount: number;
  lastCompletedAt: string | null;
};

export function getEmptyMissionProgress(): MissionProgressRecord {
  return EMPTY_MISSION_PROGRESS;
}

export function useMissionProgress() {
  return useSyncExternalStore(
    subscribeToMissionProgress,
    readMissionProgress,
    getEmptyMissionProgress,
  );
}

export function readMissionProgress(): MissionProgressRecord {
  if (typeof window === 'undefined') {
    return EMPTY_MISSION_PROGRESS;
  }

  try {
    const rawProgress = window.localStorage.getItem(MISSION_PROGRESS_STORAGE_KEY);

    if (rawProgress === cachedRawMissionProgress) {
      return cachedMissionProgress;
    }

    if (!rawProgress) {
      cachedRawMissionProgress = rawProgress;
      cachedMissionProgress = EMPTY_MISSION_PROGRESS;
      return cachedMissionProgress;
    }

    cachedRawMissionProgress = rawProgress;
    cachedMissionProgress = parseMissionProgress(JSON.parse(rawProgress));
    return cachedMissionProgress;
  } catch {
    cachedRawMissionProgress = undefined;
    cachedMissionProgress = EMPTY_MISSION_PROGRESS;
    return cachedMissionProgress;
  }
}

export function markMissionComplete(missionId: string, completedAt = new Date()) {
  if (!missionId.trim()) {
    return getEmptyMissionProgress();
  }

  const currentProgress = readMissionProgress();
  const nextProgress = parseMissionProgress({
    ...currentProgress,
    completedMissionIds: Array.from(new Set([...currentProgress.completedMissionIds, missionId])),
    completionCountsByMissionId: {
      ...currentProgress.completionCountsByMissionId,
      [missionId]: (currentProgress.completionCountsByMissionId[missionId] ?? 0) + 1,
    },
    lastCompletedAtByMissionId: {
      ...currentProgress.lastCompletedAtByMissionId,
      [missionId]: completedAt.toISOString(),
    },
  });

  writeMissionProgress(nextProgress);
  return nextProgress;
}

export function getMissionProgressEntry(
  progress: MissionProgressRecord,
  missionId: string,
): MissionProgressEntry {
  const completionCount = progress.completionCountsByMissionId[missionId] ?? 0;
  const lastCompletedAt = progress.lastCompletedAtByMissionId[missionId] ?? null;
  const isCompleted =
    progress.completedMissionIds.includes(missionId) || completionCount > 0;

  return {
    isCompleted,
    completionCount,
    lastCompletedAt,
  };
}

function subscribeToMissionProgress(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleProgressUpdate = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === MISSION_PROGRESS_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(
    MISSION_PROGRESS_UPDATED_EVENT,
    handleProgressUpdate as EventListener,
  );
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(
      MISSION_PROGRESS_UPDATED_EVENT,
      handleProgressUpdate as EventListener,
    );
    window.removeEventListener('storage', handleStorage);
  };
}

function writeMissionProgress(progress: MissionProgressRecord) {
  if (typeof window === 'undefined') {
    return;
  }

  const serializedProgress = JSON.stringify(progress);
  cachedRawMissionProgress = serializedProgress;
  cachedMissionProgress = progress;

  window.localStorage.setItem(MISSION_PROGRESS_STORAGE_KEY, serializedProgress);
  window.dispatchEvent(new Event(MISSION_PROGRESS_UPDATED_EVENT));
}

function parseMissionProgress(rawValue: unknown): MissionProgressRecord {
  if (!isRecord(rawValue)) {
    return EMPTY_MISSION_PROGRESS;
  }

  return {
    version:
      rawValue.version === MISSION_PROGRESS_VERSION
        ? MISSION_PROGRESS_VERSION
        : MISSION_PROGRESS_VERSION,
    completedMissionIds: sanitizeCompletedMissionIds(rawValue.completedMissionIds),
    completionCountsByMissionId: sanitizeCompletionCounts(
      rawValue.completionCountsByMissionId,
    ),
    lastCompletedAtByMissionId: sanitizeLastCompletedAt(
      rawValue.lastCompletedAtByMissionId,
    ),
  };
}

function sanitizeCompletedMissionIds(value: unknown) {
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
