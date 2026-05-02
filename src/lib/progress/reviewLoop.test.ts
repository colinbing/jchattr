import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMockWindow, type MockWindowControls } from '../../test/mockWindow';
import {
  REVIEW_LOOP_STORAGE_KEY,
  getEmptyReviewLoopProgress,
  markReviewBatchComplete,
  readReviewLoopProgress,
  resetReviewLoopProgress,
} from './reviewLoop';

let mockWindow: MockWindowControls;

describe('review loop progress', () => {
  beforeEach(() => {
    mockWindow = installMockWindow();
    resetReviewLoopProgress();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads empty progress when localStorage is empty', () => {
    expect(readReviewLoopProgress()).toEqual(getEmptyReviewLoopProgress());
  });

  it('falls back safely when localStorage is corrupted', () => {
    mockWindow.setRaw(REVIEW_LOOP_STORAGE_KEY, '{not valid json');

    expect(readReviewLoopProgress()).toEqual(getEmptyReviewLoopProgress());
  });

  it('marks a completed review batch with deduped item ids', () => {
    expect(
      markReviewBatchComplete(
        ['weak-1', 'weak-2', 'weak-1', ''],
        new Date('2026-05-02T12:00:00.000Z'),
      ),
    ).toEqual({
      version: 1,
      completedBatchCount: 1,
      lastCompletedAt: '2026-05-02T12:00:00.000Z',
      lastCompletedItemIds: ['weak-1', 'weak-2'],
    });
  });

  it('sanitizes malformed stored review-loop fields', () => {
    mockWindow.setRaw(
      REVIEW_LOOP_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        completedBatchCount: -1,
        lastCompletedAt: 'not a date',
        lastCompletedItemIds: ['weak-1', 'weak-1', '', 123],
      }),
    );

    expect(readReviewLoopProgress()).toEqual({
      version: 1,
      completedBatchCount: 0,
      lastCompletedAt: null,
      lastCompletedItemIds: ['weak-1'],
    });
  });

  it('resets review loop progress back to empty storage', () => {
    markReviewBatchComplete(['weak-1']);

    expect(resetReviewLoopProgress()).toEqual(getEmptyReviewLoopProgress());
    expect(readReviewLoopProgress()).toEqual(getEmptyReviewLoopProgress());
  });
});
