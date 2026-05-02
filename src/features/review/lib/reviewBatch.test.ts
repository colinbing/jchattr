import { describe, expect, it } from 'vitest';
import {
  getWeakPointKey,
  type WeakPoint,
  type WeakPointStore,
} from '../../../lib/progress/weakPoints';
import { getStarterContent } from '../../../lib/content/loader';
import { REVIEW_BATCH_SIZE, selectReviewBatch } from './reviewBatch';

const starterContent = getStarterContent();

describe('selectReviewBatch', () => {
  it('sorts higher miss counts first and uses recency as a tie breaker', () => {
    const weakPoints = createWeakPointStore([
      createWeakPoint({
        itemId: 'drill-topic-1',
        missCount: 1,
        lastMissedAt: '2026-01-01T00:00:00.000Z',
      }),
      createWeakPoint({
        itemId: 'drill-topic-2',
        missCount: 3,
        lastMissedAt: '2026-01-01T00:00:00.000Z',
      }),
      createWeakPoint({
        itemId: 'listening-home-study',
        itemType: 'listening-check',
        missionId: 'mission-listening-place-de',
        contentId: 'listening-home-study',
        missCount: 3,
        lastMissedAt: '2026-01-02T00:00:00.000Z',
      }),
    ]);

    expect(selectReviewBatch(weakPoints, starterContent).map((item) => item.weakPoint.itemId)).toEqual([
      'listening-home-study',
      'drill-topic-2',
      'drill-topic-1',
    ]);
  });

  it('skips weak points that no longer resolve to content', () => {
    const weakPoints = createWeakPointStore([
      createWeakPoint({ itemId: 'missing-drill' }),
      createWeakPoint({ itemId: 'drill-topic-1' }),
    ]);

    expect(selectReviewBatch(weakPoints, starterContent).map((item) => item.weakPoint.itemId)).toEqual([
      'drill-topic-1',
    ]);
  });

  it('respects the batch size', () => {
    const weakPoints = createWeakPointStore([
      createWeakPoint({ itemId: 'drill-topic-1' }),
      createWeakPoint({ itemId: 'drill-topic-2' }),
      createWeakPoint({
        itemId: 'output-self-intro',
        itemType: 'output-task',
        missionId: 'mission-output-daily-lines',
        contentId: 'output-self-intro',
      }),
      createWeakPoint({
        itemId: 'reading-check-kore-eigo-hon-meaning',
        itemType: 'reading-check',
        missionId: 'mission-reading-starter-recognition',
        contentId: 'ex-kore-eigo-hon',
      }),
    ]);

    expect(selectReviewBatch(weakPoints, starterContent)).toHaveLength(REVIEW_BATCH_SIZE);
    expect(selectReviewBatch(weakPoints, starterContent, 2)).toHaveLength(2);
  });
});

function createWeakPoint(overrides: Partial<WeakPoint>): WeakPoint {
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

function createWeakPointStore(weakPoints: WeakPoint[]): WeakPointStore {
  return {
    version: 2,
    weakPointsByKey: Object.fromEntries(
      weakPoints.map((weakPoint) => [getWeakPointKey(weakPoint), weakPoint]),
    ),
  };
}
