import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMockWindow, type MockWindowControls } from '../../test/mockWindow';
import {
  CAPSTONE_PROGRESS_STORAGE_KEY,
  getCapstoneProgressEntry,
  getEmptyCapstoneProgress,
  markCapstoneComplete,
  readCapstoneProgress,
  resetCapstoneProgress,
} from './capstoneProgress';

let mockWindow: MockWindowControls;

describe('capstone progress', () => {
  beforeEach(() => {
    mockWindow = installMockWindow();
    resetCapstoneProgress();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads empty progress when localStorage is empty', () => {
    expect(readCapstoneProgress()).toEqual(getEmptyCapstoneProgress());
  });

  it('falls back safely when localStorage is corrupted', () => {
    mockWindow.setRaw(CAPSTONE_PROGRESS_STORAGE_KEY, '{not valid json');

    expect(readCapstoneProgress()).toEqual(getEmptyCapstoneProgress());
  });

  it('marks and reads capstone completion', () => {
    const progress = markCapstoneComplete(
      'capstone-story-ch01-first-day',
      new Date('2026-05-02T12:00:00.000Z'),
    );

    expect(getCapstoneProgressEntry(progress, 'capstone-story-ch01-first-day')).toEqual({
      isCompleted: true,
      completionCount: 1,
      lastCompletedAt: '2026-05-02T12:00:00.000Z',
    });
  });

  it('sanitizes malformed stored capstone fields', () => {
    mockWindow.setRaw(
      CAPSTONE_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        completedStoryIds: [
          'capstone-story-ch01-first-day',
          'capstone-story-ch01-first-day',
          '',
          123,
        ],
        completionCountsByStoryId: {
          'capstone-story-ch01-first-day': 2,
          invalidNegative: -1,
          invalidFloat: 1.5,
          invalidString: '2',
        },
        lastCompletedAtByStoryId: {
          'capstone-story-ch01-first-day': '2026-05-02T12:00:00.000Z',
          invalidDate: 'not a date',
        },
      }),
    );

    expect(readCapstoneProgress()).toEqual({
      version: 1,
      completedStoryIds: ['capstone-story-ch01-first-day'],
      completionCountsByStoryId: {
        'capstone-story-ch01-first-day': 2,
      },
      lastCompletedAtByStoryId: {
        'capstone-story-ch01-first-day': '2026-05-02T12:00:00.000Z',
      },
    });
  });

  it('resets capstone progress back to empty storage', () => {
    markCapstoneComplete('capstone-story-ch01-first-day');

    expect(resetCapstoneProgress()).toEqual(getEmptyCapstoneProgress());
    expect(readCapstoneProgress()).toEqual(getEmptyCapstoneProgress());
  });
});
