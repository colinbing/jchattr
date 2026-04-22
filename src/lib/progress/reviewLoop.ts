import { useSyncExternalStore } from 'react';

export const REVIEW_LOOP_STORAGE_KEY = 'japanese-os.review-loop.v1';

const REVIEW_LOOP_UPDATED_EVENT = 'japanese-os:review-loop-updated';
const REVIEW_LOOP_VERSION = 1;

export interface ReviewLoopProgress {
  version: number;
  completedBatchCount: number;
  lastCompletedAt: string | null;
  lastCompletedItemIds: string[];
}

const EMPTY_REVIEW_LOOP_PROGRESS: ReviewLoopProgress = {
  version: REVIEW_LOOP_VERSION,
  completedBatchCount: 0,
  lastCompletedAt: null,
  lastCompletedItemIds: [],
};

let cachedRawReviewLoopProgress: string | null | undefined;
let cachedReviewLoopProgress: ReviewLoopProgress = EMPTY_REVIEW_LOOP_PROGRESS;

export function getEmptyReviewLoopProgress() {
  return EMPTY_REVIEW_LOOP_PROGRESS;
}

export function useReviewLoopProgress() {
  return useSyncExternalStore(
    subscribeToReviewLoopProgress,
    readReviewLoopProgress,
    getEmptyReviewLoopProgress,
  );
}

export function readReviewLoopProgress(): ReviewLoopProgress {
  if (typeof window === 'undefined') {
    return EMPTY_REVIEW_LOOP_PROGRESS;
  }

  try {
    const rawProgress = window.localStorage.getItem(REVIEW_LOOP_STORAGE_KEY);

    if (rawProgress === cachedRawReviewLoopProgress) {
      return cachedReviewLoopProgress;
    }

    if (!rawProgress) {
      cachedRawReviewLoopProgress = rawProgress;
      cachedReviewLoopProgress = EMPTY_REVIEW_LOOP_PROGRESS;
      return cachedReviewLoopProgress;
    }

    cachedRawReviewLoopProgress = rawProgress;
    cachedReviewLoopProgress = parseReviewLoopProgress(JSON.parse(rawProgress));
    return cachedReviewLoopProgress;
  } catch {
    cachedRawReviewLoopProgress = undefined;
    cachedReviewLoopProgress = EMPTY_REVIEW_LOOP_PROGRESS;
    return cachedReviewLoopProgress;
  }
}

export function markReviewBatchComplete(
  itemIds: string[],
  completedAt = new Date(),
) {
  const normalizedItemIds = Array.from(
    new Set(itemIds.filter((itemId) => itemId.trim().length > 0)),
  );
  const currentProgress = readReviewLoopProgress();
  const nextProgress = parseReviewLoopProgress({
    ...currentProgress,
    completedBatchCount: currentProgress.completedBatchCount + 1,
    lastCompletedAt: completedAt.toISOString(),
    lastCompletedItemIds: normalizedItemIds,
  });

  writeReviewLoopProgress(nextProgress);
  return nextProgress;
}

function subscribeToReviewLoopProgress(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleReviewLoopUpdate = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === REVIEW_LOOP_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(
    REVIEW_LOOP_UPDATED_EVENT,
    handleReviewLoopUpdate as EventListener,
  );
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(
      REVIEW_LOOP_UPDATED_EVENT,
      handleReviewLoopUpdate as EventListener,
    );
    window.removeEventListener('storage', handleStorage);
  };
}

function writeReviewLoopProgress(progress: ReviewLoopProgress) {
  if (typeof window === 'undefined') {
    return;
  }

  const serializedProgress = JSON.stringify(progress);
  cachedRawReviewLoopProgress = serializedProgress;
  cachedReviewLoopProgress = progress;

  window.localStorage.setItem(REVIEW_LOOP_STORAGE_KEY, serializedProgress);
  window.dispatchEvent(new Event(REVIEW_LOOP_UPDATED_EVENT));
}

function parseReviewLoopProgress(rawValue: unknown): ReviewLoopProgress {
  if (!isRecord(rawValue)) {
    return EMPTY_REVIEW_LOOP_PROGRESS;
  }

  return {
    version: REVIEW_LOOP_VERSION,
    completedBatchCount:
      typeof rawValue.completedBatchCount === 'number' &&
      Number.isInteger(rawValue.completedBatchCount) &&
      rawValue.completedBatchCount >= 0
        ? rawValue.completedBatchCount
        : 0,
    lastCompletedAt:
      typeof rawValue.lastCompletedAt === 'string' &&
      !Number.isNaN(Date.parse(rawValue.lastCompletedAt))
        ? rawValue.lastCompletedAt
        : null,
    lastCompletedItemIds: sanitizeItemIds(rawValue.lastCompletedItemIds),
  };
}

function sanitizeItemIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value.filter(
        (item): item is string => typeof item === 'string' && item.trim().length > 0,
      ),
    ),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
