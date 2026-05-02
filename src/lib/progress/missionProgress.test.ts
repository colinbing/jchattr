import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MISSION_PROGRESS_STORAGE_KEY,
  getEmptyMissionProgress,
  getMissionProgressEntry,
  markMissionExposureComplete,
  readMissionProgress,
  resetMissionProgress,
} from './missionProgress';
import { installMockWindow, type MockWindowControls } from '../../test/mockWindow';

let mockWindow: MockWindowControls;

describe('mission progress', () => {
  beforeEach(() => {
    mockWindow = installMockWindow();
    resetMissionProgress();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads empty progress when localStorage is empty', () => {
    expect(readMissionProgress()).toEqual(getEmptyMissionProgress());
  });

  it('falls back safely when localStorage is corrupted', () => {
    mockWindow.setRaw(MISSION_PROGRESS_STORAGE_KEY, '{not valid json');

    expect(readMissionProgress()).toEqual(getEmptyMissionProgress());
  });

  it('marks exposure completion without implying mastery after a miss', () => {
    const progress = markMissionExposureComplete(
      'mission-grammar-topic-desu',
      {
        attemptedCount: 2,
        correctCount: 1,
        incorrectCount: 1,
        supportedCount: 0,
        totalCount: 2,
        isExposureComplete: true,
        isMasteryComplete: false,
      },
      new Date('2026-01-01T00:00:00.000Z'),
    );
    const entry = getMissionProgressEntry(progress, 'mission-grammar-topic-desu');

    expect(entry).toMatchObject({
      isCompleted: true,
      completionCount: 1,
      lastCompletedAt: '2026-01-01T00:00:00.000Z',
      isMastered: false,
      masteryCount: 0,
    });
    expect(entry.lastAttemptSummary).toMatchObject({
      attemptedCount: 2,
      correctCount: 1,
      incorrectCount: 1,
      isExposureComplete: true,
      isMasteryComplete: false,
    });
  });

  it('marks mastery only for a clean all-correct attempt', () => {
    const progress = markMissionExposureComplete(
      'mission-grammar-topic-desu',
      {
        attemptedCount: 2,
        correctCount: 2,
        incorrectCount: 0,
        supportedCount: 0,
        totalCount: 2,
        isExposureComplete: true,
        isMasteryComplete: true,
      },
      new Date('2026-01-01T00:00:00.000Z'),
    );
    const entry = getMissionProgressEntry(progress, 'mission-grammar-topic-desu');

    expect(entry).toMatchObject({
      isCompleted: true,
      completionCount: 1,
      isMastered: true,
      masteryCount: 1,
      lastMasteredAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('preserves legacy completed missions when old localStorage shape is read', () => {
    mockWindow.setRaw(
      MISSION_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        completedMissionIds: ['mission-grammar-topic-desu'],
        completionCountsByMissionId: {
          'mission-grammar-topic-desu': 2,
        },
        lastCompletedAtByMissionId: {
          'mission-grammar-topic-desu': '2026-01-01T00:00:00.000Z',
        },
      }),
    );

    const entry = getMissionProgressEntry(readMissionProgress(), 'mission-grammar-topic-desu');

    expect(entry).toMatchObject({
      isCompleted: true,
      completionCount: 2,
      lastCompletedAt: '2026-01-01T00:00:00.000Z',
      isMastered: false,
      masteryCount: 0,
      lastAttemptSummary: null,
    });
  });

  it('resets mission progress back to empty storage', () => {
    markMissionExposureComplete(
      'mission-grammar-topic-desu',
      {
        attemptedCount: 1,
        correctCount: 1,
        incorrectCount: 0,
        supportedCount: 0,
        totalCount: 1,
        isExposureComplete: true,
        isMasteryComplete: true,
      },
      new Date('2026-01-01T00:00:00.000Z'),
    );

    expect(resetMissionProgress()).toEqual(getEmptyMissionProgress());
    expect(readMissionProgress()).toEqual(getEmptyMissionProgress());
  });
});
