import {
  getWeakPointKey,
  type WeakPoint,
  type WeakPointItemType,
  type WeakPointStore,
} from '../../../lib/progress/weakPoints';

export type ReviewResult = 'correct' | 'incorrect';

export type ReviewBatchCompletionResult = {
  weakPointKey: string;
  itemId: string;
  itemType: WeakPointItemType;
  missionId: string;
  result: ReviewResult;
};

export function buildReviewBatchCompletionResults(
  weakPoints: WeakPoint[],
  resultsByWeakPointKey: Record<string, ReviewResult>,
): ReviewBatchCompletionResult[] {
  return weakPoints.flatMap((weakPoint) => {
    const weakPointKey = getWeakPointKey(weakPoint);
    const result = resultsByWeakPointKey[weakPointKey];

    if (!result) {
      return [];
    }

    return {
      weakPointKey,
      itemId: weakPoint.itemId,
      itemType: weakPoint.itemType,
      missionId: weakPoint.missionId,
      result,
    };
  });
}

export function applyReviewBatchResults(
  currentWeakPoints: WeakPointStore,
  itemResults: ReviewBatchCompletionResult[],
): WeakPointStore {
  const weakPointsByKey = { ...currentWeakPoints.weakPointsByKey };

  itemResults.forEach((itemResult) => {
    if (itemResult.result !== 'correct') {
      return;
    }

    const weakPoint = weakPointsByKey[itemResult.weakPointKey];

    if (!weakPoint) {
      return;
    }

    if (weakPoint.missCount <= 1) {
      delete weakPointsByKey[itemResult.weakPointKey];
      return;
    }

    weakPointsByKey[itemResult.weakPointKey] = {
      ...weakPoint,
      missCount: weakPoint.missCount - 1,
    };
  });

  return {
    ...currentWeakPoints,
    weakPointsByKey,
  };
}
