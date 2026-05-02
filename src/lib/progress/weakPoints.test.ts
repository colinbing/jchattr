import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  WEAK_POINTS_STORAGE_KEY,
  getWeakPointList,
  getWeakPointKey,
  readWeakPoints,
  recordWeakPoint,
  resetWeakPoints,
  resolveWeakPointSuccess,
} from './weakPoints';
import { installMockWindow, type MockWindowControls } from '../../test/mockWindow';

let mockWindow: MockWindowControls;

describe('weak point progress', () => {
  beforeEach(() => {
    mockWindow = installMockWindow();
    resetWeakPoints();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('records a miss as a weak point', () => {
    const weakPoints = recordWeakPoint({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
      missedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    const weakPointKey = getWeakPointKey({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
    });

    expect(weakPoints.weakPointsByKey[weakPointKey]).toMatchObject({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
      missCount: 1,
      lastMissedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('builds compound keys from item type, mission id, and item id', () => {
    expect(
      getWeakPointKey({
        itemId: 'shared-item',
        itemType: 'grammar-drill',
        missionId: 'mission-a',
      }),
    ).toBe('grammar-drill:mission-a:shared-item');
  });

  it('increments repeat misses for the same item id', () => {
    recordWeakPoint({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
      missedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const weakPoints = recordWeakPoint({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
      missedAt: new Date('2026-01-02T00:00:00.000Z'),
    });

    expect(getWeakPointList(weakPoints)[0]).toMatchObject({
      missCount: 2,
      lastMissedAt: '2026-01-02T00:00:00.000Z',
    });
  });

  it('does not collide when different weak points share an item id', () => {
    const firstWeakPoint = {
      itemId: 'shared-item',
      itemType: 'grammar-drill' as const,
      missionId: 'mission-a',
    };
    const secondWeakPoint = {
      itemId: 'shared-item',
      itemType: 'reading-check' as const,
      missionId: 'mission-a',
    };
    const thirdWeakPoint = {
      itemId: 'shared-item',
      itemType: 'grammar-drill' as const,
      missionId: 'mission-b',
    };

    recordWeakPoint(firstWeakPoint);
    recordWeakPoint(secondWeakPoint);
    const weakPoints = recordWeakPoint(thirdWeakPoint);

    expect(weakPoints.weakPointsByKey[getWeakPointKey(firstWeakPoint)]).toMatchObject(firstWeakPoint);
    expect(weakPoints.weakPointsByKey[getWeakPointKey(secondWeakPoint)]).toMatchObject(secondWeakPoint);
    expect(weakPoints.weakPointsByKey[getWeakPointKey(thirdWeakPoint)]).toMatchObject(thirdWeakPoint);
    expect(getWeakPointList(weakPoints)).toHaveLength(3);
  });

  it('decrements and then removes a weak point after successes', () => {
    recordWeakPoint({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
    });
    recordWeakPoint({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
    });

    const weakPointIdentity = {
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill' as const,
      missionId: 'mission-grammar-topic-desu',
    };
    const weakPointKey = getWeakPointKey(weakPointIdentity);

    expect(resolveWeakPointSuccess(weakPointIdentity).weakPointsByKey[weakPointKey]?.missCount).toBe(1);
    expect(resolveWeakPointSuccess(weakPointIdentity).weakPointsByKey[weakPointKey]).toBeUndefined();
  });

  it('resolves only the intended compound key', () => {
    const grammarWeakPoint = {
      itemId: 'shared-item',
      itemType: 'grammar-drill' as const,
      missionId: 'mission-a',
    };
    const readingWeakPoint = {
      itemId: 'shared-item',
      itemType: 'reading-check' as const,
      missionId: 'mission-a',
    };

    recordWeakPoint(grammarWeakPoint);
    recordWeakPoint(readingWeakPoint);
    const weakPoints = resolveWeakPointSuccess(grammarWeakPoint);

    expect(weakPoints.weakPointsByKey[getWeakPointKey(grammarWeakPoint)]).toBeUndefined();
    expect(weakPoints.weakPointsByKey[getWeakPointKey(readingWeakPoint)]).toMatchObject(readingWeakPoint);
  });

  it('ignores empty item or mission ids', () => {
    recordWeakPoint({
      itemId: '',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
    });
    recordWeakPoint({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: '',
    });

    expect(getWeakPointList(readWeakPoints())).toHaveLength(0);
  });

  it('falls back safely when localStorage is corrupted', () => {
    mockWindow.setRaw(WEAK_POINTS_STORAGE_KEY, '{not valid json');

    expect(readWeakPoints()).toEqual({
      version: 2,
      weakPointsByKey: {},
    });
  });

  it('migrates legacy item-id keyed storage into compound keys', () => {
    mockWindow.setRaw(
      WEAK_POINTS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        weakPointsByItemId: {
          'drill-topic-1': {
            itemId: 'drill-topic-1',
            itemType: 'grammar-drill',
            missionId: 'mission-grammar-topic-desu',
            missCount: 2,
            lastMissedAt: '2026-01-02T00:00:00.000Z',
          },
        },
      }),
    );

    const weakPointKey = getWeakPointKey({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
    });

    expect(readWeakPoints().weakPointsByKey[weakPointKey]).toMatchObject({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
      missCount: 2,
    });
  });
});
