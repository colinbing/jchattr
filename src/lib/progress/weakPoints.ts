import { useSyncExternalStore } from 'react';

export const WEAK_POINTS_STORAGE_KEY = 'japanese-os.weak-points.v1';

const WEAK_POINTS_UPDATED_EVENT = 'japanese-os:weak-points-updated';
const WEAK_POINTS_VERSION = 1;

export type WeakPointItemType =
  | 'grammar-drill'
  | 'listening-check'
  | 'output-task';

export interface WeakPoint {
  itemId: string;
  itemType: WeakPointItemType;
  missionId: string;
  contentId?: string;
  missCount: number;
  lastMissedAt: string;
}

export interface WeakPointStore {
  version: number;
  weakPointsByItemId: Record<string, WeakPoint>;
}

const EMPTY_WEAK_POINTS: WeakPointStore = {
  version: WEAK_POINTS_VERSION,
  weakPointsByItemId: {},
};

let cachedRawWeakPoints: string | null | undefined;
let cachedWeakPoints: WeakPointStore = EMPTY_WEAK_POINTS;

type RecordMissParams = {
  itemId: string;
  itemType: WeakPointItemType;
  missionId: string;
  contentId?: string;
  missedAt?: Date;
};

export function getEmptyWeakPoints(): WeakPointStore {
  return EMPTY_WEAK_POINTS;
}

export function useWeakPoints() {
  return useSyncExternalStore(
    subscribeToWeakPoints,
    readWeakPoints,
    getEmptyWeakPoints,
  );
}

export function readWeakPoints(): WeakPointStore {
  if (typeof window === 'undefined') {
    return EMPTY_WEAK_POINTS;
  }

  try {
    const rawWeakPoints = window.localStorage.getItem(WEAK_POINTS_STORAGE_KEY);

    if (rawWeakPoints === cachedRawWeakPoints) {
      return cachedWeakPoints;
    }

    if (!rawWeakPoints) {
      cachedRawWeakPoints = rawWeakPoints;
      cachedWeakPoints = EMPTY_WEAK_POINTS;
      return cachedWeakPoints;
    }

    cachedRawWeakPoints = rawWeakPoints;
    cachedWeakPoints = parseWeakPoints(JSON.parse(rawWeakPoints));
    return cachedWeakPoints;
  } catch {
    cachedRawWeakPoints = undefined;
    cachedWeakPoints = EMPTY_WEAK_POINTS;
    return cachedWeakPoints;
  }
}

export function recordWeakPoint({
  itemId,
  itemType,
  missionId,
  contentId,
  missedAt = new Date(),
}: RecordMissParams) {
  if (!itemId.trim() || !missionId.trim()) {
    return readWeakPoints();
  }

  const currentWeakPoints = readWeakPoints();
  const existingWeakPoint = currentWeakPoints.weakPointsByItemId[itemId];

  const nextWeakPoints = parseWeakPoints({
    ...currentWeakPoints,
    weakPointsByItemId: {
      ...currentWeakPoints.weakPointsByItemId,
      [itemId]: {
        itemId,
        itemType,
        missionId,
        contentId,
        missCount: (existingWeakPoint?.missCount ?? 0) + 1,
        lastMissedAt: missedAt.toISOString(),
      },
    },
  });

  writeWeakPoints(nextWeakPoints);
  return nextWeakPoints;
}

export function resolveWeakPointSuccess(itemId: string) {
  if (!itemId.trim()) {
    return readWeakPoints();
  }

  const currentWeakPoints = readWeakPoints();
  const existingWeakPoint = currentWeakPoints.weakPointsByItemId[itemId];

  if (!existingWeakPoint) {
    return currentWeakPoints;
  }

  const nextWeakPointsByItemId = { ...currentWeakPoints.weakPointsByItemId };

  if (existingWeakPoint.missCount <= 1) {
    delete nextWeakPointsByItemId[itemId];
  } else {
    nextWeakPointsByItemId[itemId] = {
      ...existingWeakPoint,
      missCount: existingWeakPoint.missCount - 1,
    };
  }

  const nextWeakPoints = parseWeakPoints({
    ...currentWeakPoints,
    weakPointsByItemId: nextWeakPointsByItemId,
  });

  writeWeakPoints(nextWeakPoints);
  return nextWeakPoints;
}

export function getWeakPointList(weakPoints: WeakPointStore) {
  return Object.values(weakPoints.weakPointsByItemId).sort((left, right) => {
    return Date.parse(right.lastMissedAt) - Date.parse(left.lastMissedAt);
  });
}

function subscribeToWeakPoints(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleWeakPointsUpdate = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === WEAK_POINTS_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(
    WEAK_POINTS_UPDATED_EVENT,
    handleWeakPointsUpdate as EventListener,
  );
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(
      WEAK_POINTS_UPDATED_EVENT,
      handleWeakPointsUpdate as EventListener,
    );
    window.removeEventListener('storage', handleStorage);
  };
}

function writeWeakPoints(weakPoints: WeakPointStore) {
  if (typeof window === 'undefined') {
    return;
  }

  const serializedWeakPoints = JSON.stringify(weakPoints);
  cachedRawWeakPoints = serializedWeakPoints;
  cachedWeakPoints = weakPoints;

  window.localStorage.setItem(WEAK_POINTS_STORAGE_KEY, serializedWeakPoints);
  window.dispatchEvent(new Event(WEAK_POINTS_UPDATED_EVENT));
}

function parseWeakPoints(rawValue: unknown): WeakPointStore {
  if (!isRecord(rawValue)) {
    return EMPTY_WEAK_POINTS;
  }

  return {
    version: WEAK_POINTS_VERSION,
    weakPointsByItemId: sanitizeWeakPoints(rawValue.weakPointsByItemId),
  };
}

function sanitizeWeakPoints(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, WeakPoint>>((record, [key, entry]) => {
    if (!isRecord(entry)) {
      return record;
    }

    const itemId = typeof entry.itemId === 'string' && entry.itemId.trim().length > 0
      ? entry.itemId
      : key;
    const itemType = isWeakPointItemType(entry.itemType) ? entry.itemType : null;
    const missionId =
      typeof entry.missionId === 'string' && entry.missionId.trim().length > 0
        ? entry.missionId
        : null;
    const missCount =
      typeof entry.missCount === 'number' && Number.isInteger(entry.missCount) && entry.missCount > 0
        ? entry.missCount
        : null;
    const lastMissedAt =
      typeof entry.lastMissedAt === 'string' && !Number.isNaN(Date.parse(entry.lastMissedAt))
        ? entry.lastMissedAt
        : null;

    if (!itemType || !missionId || !missCount || !lastMissedAt) {
      return record;
    }

    record[itemId] = {
      itemId,
      itemType,
      missionId,
      contentId:
        typeof entry.contentId === 'string' && entry.contentId.trim().length > 0
          ? entry.contentId
          : undefined,
      missCount,
      lastMissedAt,
    };

    return record;
  }, {});
}

function isWeakPointItemType(value: unknown): value is WeakPointItemType {
  return (
    value === 'grammar-drill' ||
    value === 'listening-check' ||
    value === 'output-task'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
