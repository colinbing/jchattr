import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMockWindow } from '../../test/mockWindow';
import {
  markCapstoneComplete,
  readCapstoneProgress,
} from '../progress/capstoneProgress';
import {
  updateContinueState,
  readContinueState,
} from '../progress/continueState';
import {
  markDailySessionPlanItemComplete,
  readDailySessionRecord,
  writeDailySessionPlan,
} from '../progress/dailySession';
import {
  markMissionExposureComplete,
  readMissionProgress,
} from '../progress/missionProgress';
import {
  markReviewBatchComplete,
  readReviewLoopProgress,
} from '../progress/reviewLoop';
import {
  recordWeakPoint,
  readWeakPoints,
} from '../progress/weakPoints';
import { resetStudyDataStore } from './studyData';

describe('study data reset routing', () => {
  beforeEach(() => {
    installMockWindow();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resets only the selected store for routine reset actions', () => {
    markMissionExposureComplete('mission-grammar-topic-desu');
    recordWeakPoint({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
    });

    resetStudyDataStore('weak-points');

    expect(readWeakPoints().weakPointsByKey).toEqual({});
    expect(readMissionProgress().completedMissionIds).toEqual([
      'mission-grammar-topic-desu',
    ]);
  });

  it('resets all progress stores without resetting preferences', () => {
    markMissionExposureComplete('mission-grammar-topic-desu');
    markCapstoneComplete('capstone-story-ch01-first-day');
    recordWeakPoint({
      itemId: 'drill-topic-1',
      itemType: 'grammar-drill',
      missionId: 'mission-grammar-topic-desu',
    });
    markReviewBatchComplete(['weak-1']);
    writeDailySessionPlan('2026-05-02', { version: 1, items: [] }, true);
    markDailySessionPlanItemComplete(
      '2026-05-02',
      'mission:mission-grammar-topic-desu:default',
    );
    updateContinueState({
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      stepIndex: 1,
    });

    resetStudyDataStore('all-study-data');

    expect(readMissionProgress().completedMissionIds).toEqual([]);
    expect(readCapstoneProgress().completedStoryIds).toEqual([]);
    expect(readWeakPoints().weakPointsByKey).toEqual({});
    expect(readReviewLoopProgress().completedBatchCount).toBe(0);
    expect(readDailySessionRecord('2026-05-02').plansByStudyDay).toEqual({});
    expect(readContinueState().lastActiveMissionId).toBeNull();
  });
});
