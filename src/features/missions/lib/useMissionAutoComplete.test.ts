import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CONTINUE_STATE_STORAGE_KEY,
  readContinueState,
  updateContinueState,
} from '../../../lib/progress/continueState';
import {
  getMissionProgressEntry,
  readMissionProgress,
  resetMissionProgress,
} from '../../../lib/progress/missionProgress';
import { installMockWindow, type MockWindowControls } from '../../../test/mockWindow';
import { completeMissionExposureIfReady } from './useMissionAutoComplete';

let mockWindow: MockWindowControls;

describe('completeMissionExposureIfReady', () => {
  beforeEach(() => {
    mockWindow = installMockWindow();
    resetMissionProgress();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps continue state while the mission pass is incomplete', () => {
    updateContinueState({
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      stepIndex: 2,
      position: {
        sectionId: 'drills',
        itemIndex: 1,
      },
    });

    const didComplete = completeMissionExposureIfReady('mission-grammar-topic-desu', {
      attemptedCount: 1,
      correctCount: 1,
      incorrectCount: 0,
      supportedCount: 0,
      totalCount: 2,
      isExposureComplete: false,
      isMasteryComplete: false,
    });

    expect(didComplete).toBe(false);
    expect(readContinueState().position).toMatchObject({
      sectionId: 'drills',
      itemIndex: 1,
    });
  });

  it('marks exposure complete and clears matching continue state when the pass is complete', () => {
    updateContinueState({
      missionId: 'mission-grammar-topic-desu',
      missionType: 'grammar',
      stepIndex: 2,
      position: {
        sectionId: 'drills',
        itemIndex: 1,
      },
    });

    const didComplete = completeMissionExposureIfReady('mission-grammar-topic-desu', {
      attemptedCount: 2,
      correctCount: 1,
      incorrectCount: 1,
      supportedCount: 0,
      totalCount: 2,
      isExposureComplete: true,
      isMasteryComplete: false,
    });

    expect(didComplete).toBe(true);
    expect(mockWindow.getRaw(CONTINUE_STATE_STORAGE_KEY)).toContain('"lastActiveMissionId":null');
    expect(getMissionProgressEntry(readMissionProgress(), 'mission-grammar-topic-desu')).toMatchObject({
      isCompleted: true,
      isMastered: false,
      completionCount: 1,
    });
  });
});
