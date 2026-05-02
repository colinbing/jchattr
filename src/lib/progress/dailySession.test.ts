import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMockWindow, type MockWindowControls } from '../../test/mockWindow';
import {
  DAILY_SESSION_STORAGE_KEY,
  getCurrentStudyDayKey,
  markDailySessionPlanItemComplete,
  readDailySessionRecord,
  resetDailySessionProgress,
  writeDailySessionPlan,
} from './dailySession';

let mockWindow: MockWindowControls;

describe('daily session progress', () => {
  beforeEach(() => {
    mockWindow = installMockWindow();
    resetDailySessionProgress();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads an empty record for the requested study day when localStorage is empty', () => {
    expect(readDailySessionRecord('2026-05-02')).toMatchObject({
      version: 1,
      currentStudyDayKey: '2026-05-02',
      plansByStudyDay: {},
      completedPlanItemKeysByStudyDay: {},
      completedStudyDayKeys: [],
    });
  });

  it('falls back safely when localStorage is corrupted', () => {
    mockWindow.setRaw(DAILY_SESSION_STORAGE_KEY, '{not valid json');

    expect(readDailySessionRecord('2026-05-02')).toMatchObject({
      currentStudyDayKey: '2026-05-02',
      plansByStudyDay: {},
      completedPlanItemKeysByStudyDay: {},
      completedStudyDayKeys: [],
    });
  });

  it('parses records without completed plan item keys safely', () => {
    mockWindow.setRaw(
      DAILY_SESSION_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        currentStudyDayKey: '2026-05-02',
        plansByStudyDay: {
          '2026-05-02': {
            version: 1,
            items: [],
          },
        },
        completedStudyDayKeys: ['2026-05-01'],
        updatedAt: '2026-05-02T12:00:00.000Z',
      }),
    );

    expect(readDailySessionRecord('2026-05-02')).toMatchObject({
      currentStudyDayKey: '2026-05-02',
      completedPlanItemKeysByStudyDay: {},
      completedStudyDayKeys: ['2026-05-01'],
    });
  });

  it('marks only the matching reinforce plan key complete for the current study day', () => {
    const record = markDailySessionPlanItemComplete(
      '2026-05-02',
      'mission:mission-grammar-topic-desu:reinforce',
    );

    expect(record.completedPlanItemKeysByStudyDay['2026-05-02']).toEqual([
      'mission:mission-grammar-topic-desu:reinforce',
    ]);
    expect(
      record.completedPlanItemKeysByStudyDay['2026-05-02'].includes(
        'mission:mission-grammar-topic-desu:default',
      ),
    ).toBe(false);
  });

  it('keeps completed plan item keys separate across the 3 AM ET study-day rollover', () => {
    markDailySessionPlanItemComplete(
      '2026-05-01',
      'mission:mission-grammar-topic-desu:default',
    );
    const nextDayRecord = markDailySessionPlanItemComplete(
      '2026-05-02',
      'mission:mission-grammar-topic-desu:reinforce',
    );

    expect(nextDayRecord.completedPlanItemKeysByStudyDay['2026-05-01']).toEqual([
      'mission:mission-grammar-topic-desu:default',
    ]);
    expect(nextDayRecord.completedPlanItemKeysByStudyDay['2026-05-02']).toEqual([
      'mission:mission-grammar-topic-desu:reinforce',
    ]);
  });

  it('keeps the previous study day before the 3 AM ET rollover', () => {
    expect(getCurrentStudyDayKey(new Date('2026-05-02T06:59:59.000Z'))).toBe(
      '2026-05-01',
    );
    expect(getCurrentStudyDayKey(new Date('2026-05-02T07:00:00.000Z'))).toBe(
      '2026-05-02',
    );
  });

  it('resets daily session progress for the current study day', () => {
    writeDailySessionPlan('2026-05-02', { version: 1, items: [] }, true);
    markDailySessionPlanItemComplete(
      '2026-05-02',
      'mission:mission-grammar-topic-desu:default',
    );

    const resetRecord = resetDailySessionProgress();

    expect(resetRecord.plansByStudyDay).toEqual({});
    expect(resetRecord.completedPlanItemKeysByStudyDay).toEqual({});
    expect(resetRecord.completedStudyDayKeys).toEqual([]);
  });
});
