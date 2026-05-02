import { useSyncExternalStore } from 'react';

export const WEAK_POINTS_STORAGE_KEY = 'japanese-os.weak-points.v1';

const WEAK_POINTS_UPDATED_EVENT = 'japanese-os:weak-points-updated';
const WEAK_POINTS_VERSION = 2;

export type WeakPointItemType =
  | 'grammar-drill'
  | 'listening-check'
  | 'output-task'
  | 'reading-check';

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
  weakPointsByKey: Record<string, WeakPoint>;
}

const EMPTY_WEAK_POINTS: WeakPointStore = {
  version: WEAK_POINTS_VERSION,
  weakPointsByKey: {},
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

type WeakPointIdentity = {
  itemId: string;
  itemType: WeakPointItemType;
  missionId: string;
};

export function getWeakPointKey({
  itemId,
  itemType,
  missionId,
}: WeakPointIdentity) {
  return `${itemType}:${missionId}:${itemId}`;
}

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
  const weakPointKey = getWeakPointKey({ itemId, itemType, missionId });
  const existingWeakPoint = currentWeakPoints.weakPointsByKey[weakPointKey];

  const nextWeakPoints = parseWeakPoints({
    ...currentWeakPoints,
    weakPointsByKey: {
      ...currentWeakPoints.weakPointsByKey,
      [weakPointKey]: {
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

export function resolveWeakPointSuccess(identity: WeakPointIdentity | string) {
  const currentWeakPoints = readWeakPoints();
  const weakPointKey = resolveWeakPointKey(currentWeakPoints, identity);

  if (!weakPointKey) {
    return readWeakPoints();
  }

  const existingWeakPoint = currentWeakPoints.weakPointsByKey[weakPointKey];

  if (!existingWeakPoint) {
    return currentWeakPoints;
  }

  const nextWeakPointsByKey = { ...currentWeakPoints.weakPointsByKey };

  if (existingWeakPoint.missCount <= 1) {
    delete nextWeakPointsByKey[weakPointKey];
  } else {
    nextWeakPointsByKey[weakPointKey] = {
      ...existingWeakPoint,
      missCount: existingWeakPoint.missCount - 1,
    };
  }

  const nextWeakPoints = parseWeakPoints({
    ...currentWeakPoints,
    weakPointsByKey: nextWeakPointsByKey,
  });

  writeWeakPoints(nextWeakPoints);
  return nextWeakPoints;
}

export function resetWeakPoints() {
  writeWeakPoints(EMPTY_WEAK_POINTS);
  return EMPTY_WEAK_POINTS;
}

export function getWeakPointList(weakPoints: WeakPointStore) {
  return Object.values(weakPoints.weakPointsByKey).sort((left, right) => {
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
    weakPointsByKey: sanitizeWeakPointStore(rawValue),
  };
}

function sanitizeWeakPointStore(rawValue: Record<string, unknown>) {
  const weakPointsByKey: Record<string, WeakPoint> = {};

  if (isRecord(rawValue.weakPointsByKey)) {
    mergeWeakPointEntries(weakPointsByKey, rawValue.weakPointsByKey, 'compound-key');
  }

  if (isRecord(rawValue.weakPointsByItemId)) {
    mergeWeakPointEntries(weakPointsByKey, rawValue.weakPointsByItemId, 'legacy-item-id');
  }

  return weakPointsByKey;
}

function mergeWeakPointEntries(
  weakPointsByKey: Record<string, WeakPoint>,
  entries: Record<string, unknown>,
  keyMode: 'compound-key' | 'legacy-item-id',
) {
  Object.entries(entries).forEach(([key, entry]) => {
    if (!isRecord(entry)) {
      return;
    }

    const keyParts = keyMode === 'compound-key' ? parseWeakPointKey(key) : null;
    const itemId =
      typeof entry.itemId === 'string' && entry.itemId.trim().length > 0
        ? entry.itemId
        : keyParts?.itemId ?? key;
    const itemType = isWeakPointItemType(entry.itemType) ? entry.itemType : null;
    const missionId =
      typeof entry.missionId === 'string' && entry.missionId.trim().length > 0
        ? entry.missionId
        : keyParts?.missionId ?? null;
    const missCount =
      typeof entry.missCount === 'number' && Number.isInteger(entry.missCount) && entry.missCount > 0
        ? entry.missCount
        : null;
    const lastMissedAt =
      typeof entry.lastMissedAt === 'string' && !Number.isNaN(Date.parse(entry.lastMissedAt))
        ? entry.lastMissedAt
        : null;

    if (!itemType || !missionId || !missCount || !lastMissedAt) {
      return;
    }

    const weakPoint = {
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
    const weakPointKey = getWeakPointKey(weakPoint);
    weakPointsByKey[weakPointKey] = mergeWeakPoint(
      weakPointsByKey[weakPointKey],
      weakPoint,
    );
  });
}

function resolveWeakPointKey(
  weakPoints: WeakPointStore,
  identity: WeakPointIdentity | string,
) {
  if (typeof identity !== 'string') {
    if (!identity.itemId.trim() || !identity.missionId.trim()) {
      return null;
    }

    const weakPointKey = getWeakPointKey(identity);
    return weakPoints.weakPointsByKey[weakPointKey] ? weakPointKey : null;
  }

  const rawIdentity = identity.trim();

  if (!rawIdentity) {
    return null;
  }

  if (weakPoints.weakPointsByKey[rawIdentity]) {
    return rawIdentity;
  }

  return Object.entries(weakPoints.weakPointsByKey).find(
    ([, weakPoint]) => weakPoint.itemId === rawIdentity,
  )?.[0] ?? null;
}

function mergeWeakPoint(
  currentWeakPoint: WeakPoint | undefined,
  nextWeakPoint: WeakPoint,
) {
  if (!currentWeakPoint) {
    return nextWeakPoint;
  }

  const nextMissCount = Math.max(currentWeakPoint.missCount, nextWeakPoint.missCount);
  const nextLastMissedAt =
    Date.parse(nextWeakPoint.lastMissedAt) > Date.parse(currentWeakPoint.lastMissedAt)
      ? nextWeakPoint.lastMissedAt
      : currentWeakPoint.lastMissedAt;

  return {
    ...currentWeakPoint,
    ...nextWeakPoint,
    missCount: nextMissCount,
    lastMissedAt: nextLastMissedAt,
  };
}

function parseWeakPointKey(key: string): WeakPointIdentity | null {
  const [itemType, missionId, ...itemIdParts] = key.split(':');
  const itemId = itemIdParts.join(':');

  if (!isWeakPointItemType(itemType) || !missionId || !itemId) {
    return null;
  }

  return {
    itemId,
    itemType,
    missionId,
  };
}

function isWeakPointItemType(value: unknown): value is WeakPointItemType {
  return (
    value === 'grammar-drill' ||
    value === 'listening-check' ||
    value === 'output-task' ||
    value === 'reading-check'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
