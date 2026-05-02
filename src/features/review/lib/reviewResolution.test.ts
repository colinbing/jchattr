import { describe, expect, it } from 'vitest';
import {
  getWeakPointKey,
  type WeakPoint,
  type WeakPointStore,
} from '../../../lib/progress/weakPoints';
import {
  applyReviewBatchResults,
  buildReviewBatchCompletionResults,
  type ReviewBatchCompletionResult,
} from './reviewResolution';

describe('applyReviewBatchResults', () => {
  it('removes a weak point when the final result is correct', () => {
    const weakPoint = createWeakPoint();
    const nextWeakPoints = applyReviewBatchResults(
      createWeakPointStore([weakPoint]),
      [createResult(weakPoint, 'correct')],
    );

    expect(nextWeakPoints.weakPointsByKey[getWeakPointKey(weakPoint)]).toBeUndefined();
  });

  it('decrements a repeated weak point when the final result is correct', () => {
    const weakPoint = createWeakPoint({ missCount: 2 });
    const nextWeakPoints = applyReviewBatchResults(
      createWeakPointStore([weakPoint]),
      [createResult(weakPoint, 'correct')],
    );

    expect(nextWeakPoints.weakPointsByKey[getWeakPointKey(weakPoint)]?.missCount).toBe(1);
  });

  it('keeps a weak point open when the final result is incorrect', () => {
    const weakPoint = createWeakPoint();
    const nextWeakPoints = applyReviewBatchResults(
      createWeakPointStore([weakPoint]),
      [createResult(weakPoint, 'incorrect')],
    );

    expect(nextWeakPoints.weakPointsByKey[getWeakPointKey(weakPoint)]).toEqual(weakPoint);
  });

  it('keeps a weak point open when a correct answer is edited to an incorrect final result', () => {
    const weakPoint = createWeakPoint();
    const itemResults = buildReviewBatchCompletionResults(
      [weakPoint],
      {
        [getWeakPointKey(weakPoint)]: 'incorrect',
      },
    );
    const nextWeakPoints = applyReviewBatchResults(
      createWeakPointStore([weakPoint]),
      itemResults,
    );

    expect(nextWeakPoints.weakPointsByKey[getWeakPointKey(weakPoint)]).toEqual(weakPoint);
  });

  it('ignores a missing weak point without crashing', () => {
    const weakPoint = createWeakPoint();
    const nextWeakPoints = applyReviewBatchResults(
      createWeakPointStore([]),
      [createResult(weakPoint, 'correct')],
    );

    expect(nextWeakPoints.weakPointsByKey).toEqual({});
  });

  it('applies mixed batch results independently', () => {
    const correctWeakPoint = createWeakPoint({
      itemId: 'drill-topic-1',
      missCount: 1,
    });
    const repeatedWeakPoint = createWeakPoint({
      itemId: 'drill-topic-2',
      missCount: 3,
    });
    const incorrectWeakPoint = createWeakPoint({
      itemId: 'output-self-intro',
      itemType: 'output-task',
      missionId: 'mission-output-daily-lines',
      contentId: 'output-self-intro',
    });
    const nextWeakPoints = applyReviewBatchResults(
      createWeakPointStore([correctWeakPoint, repeatedWeakPoint, incorrectWeakPoint]),
      [
        createResult(correctWeakPoint, 'correct'),
        createResult(repeatedWeakPoint, 'correct'),
        createResult(incorrectWeakPoint, 'incorrect'),
      ],
    );

    expect(nextWeakPoints.weakPointsByKey[getWeakPointKey(correctWeakPoint)]).toBeUndefined();
    expect(nextWeakPoints.weakPointsByKey[getWeakPointKey(repeatedWeakPoint)]?.missCount).toBe(2);
    expect(nextWeakPoints.weakPointsByKey[getWeakPointKey(incorrectWeakPoint)]).toEqual(incorrectWeakPoint);
  });
});

function createWeakPoint(overrides: Partial<WeakPoint> = {}): WeakPoint {
  return {
    itemId: 'drill-topic-1',
    itemType: 'grammar-drill',
    missionId: 'mission-grammar-topic-desu',
    contentId: 'grammar-topic-desu',
    missCount: 1,
    lastMissedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function createResult(
  weakPoint: WeakPoint,
  result: ReviewBatchCompletionResult['result'],
): ReviewBatchCompletionResult {
  return {
    weakPointKey: getWeakPointKey(weakPoint),
    itemId: weakPoint.itemId,
    itemType: weakPoint.itemType,
    missionId: weakPoint.missionId,
    result,
  };
}

function createWeakPointStore(weakPoints: WeakPoint[]): WeakPointStore {
  return {
    version: 2,
    weakPointsByKey: Object.fromEntries(
      weakPoints.map((weakPoint) => [getWeakPointKey(weakPoint), weakPoint]),
    ),
  };
}
